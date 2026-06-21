import { isAdminPin, withRedis } from "../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "burma-ai-studio:lead-status";
const options = ["New", "Contacted", "Hot", "Warm", "Closed", "Archived"];

type Body = { code?: string; id?: string; status?: string; note?: string };

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  if (!isAdminPin(body?.code)) return Response.json({ ok: false, message: "Invalid code." }, { status: 401 });
  if (!body?.id || !body.status || !options.includes(body.status)) return Response.json({ ok: false, message: "Missing valid status." }, { status: 400 });

  const item = { id: body.id, status: body.status, note: body.note || "", updatedAt: new Date().toISOString() };
  await withRedis(async (client) => client.hSet(KEY, body.id as string, JSON.stringify(item)));
  return Response.json({ ok: true, item });
}
