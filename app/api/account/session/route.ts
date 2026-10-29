import { NextResponse } from "next/server";
import { ADMIN_USERNAME, getAdminSession } from "../../../lib/local-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({
    authenticated: Boolean(session),
    user: session ? { id: session.sid, username: ADMIN_USERNAME, displayName: ADMIN_USERNAME } : null,
  });
}
