export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BUCKET = "website-media";
const OBJECT_PATH = "burma-ai-studio-intro-2026-07-26.mp4";
const SEED_TOKEN = "bas-intro-seed-20260726-6c3e7f9a";
const MAX_SOURCE_BYTES = 50 * 1024 * 1024;

function stripAssignment(value: string) {
  return value
    .trim()
    .replace(/^SUPABASE_URL\s*=\s*/i, "")
    .replace(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*/i, "")
    .replace(/^SUPABASE_SERVER_KEY\s*=\s*/i, "")
    .replace(/^SUPABASE_SECRET_KEY\s*=\s*/i, "")
    .replace(/^SUPABASE_SERVICE_ROLE_KEY\s*=\s*/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();
}

function getStorageConfig() {
  const rawUrl = stripAssignment(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "");
  const key = stripAssignment(
    process.env.SUPABASE_SERVER_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      ""
  );

  if (!rawUrl || !key) throw new Error("Supabase server storage is not configured.");

  const parsed = new URL(rawUrl);
  return { url: `${parsed.protocol}//${parsed.host}`, key };
}

function authHeaders(key: string, extra?: HeadersInit) {
  const headers = new Headers(extra);
  headers.set("apikey", key);
  if (!key.startsWith("sb_secret_")) headers.set("Authorization", `Bearer ${key}`);
  return headers;
}

function publicObjectUrl(baseUrl: string) {
  return `${baseUrl}/storage/v1/object/public/${BUCKET}/${OBJECT_PATH}`;
}

async function ensureBucket(baseUrl: string, key: string) {
  const response = await fetch(`${baseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: authHeaders(key, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: MAX_SOURCE_BYTES,
      allowed_mime_types: ["video/mp4"],
    }),
    cache: "no-store",
  });

  if (response.ok) return;
  const text = await response.text();
  if (response.status === 400 || response.status === 409 || /already exists|duplicate/i.test(text)) return;
  throw new Error(`Could not prepare website media storage (${response.status}).`);
}

async function objectExists(baseUrl: string, key: string) {
  const response = await fetch(`${baseUrl}/storage/v1/object/${BUCKET}/${OBJECT_PATH}`, {
    method: "HEAD",
    headers: authHeaders(key),
    cache: "no-store",
  });
  return response.ok;
}

function validateAdobeSource(raw: string) {
  const source = new URL(raw);
  const validHost = source.protocol === "https:" && source.hostname.endsWith(".adobe.io");
  const validPath = source.pathname.includes("/walnut-compute-results/");
  if (!validHost || !validPath) throw new Error("Invalid website intro video source.");
  return source.toString();
}

async function seedVideo(sourceUrl: string) {
  const { url, key } = getStorageConfig();
  await ensureBucket(url, key);
  if (await objectExists(url, key)) return publicObjectUrl(url);

  const source = await fetch(sourceUrl, { cache: "no-store" });
  if (!source.ok) throw new Error(`Could not fetch the prepared intro video (${source.status}).`);

  const declaredLength = Number(source.headers.get("content-length") || 0);
  if (declaredLength > MAX_SOURCE_BYTES) throw new Error("Prepared intro video is too large for website storage.");

  const bytes = await source.arrayBuffer();
  if (bytes.byteLength > MAX_SOURCE_BYTES) throw new Error("Prepared intro video is too large for website storage.");

  const upload = await fetch(`${url}/storage/v1/object/${BUCKET}/${OBJECT_PATH}`, {
    method: "POST",
    headers: authHeaders(key, {
      "Content-Type": "video/mp4",
      "x-upsert": "true",
      "Cache-Control": "3600",
    }),
    body: bytes,
    cache: "no-store",
  });

  if (!upload.ok) {
    const detail = await upload.text();
    throw new Error(`Could not store website intro video (${upload.status}): ${detail.slice(0, 180)}`);
  }

  return publicObjectUrl(url);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seed = searchParams.get("seed");

    if (seed) {
      if (seed !== SEED_TOKEN) return Response.json({ ok: false }, { status: 404 });
      const rawSource = searchParams.get("source") || "";
      const source = validateAdobeSource(rawSource);
      await seedVideo(source);
      return Response.json({ ok: true });
    }

    const { url } = getStorageConfig();
    return new Response(null, {
      status: 307,
      headers: {
        Location: publicObjectUrl(url),
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Website intro video storage error", error);
    return Response.json({ ok: false, error: "Website intro video is unavailable." }, { status: 503 });
  }
}
