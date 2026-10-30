import "server-only";

import { createHmac } from "node:crypto";
import { supabaseRequest } from "./supabase";

export async function memberLoginRateLimit(request: Request, email: string) {
  const signingKey = process.env.BAS_SESSION_SECRET || "";
  if (signingKey.length < 32) throw new Error("Session secret unavailable");
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") || "unknown";
  const key = createHmac("sha256", signingKey)
    .update(`member-login:${clientIp}:${email.toLowerCase()}`)
    .digest("hex");
  const rows = await supabaseRequest<Array<{ allowed: boolean; retry_after: number }>>(
    "rpc/consume_studio_login_attempt",
    { method: "POST", body: JSON.stringify({ p_key: key, p_limit: 5, p_window_seconds: 900 }) }
  );
  return { allowed: rows[0]?.allowed === true, retryAfter: Math.max(0, rows[0]?.retry_after || 0) };
}

/** Block cross-origin form submission on routes that mutate member state. */
export function validRequestOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host &&
      new URL(origin).protocol === "https:" || (
        process.env.NODE_ENV !== "production" &&
        new URL(origin).origin === new URL(request.url).origin
      );
  } catch { return false; }
}
