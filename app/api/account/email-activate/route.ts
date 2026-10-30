import { NextResponse } from "next/server";
import { attachSessionCookies, authRequest, type AuthPayload } from "../_auth";
import { emailAuthEnabled, ownerOnlyBetaEnabled, getMemberForToken, verifyEmailAuthToken } from "../../../lib/member-auth";
import { validRequestOrigin } from "../../../lib/email-auth-security";
import { selectRows, updateRows } from "../../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Account = { email: string; status: string };

export async function POST(request: Request) {
  if (!emailAuthEnabled()) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (ownerOnlyBetaEnabled()) return NextResponse.json({ error: "Invitations are disabled during the owner-only beta." }, { status: 403 });
  if (!validRequestOrigin(request)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  const body = await request.json().catch(() => null) as {
    accessToken?: unknown; refreshToken?: unknown; password?: unknown
  } | null;
  const accessToken = typeof body?.accessToken === "string" ? body.accessToken : "";
  const refreshToken = typeof body?.refreshToken === "string" ? body.refreshToken : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!accessToken || accessToken.length > 8192 || !refreshToken || refreshToken.length > 8192 ||
      password.length < 14 || password.length > 128 ||
      !/[a-z]/.test(password) || !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
    return NextResponse.json({ error: "Use a strong password with 14–128 characters, upper/lowercase, a number and a symbol." }, { status: 400 });
  }

  try {
    const identity = await verifyEmailAuthToken(accessToken);
    if (!identity?.id || !identity.email || !identity.email_confirmed_at) {
      return NextResponse.json({ error: "Invitation link expired or invalid." }, { status: 403 });
    }
    const accounts = await selectRows<Account>("studio_member_accounts",
      `?select=email,status&user_id=eq.${encodeURIComponent(identity.id)}&limit=1`);
    const account = accounts[0];
    if (!account || account.email !== identity.email.toLowerCase() ||
        !["invited", "active"].includes(account.status)) {
      return NextResponse.json({ error: "Invitation has not been approved." }, { status: 403 });
    }

    const response = await authRequest("/user", {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Unable to set password. Please request another invitation." },
        { status: 400 });
    }
    await updateRows("studio_member_accounts",
      `?user_id=eq.${encodeURIComponent(identity.id)}&status=eq.invited`,
      { status: "active", updated_at: new Date().toISOString() });

    const member = await getMemberForToken(accessToken);
    if (!member) return NextResponse.json({ error: "Member account is not active." }, { status: 403 });

    // Exchange and validate the refresh token before issuing an HttpOnly session.
    // Never accept unrelated access/refresh token pairs from the browser.
    const refreshed = await authRequest("/token?grant_type=refresh_token", {
      method: "POST", body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!refreshed.ok) return NextResponse.json({ error: "Invitation session expired. Request a new invitation." }, { status: 403 });
    const newTokens = await refreshed.json() as AuthPayload;
    if (!newTokens.access_token || !newTokens.refresh_token) throw new Error("Missing refreshed tokens");
    const refreshedIdentity = await verifyEmailAuthToken(newTokens.access_token);
    if (refreshedIdentity?.id !== member.id) {
      return NextResponse.json({ error: "Invitation session mismatch." }, { status: 403 });
    }
    return attachSessionCookies(NextResponse.json({ ok: true }), newTokens);
  } catch (error) {
    console.error("Member invitation activation unavailable:", error);
    return NextResponse.json({ error: "Activation is temporarily unavailable." }, { status: 503 });
  }
}
