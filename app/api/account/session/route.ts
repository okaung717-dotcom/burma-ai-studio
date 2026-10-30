import { NextResponse } from "next/server";
import { ADMIN_USERNAME, getAdminSession } from "../../../lib/local-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let session;
  try { session = await getAdminSession(); }
  catch { return NextResponse.json({ authenticated: false, user: null }, { status: 503 }); }
  return NextResponse.json({
    authenticated: Boolean(session),
    user: session ? { id: session.uid, username: ADMIN_USERNAME, displayName: ADMIN_USERNAME } : null,
  });
}
