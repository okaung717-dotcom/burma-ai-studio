import { isAdminPin, withRedis } from "../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "burma-ai-studio:content";

const defaults = {
  homeTitle: "Next-Gen Video Production",
  homeSubtitle: "AI promotional videos for modern brands.",
  servicesTitle: "AI Video Creation Services",
  contactEmail: "okaung717@gmail.com",
  contactPhone: "09671010011",
};

type Body = Record<string, unknown> & { code?: string };

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 600) : fallback;
}

export async function GET() {
  try {
    const stored = await withRedis(async (client) => client.get(KEY));
    return Response.json({ ok: true, content: stored ? JSON.parse(stored) : defaults });
  } catch {
    return Response.json({ ok: true, content: defaults });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  if (!isAdminPin(body?.code)) return Response.json({ ok: false, message: "Invalid code." }, { status: 401 });
  const content = {
    homeTitle: text(body?.homeTitle, defaults.homeTitle),
    homeSubtitle: text(body?.homeSubtitle, defaults.homeSubtitle),
    servicesTitle: text(body?.servicesTitle, defaults.servicesTitle),
    contactEmail: text(body?.contactEmail, defaults.contactEmail),
    contactPhone: text(body?.contactPhone, defaults.contactPhone),
    updatedAt: new Date().toISOString(),
  };
  await withRedis(async (client) => client.set(KEY, JSON.stringify(content)));
  return Response.json({ ok: true, content });
}
