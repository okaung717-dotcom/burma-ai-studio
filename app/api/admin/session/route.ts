import { cookies } from "next/headers";
import { isAdminPin } from "../../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "bas_admin_ok";

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || process.env.ADMIN_USER || "admin";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || process.env.ADMIN_CONTROL || process.env["ADMIN_Control"] || process.env.ADMIN_PIN || "";
}

function isValidLogin(username?: string, password?: string, code?: string) {
  const expectedUsername = getAdminUsername();
  const expectedPassword = getAdminPassword();
  if (code && isAdminPin(code)) return true;
  return Boolean(expectedPassword) && username === expectedUsername && password === expectedPassword;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string; code?: string; action?: string } | null;
  const cookieStore = await cookies();

  if (body?.action === "logout") {
    cookieStore.delete(COOKIE_NAME);
    return Response.json({ ok: true });
  }

  if (!isValidLogin(body?.username, body?.password, body?.code)) {
    return Response.json({ ok: false, message: "Invalid username or password." }, { status: 401 });
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
