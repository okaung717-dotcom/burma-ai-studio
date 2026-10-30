import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getSpacesUser } from "../../../lib/spaces-auth";
import { deleteRows, selectRows, upsertRows } from "../../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function edgeUuid(spaceId: string, clientId: string) {
  const hex = createHash("sha256").update(`${spaceId}:${clientId}`).digest("hex").slice(0, 32).split("");
  hex[12] = "4";
  hex[16] = "8";
  const value = hex.join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

function safeText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function stripInlineMedia(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripInlineMedia);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Row).map(([key, item]) => [
    key,
    key === "preview" && typeof item === "string" && item.startsWith("data:") ? undefined : stripInlineMedia(item),
  ]));
}

async function projects(userId: string) {
  const projectRows = await selectRows<Array<Row>[number]>("studio_projects", `?select=id,name,created_at,updated_at&owner_id=eq.${userId}&order=updated_at.desc`);
  const spaceRows = await selectRows<Array<Row>[number]>("studio_spaces", `?select=id,project_id,name,updated_at&owner_id=eq.${userId}&order=updated_at.desc`);
  return projectRows.map((project) => ({
    id: project.id,
    name: project.name,
    createdAt: project.created_at,
    spaces: spaceRows.filter((space) => space.project_id === project.id).map((space) => ({
      id: space.id,
      name: space.name,
      updatedAt: space.updated_at,
      nodeCount: 0,
    })),
  }));
}

