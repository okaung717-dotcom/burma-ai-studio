import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  attachSessionCookies,
  authRequest,
  type AuthPayload,
} from "../_auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function accountJson(user: AuthPayload["user"]) {
  return {
    authenticated: Boolean(user?.id),
    user: user?.id
      ? {
          id: user.id,
          email: user.email || "",
          displayName: String(user.user_metadata?.display_name || ""),
        }
      : null,
  };
}

async function readUser(accessToken: string): Promise<AuthPayload["user"]> {
  if (!accessToken) return null;
  const upstream = await authRequest("/user", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!upstream.ok) return null;
  return (await upstream.json().catch(() => null)) as AuthPayload["user"];
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_COOKIE)?.value || "";
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value || "";

    const currentUser = await readUser(accessToken);
    if (currentUser?.id) {
      return NextResponse.json(accountJson(currentUser));
    }

    if (!refreshToken) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const refreshUpstream = await authRequest("/token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const refreshed = (await refreshUpstream.json().catch(() => null)) as AuthPayload | null;

    if (!refreshUpstream.ok || !refreshed?.access_token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const refreshedUser = refreshed.user?.id
      ? refreshed.user
      : await readUser(refreshed.access_token);

    if (!refreshedUser?.id) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const response = NextResponse.json(accountJson(refreshedUser));
    return attachSessionCookies(response, refreshed);
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
