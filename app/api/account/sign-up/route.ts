import { NextResponse } from "next/server";
import { basicLimit } from "../../../lib/guard";
import { attachSessionCookies, authErrorMessage, authRequest, type AuthPayload } from "../_auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SignUpBody = {
  name?: string;
  email?: string;
  password?: string;
};

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const allowed = await basicLimit(request, "website-sign-up", 6, 600);
    if (!allowed) {
      return NextResponse.json({ ok: false, error: "Too many attempts. Please wait and try again." }, { status: 429 });
    }

    const body = (await request.json().catch(() => null)) as SignUpBody | null;
    const name = String(body?.name || "").trim().replace(/\s+/g, " ").slice(0, 80);
    const email = String(body?.email || "").trim().toLowerCase().slice(0, 254);
    const password = String(body?.password || "");

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Enter your name." }, { status: 400 });
    }
    if (!validEmail(email)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const upstream = await authRequest("/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        data: { display_name: name },
      }),
    });
    const payload = (await upstream.json().catch(() => null)) as AuthPayload | null;

    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, error: authErrorMessage(payload, upstream.status) },
        { status: upstream.status === 429 ? 429 : 400 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      authenticated: Boolean(payload?.access_token),
      requiresEmailConfirmation: !payload?.access_token,
      user: {
        id: payload?.user?.id || "",
        email: payload?.user?.email || email,
        displayName: name,
      },
    });

    return payload ? attachSessionCookies(response, payload) : response;
  } catch (error) {
    console.error("Website sign-up error:", error);
    return NextResponse.json({ ok: false, error: "Account creation is temporarily unavailable." }, { status: 503 });
  }
}
