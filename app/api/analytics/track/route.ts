import { createHash } from "crypto";
import { withRedis } from "../../../lib/redis";
import { basicLimit } from "../../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENTS_KEY = "burma-ai-studio:analytics-events";

type TrackBody = {
  visitorId?: string;
  path?: string;
  page?: string;
  source?: string;
  device?: string;
  language?: string;
  timezone?: string;
  eventType?: string;
  videoId?: string;
  videoTitle?: string;
};

function clean(value: unknown, fallback = "Unknown", max = 180) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}

function countryFromRequest(request: Request) {
  return request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "Unknown";
}

function hashVisitor(visitorId: string) {
  const salt = process.env.ANALYTICS_SALT || "burma-ai-studio";
  return createHash("sha256").update(`${salt}:${visitorId}`).digest("hex").slice(0, 24);
}

export async function POST(request: Request) {
  try {
    const allowed = await basicLimit(request, "analytics", 90, 60);
    if (!allowed) return Response.json({ ok: true });

    const body = (await request.json().catch(() => null)) as TrackBody | null;
    const visitorId = clean(body?.visitorId, "anonymous", 200);
    const now = new Date();
    const event = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      visitorId: hashVisitor(visitorId),
      eventType: clean(body?.eventType, "page-view", 80),
      path: clean(body?.path, "/", 260),
      page: clean(body?.page, "/", 160),
      source: clean(body?.source, "Direct", 120),
      device: clean(body?.device, "Unknown", 80),
      language: clean(body?.language, "Unknown", 80),
      timezone: clean(body?.timezone, "Unknown", 120),
      country: countryFromRequest(request),
      videoId: clean(body?.videoId, "", 120),
      videoTitle: clean(body?.videoTitle, "", 180),
      createdAt: now.toISOString(),
      day: now.toISOString().slice(0, 10),
    };

    await withRedis(async (client) => {
      await client.lPush(EVENTS_KEY, JSON.stringify(event));
      await client.lTrim(EVENTS_KEY, 0, 1499);
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Analytics track error:", error);
    return Response.json({ ok: true });
  }
}
