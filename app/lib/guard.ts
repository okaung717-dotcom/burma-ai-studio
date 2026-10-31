import { createHash } from "node:crypto";
import { supabaseRequest } from "./supabase";

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

export async function basicLimit(request: Request, name: string, max = 12, windowSeconds = 60) {
  const key = createHash("sha256").update(`burma-ai-studio:limit:${name}:${getClientKey(request)}`).digest("hex");
  try {
    const rows = await supabaseRequest<Array<{ allowed: boolean }>>("rpc/consume_studio_login_attempt", {
      method: "POST",
      body: JSON.stringify({ p_key: key, p_limit: max, p_window_seconds: windowSeconds }),
    });
    return Boolean(rows[0]?.allowed);
  } catch {
    return process.env.NODE_ENV !== "production";
  }
}

export function tooLong(text: string, max = 5000) {
  return text.length > max;
}
