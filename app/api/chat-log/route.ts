import { withRedis } from "../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHAT_KEY = "burma-ai-studio:chat-logs";

type Body = {
  visitorId?: string;
  role?: "user" | "assistant" | "admin";
  content?: string;
  page?: string;
  language?: string;
};

function clean(value: unknown, fallback = "", max = 3000) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Body | null;
    const visitorId = clean(body?.visitorId, "unknown", 160);
    const role = body?.role === "assistant" || body?.role === "admin" || body?.role === "user" ? body.role : "user";
    const content = clean(body?.content, "", 4000);
    if (!content) return Response.json({ ok: true });

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      visitorId,
      role,
      content,
      page: clean(body?.page, "/", 160),
      language: clean(body?.language, "Unknown", 80),
      createdAt: new Date().toISOString(),
    };

    await withRedis(async (client) => {
      await client.lPush(CHAT_KEY, JSON.stringify(message));
      await client.lTrim(CHAT_KEY, 0, 799);
    });

    return Response.json({ ok: true, message });
  } catch (error) {
    console.error("Chat log error:", error);
    return Response.json({ ok: true });
  }
}
