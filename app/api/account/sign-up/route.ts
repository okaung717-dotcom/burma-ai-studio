import { NextResponse } from "next/server";
import { basicLimit } from "../../../lib/guard";
import {
  attachSessionCookies,
  authAdminRequest,
  authErrorMessage,
  authRequest,
  hasSupabaseAdminAuthConfig,
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

function existingAccountResponse() {
  return NextResponse.json(
    { ok: false, error: "An account with this email already exists. Please sign in instead." },
    { status: 409 }
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

async function publicSignup(name: string, email: string, password: string) {
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

  if (payload?.access_token) {
    return authenticatedResponse(payload, email, name);
  }

  // Supabase intentionally returns an obfuscated user for an already-confirmed
  // email when email confirmation is enabled. An empty identities list is the
  // documented signal that no new identity was created.
  if (Array.isArray(payload?.user?.identities) && payload?.user?.identities?.length === 0) {
    return existingAccountResponse();
  }

  return NextResponse.json({
    ok: true,
    authenticated: false,
    requiresEmailConfirmation: true,
    user: {
      id: payload?.user?.id || "",
      email: payload?.user?.email || email,
      displayName: name,
    },
  });
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

    // First check whether the visitor is actually submitting credentials for an
    // existing confirmed account. This avoids misreporting a backend setup issue
    // as an account-creation failure and keeps one email mapped to one Auth user.
    const existingSession = await passwordSession(email, password);
    if (existingSession.response.ok && existingSession.payload?.access_token) {
      return existingAccountResponse();
    }

    const existingSessionError = rawAuthError(existingSession.payload);
    if (existingSessionError.includes("email not confirmed")) {
      return NextResponse.json(
        {
          ok: false,
          error: "An account with this email already exists but is not confirmed yet. Please use Sign in after confirmation.",
        },
        { status: 409 }
      );
    }

    // Preferred path: if a real server-side Auth admin key is configured, create
    // a confirmed user without depending on confirmation-email delivery.
    if (hasSupabaseAdminAuthConfig()) {
      try {
        const existingUser = await findAdminUserByEmail(email);
        if (existingUser) {
          const recovered = await confirmExistingUnconfirmedAccount(existingUser, name, email, password);
          if (recovered?.access_token) return existingAccountResponse();
          return existingAccountResponse();
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

          if (duplicate) return existingAccountResponse();
          console.error("Website admin signup failed; falling back to public signup:", raw || adminCreate.status);
          return publicSignup(name, email, password);
        }

        const signedIn = await passwordSession(email, password);
        if (signedIn.response.ok && signedIn.payload?.access_token) {
          return authenticatedResponse(signedIn.payload, email, name);
        }

        return NextResponse.json(
          { ok: false, error: "Your account was created, but sign-in could not start. Please use Sign in." },
          { status: 503 }
        );
      } catch (error) {
        console.error("Website admin signup path unavailable; using public signup:", error);
        return publicSignup(name, email, password);
      }
    }

    // Current production fallback: the project has a public/anon Auth key but no
    // service-role/secret admin key. Use Supabase's normal signup path and surface
    // its real duplicate/rate-limit state instead of a misleading generic 503.
    return publicSignup(name, email, password);
  } catch (error) {
    console.error("Website sign-up error:", error);
    return NextResponse.json(
      { ok: false, error: "Account creation could not be completed. Please try again or use Sign in if you already have an account." },
      { status: 503 }
    );
  }
}
