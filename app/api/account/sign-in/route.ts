import { NextResponse } from "next/server";
import { basicLimit } from "../../../lib/guard";
import { attachSessionCookies, authErrorMessage, authRequest, type AuthPayload } from "../_auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SignInBody = {
  email?: string;
  password?: string;
};

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const allowed = await basicLimit(request, "website-sign-in", 12, 600);
    if (!allowed) {
      return NextResponse.json({ ok: false, error: "Too many attempts. Please wait and try again." }, { status: 429 });
    }

    const body = (await request.json().catch(() => null)) as SignInBody | null;
    const email = String(body?.email || "").trim().toLowerCase().slice(0, 254);
    const password = String(body?.password || "");

    if (!validEmail(email) || password.length < 8 || password.length > 128) {
      return NextResponse.json({ ok: false, error: "Enter a valid email and password." }, { status: 400 });
    }

    const upstream = await authRequest("/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const payload = (await upstream.json().catch(() => null)) as AuthPayload | null;

    if (!upstream.ok || !payload?.access_token) {
      return NextResponse.json(
        { ok: false, error: authErrorMessage(payload, upstream.status) },
        { status: upstream.status === 429 ? 429 : 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      user: {
        id: payload.user?.id || "",
        email: payload.user?.email || email,
        displayName: String(payload.user?.user_metadata?.display_name || ""),
      },
    });

    return attachSessionCookies(response, payload);
  } catch (error) {
    console.error("Website sign-in error:", error);
    return NextResponse.json({ ok: false, error: "Sign in is temporarily unavailable." }, { status: 503 });
  }
}
