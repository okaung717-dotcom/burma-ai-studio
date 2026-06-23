import { isAdminPin, withRedis } from "../../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHAT_KEY = "burma-ai-studio:chat-logs";

type ChatLog = {
  id?: string;
  visitorId?: string;
  role?: "user" | "assistant" | "admin";
  content?: string;
  page?: string;
  language?: string;
  createdAt?: string;
};

type Body = {
  code?: string;
  action?: "list" | "reply";
  visitorId?: string;
  content?: string;
};

function clean(value: unknown, fallback = "", max = 3000) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}

function isLoggedIn(request: Request, code?: string) {
  const cookie = request.headers.get("cookie") || "";
  return cookie.includes("bas_admin_ok=1") || isAdminPin(code);
}

function parseLogs(items: string[]) {
  return items
    .map((item) => { try { return JSON.parse(item) as ChatLog; } catch { return null; } })
    .filter((item): item is ChatLog => Boolean(item));
}

function buildThreads(logs: ChatLog[]) {
  const map = new Map<string, { visitorId: string; latestAt: string; latestMessage: string; unread: number; messages: ChatLog[] }>();
  logs.forEach((log) => {
    const visitorId = log.visitorId || "unknown";
    const existing = map.get(visitorId) || { visitorId, latestAt: log.createdAt || "", latestMessage: "", unread: 0, messages: [] };
    existing.messages.push(log);
    if (!existing.latestAt || (log.createdAt || "") > existing.latestAt) {
      existing.latestAt = log.createdAt || existing.latestAt;
      existing.latestMessage = log.content || "";
    }
    if (log.role === "user") existing.unread += 1;
    map.set(visitorId, existing);
  });
  return Array.from(map.values()).sort((a, b) => b.latestAt.localeCompare(a.latestAt));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Body | null;
    if (!isLoggedIn(request, body?.code)) return Response.json({ ok: false, message: "Admin login required." }, { status: 401 });

    if (body?.action === "reply") {
      const visitorId = clean(body.visitorId, "", 160);
      const content = clean(body.content, "", 4000);
      if (!visitorId || !content) return Response.json({ ok: false, message: "Visitor and reply are required." }, { status: 400 });
      const reply = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, visitorId, role: "admin", content, page: "/admin6996/chat", language: "Admin", createdAt: new Date().toISOString() };
      await withRedis(async (client) => client.lPush(CHAT_KEY, JSON.stringify(reply)));
      return Response.json({ ok: true, reply });
    }

    const raw = await withRedis(async (client) => client.lRange(CHAT_KEY, 0, 799));
    const logs = parseLogs(raw);
    return Response.json({ ok: true, threads: buildThreads(logs), logs });
  } catch (error) {
    console.error("Admin chat error:", error);
    return Response.json({ ok: false, message: "Chat inbox cannot be loaded yet." }, { status: 503 });
  }
}
