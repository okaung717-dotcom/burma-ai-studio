import { isAdminPin, withRedis } from "../../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENTS_KEY = "burma-ai-studio:analytics-events";

type Event = {
  visitorId?: string;
  path?: string;
  page?: string;
  source?: string;
  device?: string;
  country?: string;
  language?: string;
  timezone?: string;
  createdAt?: string;
  day?: string;
};

function increment(map: Record<string, number>, key = "Unknown") {
  map[key] = (map[key] || 0) + 1;
}

function top(map: Record<string, number>, limit = 12) {
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function parseEvents(items: string[]) {
  return items
    .map((item) => {
      try { return JSON.parse(item) as Event; } catch { return null; }
    })
    .filter((event): event is Event => Boolean(event));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { code?: string } | null;
    if (!isAdminPin(body?.code)) return Response.json({ ok: false, message: "Invalid admin code." }, { status: 401 });

    const raw = await withRedis(async (client) => client.lRange(EVENTS_KEY, 0, 999));
    const events = parseEvents(raw);
    const visitorSet = new Set<string>();
    const countries: Record<string, number> = {};
    const pages: Record<string, number> = {};
    const sources: Record<string, number> = {};
    const devices: Record<string, number> = {};
    const languages: Record<string, number> = {};
    const days: Record<string, number> = {};

    events.forEach((event) => {
      if (event.visitorId) visitorSet.add(event.visitorId);
      increment(countries, event.country || "Unknown");
      increment(pages, event.page || event.path || "/");
      increment(sources, event.source || "Direct");
      increment(devices, event.device || "Unknown");
      increment(languages, event.language || "Unknown");
      increment(days, event.day || (event.createdAt || "").slice(0, 10) || "Unknown");
    });

    return Response.json({
      ok: true,
      summary: {
        totalViews: events.length,
        uniqueVisitors: visitorSet.size,
        countries: top(countries),
        pages: top(pages),
        sources: top(sources),
        devices: top(devices),
        languages: top(languages),
        days: top(days, 14),
        recentEvents: events.slice(0, 30),
      },
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    return Response.json({ ok: false, message: "Analytics cannot be loaded yet." }, { status: 503 });
  }
}
