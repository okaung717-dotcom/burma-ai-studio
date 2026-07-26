import { NextResponse } from "next/server";
import { authAdminRequest, getSupabaseAdminAuthConfig } from "../_auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function keyKind(value: string | undefined) {
  const key = (value || "").trim();
  if (!key) return "missing";
  if (key.startsWith("sb_secret_")) return "secret";
  if (key.startsWith("sb_publishable_")) return "publishable";
  if (key.split(".").length === 3) return "jwt";
  return "other";
}

export async function GET() {
  const env = {
    SUPABASE_SECRET_KEY: keyKind(process.env.SUPABASE_SECRET_KEY),
    SUPABASE_SERVICE_ROLE_KEY: keyKind(process.env.SUPABASE_SERVICE_ROLE_KEY),
    SUPABASE_SERVER_KEY: keyKind(process.env.SUPABASE_SERVER_KEY),
    SUPABASE_PUBLISHABLE_KEY: keyKind(process.env.SUPABASE_PUBLISHABLE_KEY),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: keyKind(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    SUPABASE_ANON_KEY: keyKind(process.env.SUPABASE_ANON_KEY),
  };

  try {
    const config = getSupabaseAdminAuthConfig();
    const selectedKind = keyKind(config.apiKey);
    const response = await authAdminRequest("/admin/users?page=1&per_page=1", { method: "GET" });
    const raw = await response.text();
    let errorCode = "";
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      errorCode = String(parsed?.code || parsed?.error_code || parsed?.msg || parsed?.message || "").slice(0, 160);
    } catch {}

    return NextResponse.json({ env, selectedKind, adminStatus: response.status, adminOk: response.ok, errorCode });
  } catch (error) {
    return NextResponse.json({
      env,
      adminOk: false,
      setupError: error instanceof Error ? error.message : "Unknown diagnostics error",
    });
  }
}