export async function GET(request: Request) {
  const user = await getSpacesUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  try {
    if (kind === "projects") return NextResponse.json({ projects: await projects(user.id) });
    if (kind === "workspace") {
      const spaceId = url.searchParams.get("spaceId");
      if (!isUuid(spaceId)) return NextResponse.json({ error: "Invalid space." }, { status: 400 });
      const rows = await selectRows<{ payload: unknown }>("studio_workspace_documents", `?select=payload&space_id=eq.${spaceId}&owner_id=eq.${user.id}&limit=1`);
      return NextResponse.json({ workspace: rows[0]?.payload || null });
    }
    if (kind === "image") {
      const rows = await selectRows<Row>("studio_image_records", `?select=id,prompt,aspect_ratio,quality,favorite,created_at&owner_id=eq.${user.id}&order=created_at.desc&limit=100`);
      return NextResponse.json({ creations: rows.map((row) => ({ id: row.id, prompt: row.prompt, aspect: row.aspect_ratio, quality: row.quality, favorite: row.favorite, createdAt: row.created_at })) });
    }
    return NextResponse.json({ error: "Unknown persistence kind." }, { status: 400 });
  } catch (error) {
    console.error("Studio persistence read failed:", error);
    return NextResponse.json({ error: "Secure persistence is unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const user = await getSpacesUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Row | null;
  if (!body || typeof body.kind !== "string") return NextResponse.json({ error: "Invalid persistence payload." }, { status: 400 });

  try {
    if (body.kind === "projects") {
      const projectItems = Array.isArray(body.projects) ? body.projects.slice(0, 50) as Row[] : [];
      const validProjects = projectItems.filter((item) => isUuid(item.id) && safeText(item.name, 100));
      if (validProjects.length) await upsertRows("studio_projects", validProjects.map((item) => ({
        id: item.id as string,
        owner_id: user.id,
        name: safeText(item.name, 100),
        created_at: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })), "id");
      const spaces = validProjects.flatMap((project) => (Array.isArray(project.spaces) ? project.spaces.slice(0, 100) as Row[] : []).filter((space) => isUuid(space.id) && safeText(space.name, 100)).map((space) => ({
        id: space.id as string,
        project_id: project.id as string,
        owner_id: user.id,
        name: safeText(space.name, 100),
        updated_at: typeof space.updatedAt === "string" ? space.updatedAt : new Date().toISOString(),
      })));
      if (spaces.length) await upsertRows("studio_spaces", spaces, "id");
      return NextResponse.json({ ok: true, importedProjects: validProjects.length, importedSpaces: spaces.length });
    }

    if (body.kind === "workspace") {
      if (!isUuid(body.spaceId) || !body.workspace || typeof body.workspace !== "object") return NextResponse.json({ error: "Invalid workspace." }, { status: 400 });
      const workspace = stripInlineMedia(body.workspace) as Row;
      const pages = Array.isArray(workspace.pages) ? workspace.pages.slice(0, 50) as Row[] : [];
      if (JSON.stringify(workspace).length > 2_000_000) return NextResponse.json({ error: "Workspace is too large." }, { status: 413 });
      const ownedSpace = await selectRows<{ id: string }>("studio_spaces", `?select=id&id=eq.${body.spaceId}&owner_id=eq.${user.id}&limit=1`);
      if (!ownedSpace.length) return NextResponse.json({ error: "Save the project before importing this workspace." }, { status: 409 });
      await upsertRows("studio_workspace_documents", { space_id: body.spaceId, owner_id: user.id, version: 2, payload: workspace, updated_at: new Date().toISOString() }, "space_id");
      const validPages = pages.filter((page) => isUuid(page.id) && safeText(page.name, 60));
      if (validPages.length) await upsertRows("studio_pages", validPages.map((page, position) => ({ id: page.id as string, space_id: body.spaceId as string, owner_id: user.id, name: safeText(page.name, 60), position, viewport: page.viewport && typeof page.viewport === "object" ? page.viewport : { x: 0, y: 0, zoom: 1 }, updated_at: new Date().toISOString() })), "id");
      const nodes = validPages.flatMap((page) => (Array.isArray(page.nodes) ? page.nodes.slice(0, 500) as Row[] : []).filter((node) => isUuid(node.id) && node.data && typeof node.data === "object").map((node) => ({ id: node.id as string, space_id: body.spaceId as string, page_id: page.id as string, owner_id: user.id, node_type: safeText((node.data as Row).kind, 30), position: node.position, data: stripInlineMedia(node.data), updated_at: new Date().toISOString() })));
      if (nodes.length) await upsertRows("studio_nodes", nodes, "id");
      const edges = validPages.flatMap((page) => (Array.isArray(page.edges) ? page.edges.slice(0, 1000) as Row[] : []).filter((edge) => typeof edge.id === "string" && isUuid(edge.source) && isUuid(edge.target)).map((edge) => ({ id: edgeUuid(body.spaceId as string, edge.id as string), client_id: (edge.id as string).slice(0, 300), space_id: body.spaceId as string, page_id: page.id as string, owner_id: user.id, source_node_id: edge.source as string, target_node_id: edge.target as string, source_handle: safeText(edge.sourceHandle, 100) || null, target_handle: safeText(edge.targetHandle, 100) || null })));
      if (edges.length) await upsertRows("studio_connections", edges, "id");
      const scope = `space_id=eq.${body.spaceId}&owner_id=eq.${user.id}`;
      await deleteRows("studio_connections", `?${scope}${edges.length ? `&id=not.in.(${edges.map((edge) => edge.id).join(",")})` : ""}`);
      await deleteRows("studio_nodes", `?${scope}${nodes.length ? `&id=not.in.(${nodes.map((node) => node.id).join(",")})` : ""}`);
      await deleteRows("studio_pages", `?${scope}${validPages.length ? `&id=not.in.(${validPages.map((page) => page.id).join(",")})` : ""}`);
      return NextResponse.json({ ok: true, pages: validPages.length, nodes: nodes.length, edges: edges.length });
    }

    if (body.kind === "image") {
      const items = Array.isArray(body.creations) ? body.creations.slice(0, 100) as Row[] : [];
      const rows = items.filter((item) => isUuid(item.id) && safeText(item.prompt, 4000)).map((item) => ({ id: item.id as string, owner_id: user.id, prompt: safeText(item.prompt, 4000), aspect_ratio: safeText(item.aspect, 20), quality: safeText(item.quality, 50), favorite: Boolean(item.favorite), demo_only: true, created_at: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(), updated_at: new Date().toISOString() }));
      if (rows.length) await upsertRows("studio_image_records", rows, "id");
      return NextResponse.json({ ok: true, records: rows.length });
    }

    return NextResponse.json({ error: "Unknown persistence kind." }, { status: 400 });
  } catch (error) {
    console.error("Studio persistence write failed:", error);
    return NextResponse.json({ error: "Secure persistence is unavailable. Your local copy was preserved." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  const user = await getSpacesUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const id = url.searchParams.get("id");
  if (!isUuid(id) || (kind !== "project" && kind !== "space")) return NextResponse.json({ error: "Invalid deletion request." }, { status: 400 });
  try {
    await deleteRows(kind === "project" ? "studio_projects" : "studio_spaces", `?id=eq.${id}&owner_id=eq.${user.id}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Studio persistence deletion failed:", error);
    return NextResponse.json({ error: "Secure deletion is unavailable; no remote records were changed." }, { status: 503 });
  }
}
