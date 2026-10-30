import { NextResponse } from "next/server";
import { clearAdminSession, revokeAdminSession } from "../../../lib/local-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await revokeAdminSession();
    return clearAdminSession(NextResponse.json({ ok: true }));
  } catch (error) {
    console.error("Shared session revocation failed:", error);
    return clearAdminSession(NextResponse.json({ ok: false, error: "Session revocation is temporarily unavailable." }, { status: 503 }));
  }
}
