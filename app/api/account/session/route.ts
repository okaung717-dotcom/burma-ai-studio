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

type AccountUser = {
  id?: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
} | null;

function sessionResponse(user: AccountUser) {
  return NextResponse.json({
    authenticated: Boolean(user?.id),
    user: user?.id
      ? {
          id: user.id,
          email: user.email || "",
          displayName: String(user.user_metadata?.display_name || ""),
        }
      : null,
  });
}

async function getUser(accessToken: string) {
  if (!accessToken) return null;
  const upstream = await authRequest("/user", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!upstream.ok) return null;
  return (await upstream.json().catch(() => null)) as AccountUser;
}

function clearStaleSession(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_COOKIE)?.value || "";
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value || "";

    const currentUser = await getUser(accessToken);
    if (currentUser?.id) return sessionResponse(currentUser);

    // Access tokens are short-lived. A valid refresh cookie keeps returning users
    // signed in so they can go directly to Home without seeing the Intro again.
    if (refreshToken) {
      const refreshUpstream = await authRequest("/token?grant_type=refresh_token", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const refreshed = (await refreshUpstream.json().catch(() => null)) as AuthPayload | null;

      if (refreshUpstream.ok && refreshed?.access_token) {
        const refreshedUser = refreshed.user?.id
          ? refreshed.user
          : await getUser(refreshed.access_token);

        if (refreshedUser?.id) {
          const response = sessionResponse(refreshedUser);
          return attachSessionCookies(response, refreshed);
        }
      }

      return clearStaleSession(NextResponse.json({ authenticated: false, user: null }));
    }

    return NextResponse.json({ authenticated: false, user: null });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
