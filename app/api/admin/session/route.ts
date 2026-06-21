import { cookies } from "next/headers";
import { isAdminPin } from "../../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "bas_admin_ok";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { code?: string; action?: string } | null;
  const cookieStore = await cookies();

  if (body?.action === "logout") {
    cookieStore.delete(COOKIE_NAME);
    return Response.json({ ok: true });
  }

  if (!isAdminPin(body?.code)) {
    return Response.json({ ok: false, message: "Invalid admin code." }, { status: 401 });
  }

  cookieStore.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return Response.json({ ok: true });
}

export async function GET() {
  const cookieStore = await cookies();
  return Response.json({ ok: cookieStore.get(COOKIE_NAME)?.value === "1" });
}
