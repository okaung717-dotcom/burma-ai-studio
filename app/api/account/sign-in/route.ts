import { NextResponse } from "next/server";
import { ADMIN_USERNAME, attachAdminSession, verifyAdminPassword } from "../../../lib/local-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

function rateLimit(request: Request) {
  const key = clientKey(request);
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  return { allowed: current.count <= MAX_ATTEMPTS, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}

export async function POST(request: Request) {
  const limit = rateLimit(request);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many sign-in attempts. Please wait 15 minutes and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = String(body?.username || "").trim().toLowerCase().slice(0, 64);
  const password = String(body?.password || "");
  if (!username || password.length < 4 || password.length > 128) {
    return NextResponse.json({ ok: false, error: "Enter a valid username and password." }, { status: 400 });
  }

  try {
    const valid = username === ADMIN_USERNAME && verifyAdminPassword(password);
    if (!valid) return NextResponse.json({ ok: false, error: "Username or password is incorrect." }, { status: 401 });
    attempts.delete(clientKey(request));
    return attachAdminSession(NextResponse.json({ ok: true }));
  } catch (error) {
    console.error("Local administrator authentication configuration error:", error);
    return NextResponse.json(
      { ok: false, error: "Administrator login is not configured. Run the secure local setup command." },
      { status: 503 }
    );
  }
}
