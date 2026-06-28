import { sendOwnerNotice } from "../../lib/notify";
import { basicLimit } from "../../lib/guard";
import { LEADS_KEY, withRedis } from "../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  projectDetails?: string;
  source?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 3000) : "";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function POST(request: Request) {
  try {
    const allowed = await basicLimit(request, "lead", 6, 60);
    if (!allowed) {
      return Response.json({ ok: false, message: "Too many requests." }, { status: 429 });
    }

    const body = (await request.json().catch(() => null)) as LeadInput | null;

    const firstName = clean(body?.firstName);
    const lastName = clean(body?.lastName);
    const email = clean(body?.email);
    const projectDetails = clean(body?.projectDetails);

    if (!firstName && !lastName && !email && !projectDetails) {
      return Response.json({ ok: false, message: "Please add project details first." }, { status: 400 });
    }

    const lead = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      status: "New",
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim() || "New Client",
      email,
      projectDetails,
      source: clean(body?.source) || "contact-page",
      userAgent: request.headers.get("user-agent") || "Unknown",
    };

    await withRedis(async (client) => {
      await client.lPush(LEADS_KEY, JSON.stringify(lead));
      await client.lTrim(LEADS_KEY, 0, 199);
    });

    sendOwnerNotice({
      subject: "New Burma AI Studio message",
      text: `Name: ${lead.fullName}\nEmail: ${lead.email}\nMessage: ${lead.projectDetails}`,
      html: `<p><b>Name:</b> ${lead.fullName}</p><p><b>Email:</b> ${lead.email}</p><p><b>Message:</b><br/>${lead.projectDetails}</p>`,
    }).catch(() => undefined);

    return Response.json({ ok: true, leadId: lead.id });
  } catch (error) {
    const detail = getErrorMessage(error);
    console.error("Lead save error:", detail);

    return Response.json(
      {
        ok: false,
        message: "Lead save failed.",
        detail,
      },
      { status: 503 }
    );
  }
}