import { LEADS_KEY, withRedis } from "../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_KEY = "burma-ai-studio:lead-status";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLead(lead: Record<string, unknown>) {
  const firstName = clean(lead.firstName);
  const lastName = clean(lead.lastName);
  const fullName = clean(lead.fullName) || clean(lead.name) || [firstName, lastName].filter(Boolean).join(" ");
  const message = clean(lead.message) || clean(lead.projectDetails);
  const service = clean(lead.service) || clean(lead.source) || "contact-page";

  return {
    ...lead,
    firstName,
    lastName,
    fullName: fullName || clean(lead.email) || "Unknown lead",
    name: fullName || clean(lead.email) || "Unknown lead",
    email: clean(lead.email),
    phone: clean(lead.phone),
    projectDetails: message,
    message,
    service,
    source: clean(lead.source) || service,
    userAgent: clean(lead.userAgent),
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { code?: string } | null;
    const code = process.env.ADMIN_CONTROL || process.env.ADMIN_Control || process.env.ADMIN_PIN || "";
    if (!code) return Response.json({ ok: false, message: "ADMIN_CONTROL is not configured." }, { status: 503 });
    if (!body?.code || body.code !== code) return Response.json({ ok: false, message: "Invalid code." }, { status: 401 });

    const { raw, statuses } = await withRedis(async (client) => ({
      raw: await client.lRange(LEADS_KEY, 0, 199),
      statuses: await client.hGetAll(STATUS_KEY),
    }));

    const leads = raw.map((item) => {
      try {
        const lead = JSON.parse(item) as Record<string, unknown>;
        const id = typeof lead.id === "string" ? lead.id : "";
        const saved = id && statuses[id] ? JSON.parse(statuses[id]) as Record<string, unknown> : null;
        return normalizeLead({ status: "New", ...lead, ...(saved || {}) });
      } catch {
        return null;
      }
    }).filter(Boolean);

    return Response.json({ ok: true, leads });
  } catch (error) {
    console.error("Inbox error:", error);
    return Response.json({ ok: false, message: "Inbox storage is not configured yet." }, { status: 503 });
  }
}
