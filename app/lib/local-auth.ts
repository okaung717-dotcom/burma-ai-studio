import "server-only";

import { createHmac, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_USERNAME = "okkar";
export const ADMIN_SESSION_COOKIE = "bas_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

type SessionPayload = { v: 1; sub: typeof ADMIN_USERNAME; sid: string; iat: number; exp: number };
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

export function verifyAdminPassword(password: string) {
  const [algorithm, parameters, saltValue, expectedValue] = configuredHash().split("$");
  if (algorithm !== "scrypt" || parameters !== "N=32768,r=8,p=1" || !saltValue || !expectedValue) {
    throw new Error("BAS_ADMIN_PASSWORD_HASH has an unsupported format.");
  }
  const expected = Buffer.from(expectedValue, "base64url");
  const actual = scryptSync(password, Buffer.from(saltValue, "base64url"), expected.length, {
    N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024,
  });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createAdminSession() {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { v: 1, sub: ADMIN_USERNAME, sid: randomUUID(), iat: now, exp: now + SESSION_SECONDS };
  const encoded = encode(JSON.stringify(payload));
  return { token: `${encoded}.${signature(encoded)}`, maxAge: SESSION_SECONDS };
}

export function readAdminSession(token: string): SessionPayload | null {
  try {
    const [encoded, suppliedSignature] = token.split(".");
    if (!encoded || !suppliedSignature) return null;
    const supplied = Buffer.from(suppliedSignature);
    const expected = Buffer.from(signature(encoded));
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const payload = JSON.parse(decode(encoded)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    for (const [sessionId, expiresAt] of revokedSessions) if (expiresAt <= now) revokedSessions.delete(sessionId);
    if (payload.v !== 1 || payload.sub !== ADMIN_USERNAME || !payload.sid || payload.iat > now + 60 || payload.exp <= now || revokedSessions.has(payload.sid)) return null;
    return payload;
  } catch { return null; }
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value || "";
  return token ? readAdminSession(token) : null;
}

export async function revokeAdminSession() {
  const session = await getAdminSession();
  if (session) revokedSessions.set(session.sid, session.exp);
}

export function attachAdminSession(response: NextResponse) {
  const session = createAdminSession();
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
