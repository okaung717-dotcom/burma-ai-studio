import { NextResponse } from "next/server";
import { authAdminRequest } from "../../account/_auth";
import { getMemberSession, emailAuthEnabled } from "../../../lib/member-auth";
import { validRequestOrigin } from "../../../lib/email-auth-security";
import { basicLimit } from "../../../lib/guard";
import { selectRows, supabaseRequest } from "../../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MemberRecord = {
  user_id: string;
  email: string;
  status: string;
  plan_code: string;
  expires_at: string | null;
  created_at: string;
};

async function owner() {
  const member = await getMemberSession();
  return member?.role === "admin" ? member : null;
}

export async function GET() {
  if (!emailAuthEnabled()) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const admin = await owner();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  try {
    const members = await selectRows<MemberRecord>(
      "studio_member_accounts",
      "?select=user_id,email,status,plan_code,expires_at,created_at&order=created_at.desc&limit=100"
    );
    return NextResponse.json({ members }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Cannot list members:", error);
    return NextResponse.json({ error: "Member listing unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!emailAuthEnabled()) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (!validRequestOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const admin = await owner();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const raw = await request.json().catch(() => null) as { email?: unknown; plan?: unknown } | null;
  const email = typeof raw?.email === "string" ? raw.email.trim().toLowerCase() : "";
  const plan = typeof raw?.plan === "string" ? raw.plan : "starter";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
    !["starter", "pro", "premium"].includes(plan)) {
    return NextResponse.json({ error: "Invalid email or plan." }, { status: 400 });
  }

  // Do not derive email invite redirects from untrusted Host or user input.
  const redirect = process.env.BAS_INVITE_REDIRECT_URL || "";
  try {
    const link = new URL(redirect);
    if (link.protocol !== "https:" || link.pathname !== "/activate" || link.username || link.password) {
      throw new Error("Invalid invitation redirect");
    }
  } catch {
    return NextResponse.json({ error: "Owner invitation redirect is not configured." }, { status: 503 });
  }

  try {
    if (!await basicLimit(request, `invite-member:${admin.id}`, 5, 900)) {
      return NextResponse.json({ error: "Invitation limit reached. Try later." }, { status: 429 });
    }

    const invited = await authAdminRequest("/invite", {
      method: "POST",
      body: JSON.stringify({ email, data: { invited_via: "burma_ai_studio" }, redirect_to: redirect }),
    });
    const body = await invited.json().catch(() => ({})) as {
      id?: string; user?: { id?: string }; message?: string;
    };
    if (!invited.ok) {
      return NextResponse.json({ error: "Could not invite this address. Check existing accounts and email settings." },
        { status: invited.status === 429 ? 429 : 409 });
    }
    const userId = body.user?.id || body.id || "";
    if (!/^[0-9a-f-]{36}$/i.test(userId)) throw new Error("Invitation missing user ID");
    await supabaseRequest("rpc/studio_provision_invited_member", {
      method: "POST",
      body: JSON.stringify({
        p_actor_id: admin.id,
        p_user_id: userId,
        p_email: email,
        p_plan_code: plan,
      }),
    });
    return NextResponse.json({ ok: true, message: "Invitation sent. Account created with zero credits." },
      { status: 201 });
  } catch (error) {
    console.error("Member invitation/provisioning failed:", error);
    return NextResponse.json({
      error: "Invitation or database provisioning failed. Inspect server logs before retrying; the email invitation may already have been sent.",
    }, { status: 503 });
  }
}
