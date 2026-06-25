import { cookies } from "next/headers";
import { CHAT_LOG_KEY, LEADS_KEY, PORTFOLIO_KEY, withRedis } from "../../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "bas_admin_ok";
const LEAD_STATUS_KEY = "burma-ai-studio:lead-status";
const CHAT_STATE_KEY = "burma-ai-studio:chat-state";
const EVENTS_KEY = "burma-ai-studio:analytics-events";
const CONTENT_KEY = "burma-ai-studio:content";

type Lead = Record<string, unknown> & {
  id?: string;
  status?: string;
  createdAt?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  projectDetails?: string;
  source?: string;
  userAgent?: string;
};
type ChatLog = { id?: string; visitorId?: string; role?: "user" | "assistant" | "admin"; content?: string; page?: string; createdAt?: string };
type AnalyticsEvent = { visitorId?: string; eventType?: string; page?: string; path?: string; source?: string; device?: string; country?: string; createdAt?: string; day?: string; videoTitle?: string; videoId?: string };
type PortfolioItem = { id?: string; src?: string; titleEN?: string; titleMM?: string; featured?: boolean };

const defaultPortfolio: PortfolioItem[] = [
  { id: "trailer", titleEN: "Cinematic Trailers AI Video", titleMM: "Trailer AI Video", featured: true },
  { id: "architecture", titleEN: "Architecture AI Videos", titleMM: "Architecture AI Videos", featured: true },
  { id: "commercial", titleEN: "Cinematic Commercial", titleMM: "Cinematic Commercial", featured: true },
  { id: "presenter", titleEN: "Virtual Presenter Campaign", titleMM: "AI Presenter Videos", featured: true },
];

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try { return JSON.parse(value) as T; } catch { return null; }
}

