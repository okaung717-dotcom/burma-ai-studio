import { NextResponse } from "next/server";
import { basicLimit } from "../../../lib/guard";
import {
  attachSessionCookies,
  authAdminRequest,
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

async function passwordSession(email: string, password: string) {
  const response = await authRequest("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const payload = (await response.json().catch(() => null)) as AuthPayload | null;
  return { response, payload };
}

async function listAdminUsers(page: number) {
  const response = await authAdminRequest(`/admin/users?page=${page}&per_page=1000`, { method: "GET" });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as AuthPayload | null;
    throw new Error(rawAuthError(payload) || `Admin user lookup failed (${response.status}).`);
  }

  const payload = (await response.json().catch(() => null)) as AdminUsersPayload | null;
  return Array.isArray(payload) ? payload : payload?.users || [];
}

async function findAdminUserByEmail(email: string) {
  // A few pages are enough for the current studio scale while keeping the lookup bounded.
  for (let page = 1; page <= 5; page += 1) {
    const users = await listAdminUsers(page);
    const match = users.find((user) => String(user?.email || "").toLowerCase() === email);
    if (match) return match;
    if (users.length < 1000) break;
  }
  return null;
}

async function confirmExistingUnconfirmedAccount(
  user: Exclude<AuthUser, null>,
  name: string,
  email: string,
  password: string
) {
  // We never overwrite an existing password. The password grant must first prove
  // the visitor knows the account password. Supabase returns "email not confirmed"
  // only after the submitted credentials have passed the password check.
  const attemptedSignIn = await passwordSession(email, password);
  if (attemptedSignIn.response.ok && attemptedSignIn.payload?.access_token) {
    return attemptedSignIn.payload;
  }

  const signInRaw = rawAuthError(attemptedSignIn.payload);
  if (!signInRaw.includes("email not confirmed") || !user.id) return null;

  const confirm = await authAdminRequest(`/admin/users/${encodeURIComponent(user.id)}`, {
    method: "PUT",
    body: JSON.stringify({
      email_confirm: true,
      user_metadata: {
        ...(user.user_metadata || {}),
        display_name: String(user.user_metadata?.display_name || name),
      },
    }),
  });

  if (!confirm.ok) return null;

  const confirmedSignIn = await passwordSession(email, password);
  return confirmedSignIn.response.ok && confirmedSignIn.payload?.access_token
    ? confirmedSignIn.payload
    : null;
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

    const allowed = await basicLimit(request, "website-sign-up", 20, 600);
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many account requests from this connection. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    // Website signup intentionally does not depend on Supabase's confirmation-email
    // sender. The server creates a confirmed Auth user directly, then establishes a
    // normal password session. This removes SMTP/rate-limit failures from signup.
    const existingUser = await findAdminUserByEmail(email);

    if (existingUser) {
      const recovered = await confirmExistingUnconfirmedAccount(existingUser, name, email, password);
      if (recovered?.access_token) {
        return authenticatedResponse(recovered, email, name);
      }

      return NextResponse.json(
        { ok: false, error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

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

    if (!adminCreate.ok) {
      const raw = rawAuthError(adminPayload);
      const duplicate =
        adminCreate.status === 422 ||
        raw.includes("already registered") ||
        raw.includes("already exists") ||
        raw.includes("email_exists") ||
        raw.includes("user already registered");

      if (duplicate) {
        return NextResponse.json(
          { ok: false, error: "An account with this email already exists. Please sign in instead." },
          { status: 409 }
        );
      }

      console.error("Website admin signup failed:", raw || adminCreate.status);
      return NextResponse.json(
        { ok: false, error: "Account creation is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    const signedIn = await passwordSession(email, password);
    if (!signedIn.response.ok || !signedIn.payload?.access_token) {
      console.error("Website account created but session creation failed:", rawAuthError(signedIn.payload));
      return NextResponse.json(
        { ok: false, error: "Your account was created, but sign-in could not start. Please use Sign in." },
        { status: 503 }
      );
    }

    return authenticatedResponse(signedIn.payload, email, name);
  } catch (error) {
    console.error("Website sign-up error:", error);
    return NextResponse.json(
      { ok: false, error: "Account creation is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }
}
