import { NextResponse } from "next/server";
import { clearAdminSession, revokeAdminSession } from "../../../lib/local-auth";
import { ACCESS_COOKIE, REFRESH_COOKIE, authRequest } from "../_auth";
import { cookies } from "next/headers";
import { emailAuthEnabled } from "../../../lib/member-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (emailAuthEnabled()) {
    const token = (await cookies()).get(ACCESS_COOKIE)?.value || "";
    if (token) {
      try { await authRequest("/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } }); }
      catch (error) { console.error("Member token revocation unavailable:", error); }
    }
    const response = NextResponse.json({ ok: true });
    for (const name of [ACCESS_COOKIE, REFRESH_COOKIE]) {
      response.cookies.set(name, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
    }
    return response;
  }
  try {
    await revokeAdminSession();
    return clearAdminSession(NextResponse.json({ ok: true }));
  } catch (error) {
    console.error("Shared session revocation failed:", error);
    return clearAdminSession(NextResponse.json({ ok: false, error: "Session revocation is temporarily unavailable." }, { status: 503 }));
  }
}
