import "server-only";

import { createHmac, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { insertRows, selectRows, updateRows } from "./supabase";

export const ADMIN_USERNAME = "okkar";
export const ADMIN_SESSION_COOKIE = "bas_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;
const DEVELOPMENT_USER_ID = "00000000-0000-4000-8000-000000000001";

type SessionPayload = { v: 2; sub: typeof ADMIN_USERNAME; uid: string; sid: string; iat: number; exp: number };
type SessionRow = { session_id: string; expires_at: string; revoked_at?: string | null };
const revokedSessions = new Map<string, number>();

function encode(value: string) { return Buffer.from(value).toString("base64url"); }
function decode(value: string) { return Buffer.from(value, "base64url").toString("utf8"); }

function sessionSecret() {
  const secret = process.env.BAS_SESSION_SECRET || "";
  if (secret.length < 32) throw new Error("BAS_SESSION_SECRET must contain at least 32 characters.");
  return secret;
}

function signature(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function configuredHash() {
  const value = process.env.BAS_ADMIN_PASSWORD_HASH || "";
  if (!value.startsWith("scrypt$")) throw new Error("BAS_ADMIN_PASSWORD_HASH is not configured.");
  return value;
}

function sharedAuthRequired() {
  return process.env.NODE_ENV === "production" || process.env.BAS_AUTH_STORE_MODE === "supabase";
}

export function getAdminPrincipalId() {
  const value = (process.env.BAS_ADMIN_USER_ID || "").trim();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) return value;
  if (process.env.NODE_ENV !== "production") return DEVELOPMENT_USER_ID;
  throw new Error("BAS_ADMIN_USER_ID must be the UUID of the invited Supabase administrator.");
}

export function verifyAdminPassword(password: string) {
  const [algorithm, parameters, saltValue, expectedValue] = configuredHash().split("$");
  const match = /^N=(32768|65536),r=8,p=1$/.exec(parameters || "");
  if (algorithm !== "scrypt" || !match || !saltValue || !expectedValue) {
    throw new Error("BAS_ADMIN_PASSWORD_HASH has an unsupported format.");
  }
  const cost = Number(match[1]);
  const expected = Buffer.from(expectedValue, "base64url");
  const actual = scryptSync(password, Buffer.from(saltValue, "base64url"), expected.length, {
    N: cost, r: 8, p: 1, maxmem: 128 * 1024 * 1024,
  });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

async function persistSession(payload: SessionPayload) {
  if (!sharedAuthRequired()) return;
  try {
    await insertRows("studio_admin_sessions", {
      session_id: payload.sid,
      principal_id: payload.uid,
      username: payload.sub,
      expires_at: new Date(payload.exp * 1000).toISOString(),
    });
  } catch (error) {
    if (sharedAuthRequired()) throw error;
  }
}

async function sessionIsActive(payload: SessionPayload) {
  if (!sharedAuthRequired()) return !revokedSessions.has(payload.sid);
  try {
    const rows = await selectRows<SessionRow>(
      "studio_admin_sessions",
      `?select=session_id,expires_at,revoked_at&session_id=eq.${encodeURIComponent(payload.sid)}&limit=1`
    );
    const row = rows[0];
    return Boolean(row && !row.revoked_at && new Date(row.expires_at).getTime() > Date.now());
  } catch (error) {
    if (sharedAuthRequired()) throw error;
    return !revokedSessions.has(payload.sid);
  }
}

export async function createAdminSession() {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { v: 2, sub: ADMIN_USERNAME, uid: getAdminPrincipalId(), sid: randomUUID(), iat: now, exp: now + SESSION_SECONDS };
  await persistSession(payload);
  const encoded = encode(JSON.stringify(payload));
  return { token: `${encoded}.${signature(encoded)}`, maxAge: SESSION_SECONDS };
}

export async function readAdminSession(token: string): Promise<SessionPayload | null> {
  try {
    const [encoded, suppliedSignature] = token.split(".");
    if (!encoded || !suppliedSignature) return null;
    const supplied = Buffer.from(suppliedSignature);
    const expected = Buffer.from(signature(encoded));
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const payload = JSON.parse(decode(encoded)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    for (const [sessionId, expiresAt] of revokedSessions) if (expiresAt <= now) revokedSessions.delete(sessionId);
    if (payload.v !== 2 || payload.sub !== ADMIN_USERNAME || !payload.uid || !payload.sid || payload.iat > now + 60 || payload.exp <= now) return null;
    if (!(await sessionIsActive(payload))) return null;
    return payload;
  } catch (error) {
    if (sharedAuthRequired()) throw error;
    return null;
  }
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value || "";
  return token ? await readAdminSession(token) : null;
}

export async function revokeAdminSession() {
  const session = await getAdminSession();
  if (!session) return;
  if (!sharedAuthRequired()) { revokedSessions.set(session.sid, session.exp); return; }
  try {
    await updateRows("studio_admin_sessions", `?session_id=eq.${encodeURIComponent(session.sid)}`, {
      revoked_at: new Date().toISOString(),
    });
  } catch (error) {
    if (sharedAuthRequired()) throw error;
    revokedSessions.set(session.sid, session.exp);
  }
}

export async function attachAdminSession(response: NextResponse) {
  const session = await createAdminSession();
  response.cookies.set(ADMIN_SESSION_COOKIE, session.token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/",
    maxAge: session.maxAge, priority: "high",
  });
  return response;
}

export function clearAdminSession(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/",
    maxAge: 0, priority: "high",
  });
  return response;
}
