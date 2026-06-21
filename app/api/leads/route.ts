import { createClient } from "redis";
import { sendOwnerNotice } from "../../lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  projectDetails?: string;
  source?: string;
};

const LEADS_KEY = "burma-ai-studio:leads";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 3000) : "";
}

async function withRedis<T>(callback: (client: ReturnType<typeof createClient>) => Promise<T>) {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not configured.");

  const client = createClient({ url });
  client.on("error", (error) => console.error("Redis client error:", error));

  await client.connect();
  try {
    return await callback(client);
  } finally {
    await client.quit();
  }
}

export async function POST(request: Request) {
  try {
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
    console.error("Lead save error:", error);
    return Response.json(
      {
        ok: false,
        message: "Message storage is not configured yet, but the email/Telegram/Viber contact options still work.",
      },
      { status: 503 }
    );
  }
}
