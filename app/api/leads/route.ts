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

async function redisCommand(command: string[]) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("Lead storage is not configured.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.error) {
    throw new Error(data?.error || "Lead storage request failed.");
  }

  return data?.result;
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
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim() || "New Client",
      email,
      projectDetails,
      source: clean(body?.source) || "contact-page",
      userAgent: request.headers.get("user-agent") || "Unknown",
    };

    await redisCommand(["LPUSH", LEADS_KEY, JSON.stringify(lead)]);
    await redisCommand(["LTRIM", LEADS_KEY, "0", "199"]);

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
