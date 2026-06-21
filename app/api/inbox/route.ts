import { createClient } from "redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "burma-ai-studio:leads";
const STATUS_KEY = "burma-ai-studio:lead-status";

async function withRedis<T>(callback: (client: ReturnType<typeof createClient>) => Promise<T>) {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not configured.");

  const client = createClient({ url });
  client.on("error", (error) => console.error("Redis client error:", error));

  await client.connect();
  try {
    return await callback(client);
  } finally {
    await client.quit();
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { code?: string } | null;
    const code = process.env.ADMIN_CONTROL || process.env.ADMIN_Control || process.env.ADMIN_PIN || "";
    if (!code) return Response.json({ ok: false, message: "ADMIN_CONTROL is not configured." }, { status: 503 });
    if (!body?.code || body.code !== code) return Response.json({ ok: false, message: "Invalid code." }, { status: 401 });

    const { raw, statuses } = await withRedis(async (client) => ({
      raw: await client.lRange(KEY, 0, 199),
      statuses: await client.hGetAll(STATUS_KEY),
    }));

    const leads = raw.map((item) => {
      try {
        const lead = JSON.parse(item) as Record<string, unknown>;
        const id = typeof lead.id === "string" ? lead.id : "";
        const saved = id && statuses[id] ? JSON.parse(statuses[id]) as Record<string, unknown> : null;
        return { status: "New", ...lead, ...(saved || {}) };
      } catch {
        return null;
      }
    }).filter(Boolean);

    return Response.json({ ok: true, leads });
  } catch (error) {
    console.error("Inbox error:", error);
    return Response.json({ ok: false, message: "Inbox storage is not configured yet." }, { status: 503 });
  }
}
