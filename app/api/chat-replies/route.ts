import { withRedis } from "../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHAT_KEY = "burma-ai-studio:chat-logs";

type Body = { visitorId?: string; seenIds?: string[] };
type ChatLog = { id?: string; visitorId?: string; role?: string; content?: string; createdAt?: string };

function clean(value: unknown, fallback = "", max = 200) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Body | null;
    const visitorId = clean(body?.visitorId, "", 160);
    if (!visitorId) return Response.json({ ok: true, replies: [] });
    const seen = new Set(Array.isArray(body?.seenIds) ? body?.seenIds : []);
    const raw = await withRedis(async (client) => client.lRange(CHAT_KEY, 0, 200));
    const replies = raw
      .map((item) => { try { return JSON.parse(item) as ChatLog; } catch { return null; } })
      .filter((item): item is ChatLog => Boolean(item))
      .filter((item) => item.visitorId === visitorId && item.role === "admin" && item.id && !seen.has(item.id))
      .sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
    return Response.json({ ok: true, replies });
  } catch {
    return Response.json({ ok: true, replies: [] });
  }
}
