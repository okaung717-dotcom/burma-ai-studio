import { NextResponse } from "next/server";
import { authRequest, attachSessionCookies, type AuthPayload } from "../_auth";
import { emailAuthEnabled, getMemberForToken, verifyEmailAuthToken } from "../../../lib/member-auth";
import { memberLoginRateLimit, validRequestOrigin } from "../../../lib/email-auth-security";
import { updateRows } from "../../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!emailAuthEnabled()) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (!validRequestOrigin(request)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
    password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  try {
    const limit = await memberLoginRateLimit(request, email);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter || 900) } });
    }

    const response = await authRequest("/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Email or password is incorrect, or account is not active." },
        { status: 401 });
    }
    const payload = await response.json() as AuthPayload;
    if (!payload.access_token) throw new Error("Supabase returned no access token");

    const identity = await verifyEmailAuthToken(payload.access_token);
    if (!identity?.id || !identity.email_confirmed_at) {
      return NextResponse.json({ error: "Email confirmation is required." }, { status: 403 });
    }

    // Invitees can only activate an existing admin-created account, never self-register.
    // Activation is restricted to their verified Supabase Auth identity.
    await updateRows("studio_member_accounts",
      `?user_id=eq.${encodeURIComponent(identity.id)}&status=eq.invited&email=eq.${encodeURIComponent(email)}`,
      { status: "active", updated_at: new Date().toISOString() });

    const member = await getMemberForToken(payload.access_token);
    if (!member) {
      return NextResponse.json({ error: "Account access has not been approved." }, { status: 403 });
    }
    return attachSessionCookies(NextResponse.json({ ok: true, user: member }), payload);
  } catch (error) {
    console.error("Email member sign-in unavailable:", error);
    return NextResponse.json({ error: "Sign in is temporarily unavailable." }, { status: 503 });
  }
}
