import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, authRequest, type AuthPayload } from "../_auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_COOKIE)?.value || "";
    if (!accessToken) return NextResponse.json({ authenticated: false });

    const upstream = await authRequest("/user", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!upstream.ok) return NextResponse.json({ authenticated: false });
    const user = (await upstream.json().catch(() => null)) as AuthPayload["user"] | null;

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
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
