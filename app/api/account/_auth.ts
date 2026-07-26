import { NextResponse } from "next/server";

export const ACCESS_COOKIE = "bas_account_access";
export const REFRESH_COOKIE = "bas_account_refresh";

export type AuthUser = {
  id?: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
} | null;

export type AuthPayload = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: AuthUser;
  users?: Exclude<AuthUser, null>[];
  error?: string;
  error_code?: string;
  error_description?: string;
  msg?: string;
  message?: string;
  code?: string;
};

function cleanBaseUrl(value: string | undefined) {
  const raw = (value || "").trim().replace(/^['\"]|['\"]$/g, "").replace(/\/+$/, "");
  if (!/^https:\/\//i.test(raw)) return "";
  return raw;
}

function cleanApiKey(value: string | undefined) {
  return (value || "").trim().replace(/^['\"]|['\"]$/g, "");
}

function decodeLegacyRole(key: string) {
  if (key.split(".").length !== 3) return "";
  try {
    const payloadPart = key.split(".")[1] || "";
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as { role?: string };
    return String(payload.role || "");
  } catch {
    return "";
  }
}

function isServerSecretKey(key: string) {
  if (!key || key === "[SENSITIVE]" || key.startsWith("sb_publishable_")) return false;
  if (key.startsWith("sb_secret_")) return true;
  return decodeLegacyRole(key) === "service_role";
}

export function getSupabaseAuthConfig() {
  const url = cleanBaseUrl(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const apiKey = cleanApiKey(
    process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_SERVER_KEY
  );

  if (!url || !apiKey || apiKey === "[SENSITIVE]") {
    throw new Error("Account authentication is not configured.");
  }

  return { url, apiKey };
}

export function getSupabaseAdminAuthConfig() {
  const url = cleanBaseUrl(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const candidates = [
    process.env.SUPABASE_SECRET_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_SERVER_KEY,
  ].map(cleanApiKey);
  const apiKey = candidates.find(isServerSecretKey) || "";

  if (!url || !apiKey) {
    throw new Error("Supabase server-side Auth admin key is not configured.");
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

export async function authAdminRequest(path: string, init: RequestInit = {}) {
  const { url, apiKey } = getSupabaseAdminAuthConfig();
  const headers = new Headers(init.headers);
  headers.set("apikey", apiKey);
  headers.set("Content-Type", "application/json");

  // Legacy service_role JWTs are accepted as bearer tokens by GoTrue. New
  // sb_secret_ keys are API keys and must not be placed in Authorization.
  if (!apiKey.startsWith("sb_secret_")) {
    headers.set("Authorization", `Bearer ${apiKey}`);
  }

  return fetch(`${url}/auth/v1${path}`, {
    ...init,
    cache: "no-store",
    headers,
  });
}

export function authErrorMessage(payload: AuthPayload | null, status: number) {
  const raw = String(
    payload?.error_description || payload?.msg || payload?.message || payload?.error || payload?.error_code || payload?.code || ""
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
  if (status === 429 || raw.includes("rate limit")) {
    return "Account email service is temporarily rate-limited. Please try again shortly.";
  }
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