function parseMany<T>(items: string[]) {
  return items.map((item) => parseJson<T>(item)).filter((item): item is T => Boolean(item));
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLead(lead: Lead): Lead {
  const firstName = cleanText(lead.firstName);
  const lastName = cleanText(lead.lastName);
  const fullName = cleanText(lead.fullName) || cleanText(lead.name) || [firstName, lastName].filter(Boolean).join(" ");
  const message = cleanText(lead.message) || cleanText(lead.projectDetails);
  const service = cleanText(lead.service) || cleanText(lead.source) || "contact-page";

  return {
    ...lead,
    firstName,
    lastName,
    fullName: fullName || cleanText(lead.email) || "Unknown lead",
    name: fullName || cleanText(lead.email) || "Unknown lead",
    email: cleanText(lead.email),
    phone: cleanText(lead.phone),
    projectDetails: message,
    message,
    service,
    source: cleanText(lead.source) || service,
    userAgent: cleanText(lead.userAgent),
  };
}

function countBy<T>(items: T[], getter: (item: T) => string | undefined, fallback = "Unknown") {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = getter(item) || fallback;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function top(map: Record<string, number>, limit = 8) {
  return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, limit);
}

function applyLeadStatuses(leads: Lead[], statuses: Record<string, string>) {
  return leads.map((lead) => {
    const id = typeof lead.id === "string" ? lead.id : "";
    const saved = id ? parseJson<Partial<Lead>>(statuses[id] || null) : null;
    return normalizeLead({ status: "New", ...lead, ...(saved || {}) });
  });
}

function buildChatThreads(logs: ChatLog[], states: Record<string, string>) {
  const map = new Map<string, { visitorId: string; latestAt: string; latestMessage: string; latestRole: string; unread: number; state: string; messageCount: number }>();
  logs.forEach((log) => {
    const visitorId = log.visitorId || "unknown";
    const existing = map.get(visitorId) || { visitorId, latestAt: "", latestMessage: "", latestRole: "", unread: 0, state: "Open", messageCount: 0 };
    existing.messageCount += 1;
    if (log.role === "user") existing.unread += 1;
    if (!existing.latestAt || (log.createdAt || "") > existing.latestAt) {
      existing.latestAt = log.createdAt || existing.latestAt;
      existing.latestMessage = log.content || "";
      existing.latestRole = log.role || "";
    }
    const saved = parseJson<{ state?: string }>(states[visitorId] || null);
    if (saved?.state) existing.state = saved.state;
    map.set(visitorId, existing);
  });
  return Array.from(map.values()).sort((a, b) => b.latestAt.localeCompare(a.latestAt));
}

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get(COOKIE_NAME)?.value !== "1") {
    return Response.json({ ok: false, message: "Admin session required." }, { status: 401 });
  }

  try {
    const data = await withRedis(async (client) => {
      const [leadRaw, leadStatuses, chatRaw, chatStates, analyticsRaw, portfolioStored, contentStored] = await Promise.all([
        client.lRange(LEADS_KEY, 0, 199),
        client.hGetAll(LEAD_STATUS_KEY),
        client.lRange(CHAT_LOG_KEY, 0, 799),
        client.hGetAll(CHAT_STATE_KEY),
        client.lRange(EVENTS_KEY, 0, 1499),
        client.get(PORTFOLIO_KEY),
        client.get(CONTENT_KEY),
      ]);
      return { leadRaw, leadStatuses, chatRaw, chatStates, analyticsRaw, portfolioStored, contentStored };
    });

    const leads = applyLeadStatuses(parseMany<Lead>(data.leadRaw), data.leadStatuses);
    const chatLogs = parseMany<ChatLog>(data.chatRaw);
    const threads = buildChatThreads(chatLogs, data.chatStates);
    const events = parseMany<AnalyticsEvent>(data.analyticsRaw);
    const pageEvents = events.filter((event) => event.eventType !== "portfolio-video-view");
    const visitors = new Set(pageEvents.map((event) => event.visitorId).filter(Boolean));
    const storedPortfolioItems = parseJson<PortfolioItem[]>(data.portfolioStored) || [];
    const visiblePortfolioItems = storedPortfolioItems.length ? storedPortfolioItems : defaultPortfolio;
    const content = parseJson<Record<string, unknown>>(data.contentStored);

    const leadStatusCounts = countBy(leads, (lead) => String(lead.status || "New"));
    const chatStateCounts = countBy(threads, (thread) => thread.state);
    const unreadThreads = threads.filter((thread) => thread.latestRole === "user" || thread.state === "Unread").length;

    const recommendations = [
      ...(unreadThreads ? [`${unreadThreads} chat thread needs a reply.`] : ["No unread chat thread right now."]),
      ...((leadStatusCounts.New || 0) ? [`${leadStatusCounts.New} new lead should be reviewed.`] : ["No new lead waiting." ]),
      ...(storedPortfolioItems.length ? [`${storedPortfolioItems.length} custom portfolio item(s) are stored.`] : ["Portfolio is using the public default examples." ]),
      ...(content ? ["Website CMS content is configured."] : ["CMS is still using default website content." ]),
    ];

    return Response.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      stats: {
        leads: leads.length,
        newLeads: leadStatusCounts.New || 0,
        hotLeads: leadStatusCounts.Hot || 0,
        chatThreads: threads.length,
        unreadThreads,
        totalViews: pageEvents.length,
        uniqueVisitors: visitors.size,
        portfolioItems: visiblePortfolioItems.length,
        contentConfigured: Boolean(content),
      },
      leads: leads.slice(0, 8),
      leadStatusCounts,
      chatThreads: threads.slice(0, 8),
      chatStateCounts,
      analytics: {
        topPages: top(countBy(pageEvents, (event) => event.page || event.path || "/")),
        topSources: top(countBy(pageEvents, (event) => event.source || "Direct"), 5),
        topDevices: top(countBy(pageEvents, (event) => event.device || "Unknown"), 5),
        recentEvents: events.slice(0, 8),
      },
      portfolioItems: visiblePortfolioItems.slice(0, 8),
      content,
      recommendations,
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return Response.json({ ok: false, message: "Real admin data cannot be loaded yet. Check REDIS_URL and deployment logs." }, { status: 503 });
  }
}
