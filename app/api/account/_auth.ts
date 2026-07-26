import { NextResponse } from "next/server";

export const ACCESS_COOKIE = "bas_account_access";
export const REFRESH_COOKIE = "bas_account_refresh";

export type AuthPayload = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: {
    id?: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  } | null;
  error?: string;
  error_description?: string;
  msg?: string;
  message?: string;
};

function cleanBaseUrl(value: string | undefined) {
  const raw = (value || "").trim().replace(/^['\"]|['\"]$/g, "").replace(/\/+$/, "");
  if (!/^https:\/\//i.test(raw)) return "";
  return raw;
}

export function getSupabaseAuthConfig() {
  const url = cleanBaseUrl(process.env.SUPABASE_URL);
  const apiKey = (
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVER_KEY ||
    ""
  ).trim().replace(/^['\"]|['\"]$/g, "");

  if (!url || !apiKey || apiKey === "[SENSITIVE]") {
    throw new Error("Account authentication is not configured.");
  }

  return { url, apiKey };
}

export async function authRequest(path: string, init: RequestInit = {}) {
  const { url, apiKey } = getSupabaseAuthConfig();
  return fetch(`${url}/auth/v1${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: apiKey,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export function authErrorMessage(payload: AuthPayload | null, status: number) {
  const raw = String(
    payload?.error_description || payload?.msg || payload?.message || payload?.error || ""
  ).toLowerCase();

  if (raw.includes("invalid login") || raw.includes("invalid credentials")) {
    return "Email or password is incorrect.";
  }
  if (raw.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }
  if (raw.includes("already registered") || raw.includes("already exists")) {
    return "An account with this email already exists.";
  }
  if (raw.includes("password")) {
    return "Please use a stronger password with at least 8 characters.";
  }
  if (status === 429) return "Too many attempts. Please wait a moment and try again.";
  return "We could not complete that request. Please try again.";
}

export function attachSessionCookies(response: NextResponse, payload: AuthPayload) {
  if (!payload.access_token) return response;

  const secure = process.env.NODE_ENV === "production";
  const accessAge = Math.max(300, Math.min(Number(payload.expires_in) || 3600, 60 * 60 * 24));

  response.cookies.set(ACCESS_COOKIE, payload.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: accessAge,
  });

  if (payload.refresh_token) {
    response.cookies.set(REFRESH_COOKIE, payload.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
