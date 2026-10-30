import { NextResponse } from "next/server";
import { clearAdminSession, getAdminSession, revokeAdminSession } from "../../../lib/local-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { action?: string } | null;
  if (body?.action !== "logout") return NextResponse.json({ ok: false, message: "Use the protected administrator sign-in endpoint." }, { status: 410 });
  try {
    await revokeAdminSession();
    return clearAdminSession(NextResponse.json({ ok: true }));
  } catch (error) {
    console.error("Administrator logout revocation failed:", error);
    return clearAdminSession(NextResponse.json({ ok: false, message: "Session revocation is temporarily unavailable." }, { status: 503 }));
  }
}

export async function GET() {
  try { return NextResponse.json({ ok: Boolean(await getAdminSession()) }); }
  catch { return NextResponse.json({ ok: false }, { status: 503 }); }
}
