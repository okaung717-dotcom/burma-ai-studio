import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { ADMIN_USERNAME, attachAdminSession, verifyAdminPassword } from "../../../lib/local-auth";
import { deleteRows, supabaseRequest } from "../../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

function localRateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  return { allowed: current.count <= MAX_ATTEMPTS, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}

async function rateLimit(request: Request, username: string) {
  const rawKey = `${clientKey(request)}:${username || "unknown"}`;
  const key = createHash("sha256").update(`${process.env.BAS_SESSION_SECRET || "development"}:${rawKey}`).digest("hex");
  try {
    const rows = await supabaseRequest<Array<{ allowed: boolean; retry_after: number }>>("rpc/consume_studio_login_attempt", {
      method: "POST",
      body: JSON.stringify({ p_key: key, p_limit: MAX_ATTEMPTS, p_window_seconds: WINDOW_MS / 1000 }),
    });
    return { ...(rows[0] || { allowed: false, retryAfter: WINDOW_MS / 1000 }), key };
  } catch (error) {
    if (process.env.NODE_ENV === "production" || process.env.BAS_AUTH_STORE_MODE === "supabase") throw error;
    return { ...localRateLimit(key), key };
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = String(body?.username || "").trim().toLowerCase().slice(0, 64);
  const password = String(body?.password || "");
  let limit: { allowed: boolean; retryAfter?: number; retry_after?: number; key: string };
  try {
    limit = await rateLimit(request, username);
  } catch (error) {
    console.error("Shared sign-in rate limiter is unavailable:", error);
    return NextResponse.json({ ok: false, error: "Sign in is temporarily unavailable." }, { status: 503 });
  }
  if (!limit.allowed) {
    const retryAfter = limit.retryAfter ?? limit.retry_after ?? 900;
    return NextResponse.json(
      { ok: false, error: "Too many sign-in attempts. Please wait 15 minutes and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  if (!username || password.length < 14 || password.length > 128) {
    return NextResponse.json({ ok: false, error: "Enter a valid username and password." }, { status: 400 });
  }

  try {
    const valid = username === ADMIN_USERNAME && verifyAdminPassword(password);
    if (!valid) return NextResponse.json({ ok: false, error: "Username or password is incorrect." }, { status: 401 });
    if (process.env.NODE_ENV === "production" || process.env.BAS_AUTH_STORE_MODE === "supabase") {
      await deleteRows("studio_login_attempts", `?key_hash=eq.${limit.key}`);
    } else {
      attempts.delete(limit.key);
    }
    return await attachAdminSession(NextResponse.json({ ok: true }));
  } catch (error) {
    console.error("Local administrator authentication configuration error:", error);
    return NextResponse.json(
      { ok: false, error: "Administrator login is not configured. Run the secure local setup command." },
      { status: 503 }
    );
  }
}
