import { NextResponse } from "next/server";
import { clearAdminSession, revokeAdminSession } from "../../../lib/local-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await revokeAdminSession();
  return clearAdminSession(NextResponse.json({ ok: true }));
}
