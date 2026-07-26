import { NextResponse } from "next/server";
import { basicLimit } from "../../../lib/guard";
import {
  attachSessionCookies,
  authAdminRequest,
  authErrorMessage,
  authRequest,
  type AuthPayload,
  type AuthUser,
} from "../_auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SignUpBody = {
  name?: string;
  email?: string;
  password?: string;
};

type AdminUsersPayload = AuthPayload | Exclude<AuthUser, null>[];

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function rawAuthError(payload: AuthPayload | null) {
  return String(
    payload?.error_description ||
      payload?.msg ||
      payload?.message ||
      payload?.error ||
      payload?.error_code ||
      payload?.code ||
      ""
  ).toLowerCase();
}

function emailDeliveryBlocked(payload: AuthPayload | null, status: number) {
  const raw = rawAuthError(payload);
  return Boolean(
    status === 429 ||
      raw.includes("rate limit") ||
      raw.includes("over_email_send_rate_limit") ||
      raw.includes("email address not authorized") ||
      raw.includes("smtp") ||
      raw.includes("sending confirmation")
  );
}

async function passwordSession(email: string, password: string) {
  const response = await authRequest("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const payload = (await response.json().catch(() => null)) as AuthPayload | null;
  return { response, payload };
}

async function findAdminUserByEmail(email: string) {
  const response = await authAdminRequest("/admin/users?page=1&per_page=1000", { method: "GET" });
  if (!response.ok) return null;

  const payload = (await response.json().catch(() => null)) as AdminUsersPayload | null;
  const users = Array.isArray(payload) ? payload : payload?.users || [];
  return users.find((user) => String(user?.email || "").toLowerCase() === email) || null;
}

async function recoverFromEmailServiceLimit(name: string, email: string, password: string) {
  try {
    const adminCreate = await authAdminRequest("/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: name },
      }),
    });
    const adminPayload = (await adminCreate.json().catch(() => null)) as AuthPayload | null;

    if (adminCreate.ok) {
      const signedIn = await passwordSession(email, password);
      return signedIn.response.ok && signedIn.payload?.access_token ? signedIn.payload : null;
    }

    const adminRaw = rawAuthError(adminPayload);
    const alreadyExists =
      adminCreate.status === 422 ||
      adminRaw.includes("already registered") ||
      adminRaw.includes("already exists") ||
      adminRaw.includes("email_exists") ||
      adminRaw.includes("user already registered");

    if (!alreadyExists) return null;

    // Never reset an existing user's password from an unauthenticated signup.
    // First prove the submitted password belongs to that account.
    const existingSignIn = await passwordSession(email, password);
    if (existingSignIn.response.ok && existingSignIn.payload?.access_token) {
      return existingSignIn.payload;
    }

    const signInRaw = rawAuthError(existingSignIn.payload);
    if (!signInRaw.includes("email not confirmed")) return null;

    // A correct password for an unconfirmed account is enough to safely finish
    // confirmation server-side when the project's email provider is rate-limited.
    const existingUser = await findAdminUserByEmail(email);
    if (!existingUser?.id) return null;

    const confirm = await authAdminRequest(`/admin/users/${encodeURIComponent(existingUser.id)}`, {
      method: "PUT",
      body: JSON.stringify({
        email_confirm: true,
        user_metadata: {
          ...(existingUser.user_metadata || {}),
          display_name: name,
        },
      }),
    });
    if (!confirm.ok) return null;

    const confirmedSignIn = await passwordSession(email, password);
    return confirmedSignIn.response.ok && confirmedSignIn.payload?.access_token
      ? confirmedSignIn.payload
      : null;
  } catch (error) {
    console.error("Website sign-up admin fallback unavailable:", error);
    return null;
  }
}

function authenticatedResponse(payload: AuthPayload, email: string, name: string) {
  const response = NextResponse.json({
    ok: true,
    authenticated: true,
    requiresEmailConfirmation: false,
    user: {
      id: payload.user?.id || "",
      email: payload.user?.email || email,
      displayName: String(payload.user?.user_metadata?.display_name || name),
    },
  });
  return attachSessionCookies(response, payload);
}

export async function POST(request: Request) {
  try {
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

    // Keep abuse protection, but allow realistic QA and retries without locking a
    // legitimate visitor out after only a few form submissions.
    const allowed = await basicLimit(request, "website-sign-up", 20, 600);
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many account requests from this connection. Please wait a few minutes and try again." },
        { status: 429 }
      );
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
      if (emailDeliveryBlocked(payload, upstream.status)) {
        const recovered = await recoverFromEmailServiceLimit(name, email, password);
        if (recovered?.access_token) {
          return authenticatedResponse(recovered, email, name);
        }
      }

      return NextResponse.json(
        { ok: false, error: authErrorMessage(payload, upstream.status) },
        { status: upstream.status === 429 ? 429 : 400 }
      );
    }

    if (payload?.access_token) {
      return authenticatedResponse(payload, email, name);
    }

    const response = NextResponse.json({
      ok: true,
      authenticated: false,
      requiresEmailConfirmation: true,
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
