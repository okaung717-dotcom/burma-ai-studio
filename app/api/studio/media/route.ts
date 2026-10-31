import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSpacesUser } from "../../../lib/spaces-auth";
import { insertRows, selectRows, supabaseStorageRequest } from "../../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const user = await getSpacesUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || !MIME_EXTENSIONS[file.type] || file.size < 1 || file.size > 15_000_000) {
    return NextResponse.json({ error: "Choose a JPEG, PNG, or WebP image smaller than 15 MB." }, { status: 400 });
  }
  const assetId = randomUUID();
  const storagePath = `${user.id}/${assetId}.${MIME_EXTENSIONS[file.type]}`;
  try {
    const upload = await supabaseStorageRequest(`object/studio-media/${storagePath}`, {
      method: "POST",
      headers: { "Content-Type": file.type, "x-upsert": "false" },
      body: await file.arrayBuffer(),
    });
    if (!upload.ok) throw new Error(`Storage upload returned ${upload.status}.`);
    await insertRows("studio_assets", {
      id: assetId,
      owner_id: user.id,
      storage_path: storagePath,
      media_type: "image",
      mime_type: file.type,
      byte_size: file.size,
      metadata: { originalName: file.name.slice(0, 200), demoOnly: true },
    });
    return NextResponse.json({ id: assetId, url: `/api/studio/media?id=${assetId}` });
  } catch (error) {
    console.error("Private media upload failed:", error);
    return NextResponse.json({ error: "Private media storage is unavailable." }, { status: 503 });
  }
}

export async function GET(request: Request) {
  const user = await getSpacesUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid asset." }, { status: 400 });
  try {
    const rows = await selectRows<{ storage_path: string; mime_type: string }>("studio_assets", `?select=storage_path,mime_type&id=eq.${id}&owner_id=eq.${user.id}&limit=1`);
    const asset = rows[0];
    if (!asset) return NextResponse.json({ error: "Asset not found." }, { status: 404 });
    const object = await supabaseStorageRequest(`object/studio-media/${asset.storage_path}`);
    if (!object.ok) return NextResponse.json({ error: "Asset not found." }, { status: 404 });
    return new NextResponse(object.body, {
      status: 200,
      headers: { "Content-Type": asset.mime_type, "Cache-Control": "private, max-age=300", "X-Content-Type-Options": "nosniff" },
    });
  } catch (error) {
    console.error("Private media read failed:", error);
    return NextResponse.json({ error: "Private media storage is unavailable." }, { status: 503 });
  }
}
