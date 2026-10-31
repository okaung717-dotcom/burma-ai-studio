import { requireAdminSession } from "../../lib/admin-api-auth";
import { withRedis } from "../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "burma-ai-studio:chat-state";
const options = ["Open", "Replied", "Closed", "Unread"];

type Body = { code?: string; visitorId?: string; state?: string };

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  if (!body?.visitorId || !body.state || !options.includes(body.state)) return Response.json({ ok: false, message: "Missing valid state." }, { status: 400 });
  const item = { visitorId: body.visitorId, state: body.state, updatedAt: new Date().toISOString() };
  await withRedis(async (client) => client.hSet(KEY, body.visitorId as string, JSON.stringify(item)));
  return Response.json({ ok: true, item });
}

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const items = await withRedis(async (client) => client.hGetAll(KEY));
    return Response.json({ ok: true, items });
  } catch {
    return Response.json({ ok: true, items: {} });
  }
}
