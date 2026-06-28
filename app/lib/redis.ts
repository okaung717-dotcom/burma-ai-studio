import {
  deleteRows,
  insertRows,
  isAdminPin,
  isRecord,
  selectRows,
  text,
  upsertRows,
  updateRows,
} from "./supabase";

export { getAdminControlCode, isAdminPin } from "./supabase";

export const LEADS_KEY = "burma-ai-studio:leads";
export const PORTFOLIO_KEY = "burma-ai-studio:portfolio";
export const CHAT_LOG_KEY = "burma-ai-studio:chat-logs";

const LEAD_STATUS_KEY = "burma-ai-studio:lead-status";
const CHAT_STATE_KEY = "burma-ai-studio:chat-state";
const EVENTS_KEY = "burma-ai-studio:analytics-events";
const CONTENT_KEY = "burma-ai-studio:content";

type Row = Record<string, unknown>;

type LeadRow = {
  id: string;
  created_at?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  payload?: unknown;
};

type ChatRow = {
  id: string;
  visitor_id?: string;
  role?: string;
  content?: string;
  page?: string;
  language?: string;
  created_at?: string;
  payload?: unknown;
};

type AnalyticsRow = {
  id: string;
  visitor_id?: string;
  event_type?: string;
  path?: string;
  page?: string;
  source?: string;
  device?: string;
  language?: string;
  timezone?: string;
  country?: string;
  video_id?: string;
  video_title?: string;
  day?: string;
  created_at?: string;
  payload?: unknown;
};

type StatusRow = {
  lead_id: string;
  status?: string;
  note?: string;
  updated_at?: string;
};

type ChatStateRow = {
  visitor_id: string;
  state?: string;
  updated_at?: string;
};

type PortfolioRow = {
  id: string;
  src?: string;
  title_en?: string;
  desc_en?: string;
  title_mm?: string;
  desc_mm?: string;
  featured?: boolean;
  sort_order?: number;
};

type ContentRow = {
  id: string;
  content?: unknown;
};

type RateLimitRow = {
  key: string;
  count?: number;
  reset_at?: string;
};

function parseObject(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function parseArray(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isRecord) : [];
  } catch {
    return [];
  }
}

function rowPayload(row: { payload?: unknown }, fallback: Row) {
  return isRecord(row.payload) ? row.payload : fallback;
}

function leadFromRow(row: LeadRow) {
  const payload = rowPayload(row, {});
  return {
    ...payload,
    id: text(payload.id, row.id),
    createdAt: text(payload.createdAt, row.created_at || ""),
    status: text(payload.status, row.status || "New"),
    fullName: text(payload.fullName, row.full_name || ""),
    email: text(payload.email, row.email || ""),
    phone: text(payload.phone, row.phone || ""),
    source: text(payload.source, row.source || ""),
  };
}

function chatFromRow(row: ChatRow) {
  const payload = rowPayload(row, {});
  return {
    ...payload,
    id: text(payload.id, row.id),
    visitorId: text(payload.visitorId, row.visitor_id || ""),
    role: text(payload.role, row.role || "user"),
    content: text(payload.content, row.content || ""),
    page: text(payload.page, row.page || "/"),
    language: text(payload.language, row.language || "Unknown"),
    createdAt: text(payload.createdAt, row.created_at || ""),
  };
}

function analyticsFromRow(row: AnalyticsRow) {
  const payload = rowPayload(row, {});
  return {
    ...payload,
    id: text(payload.id, row.id),
    visitorId: text(payload.visitorId, row.visitor_id || ""),
    eventType: text(payload.eventType, row.event_type || "page-view"),
    path: text(payload.path, row.path || "/"),
    page: text(payload.page, row.page || "/"),
    source: text(payload.source, row.source || "Direct"),
    device: text(payload.device, row.device || "Unknown"),
    language: text(payload.language, row.language || "Unknown"),
    timezone: text(payload.timezone, row.timezone || "Unknown"),
    country: text(payload.country, row.country || "Unknown"),
    videoId: text(payload.videoId, row.video_id || ""),
    videoTitle: text(payload.videoTitle, row.video_title || ""),
    createdAt: text(payload.createdAt, row.created_at || ""),
    day: text(payload.day, row.day || ""),
  };
}

function portfolioFromRow(row: PortfolioRow) {
  return {
    id: row.id,
    src: row.src || "",
    titleEN: row.title_en || "AI Video Project",
    descEN: row.desc_en || "Burma AI Studio portfolio video",
    titleMM: row.title_mm || "AI Video Project",
    descMM: row.desc_mm || "Burma AI Studio portfolio video",
    featured: Boolean(row.featured),
  };
}

function idFromPayload(payload: Row) {
  return text(payload.id, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, 160);
}

function createdAtFromPayload(payload: Row) {
  return text(payload.createdAt, new Date().toISOString(), 80);
}

function limitFromRange(start: number, stop: number, fallback: number) {
  return stop >= start ? Math.max(1, stop - start + 1) : fallback;
}

function filterValue(value: string) {
  return encodeURIComponent(value);
}

class SupabaseRedisCompatClient {
  async lPush(key: string, value: string) {
    const payload = parseObject(value);

    if (key === LEADS_KEY) {
      await insertRows("leads", {
        id: idFromPayload(payload),
        created_at: createdAtFromPayload(payload),
        full_name: text(payload.fullName || payload.name, "", 300),
        email: text(payload.email, "", 300),
        phone: text(payload.phone, "", 120),
        source: text(payload.source, "contact-page", 120),
        status: text(payload.status, "New", 80),
        payload,
      });
      return 1;
    }

    if (key === CHAT_LOG_KEY) {
      await insertRows("chat_logs", {
        id: idFromPayload(payload),
        visitor_id: text(payload.visitorId, "unknown", 180),
        role: text(payload.role, "user", 40),
        content: text(payload.content, "", 5000),
        page: text(payload.page, "/", 180),
        language: text(payload.language, "Unknown", 80),
        created_at: createdAtFromPayload(payload),
        payload,
      });
      return 1;
    }

    if (key === EVENTS_KEY) {
      await insertRows("analytics_events", {
        id: idFromPayload(payload),
        visitor_id: text(payload.visitorId, "", 180),
        event_type: text(payload.eventType, "page-view", 80),
        path: text(payload.path, "/", 300),
        page: text(payload.page, "/", 180),
        source: text(payload.source, "Direct", 160),
        device: text(payload.device, "Unknown", 80),
        language: text(payload.language, "Unknown", 80),
        timezone: text(payload.timezone, "Unknown", 140),
        country: text(payload.country, "Unknown", 80),
        video_id: text(payload.videoId, "", 160),
        video_title: text(payload.videoTitle, "", 220),
        day: text(payload.day, new Date().toISOString().slice(0, 10), 20),
        created_at: createdAtFromPayload(payload),
        payload,
      });
      return 1;
    }

    return 0;
  }

  async lTrim(_key: string, _start: number, _stop: number) {
    return "OK";
  }

  async lRange(key: string, start: number, stop: number) {
    if (key === LEADS_KEY) {
      const rows = await selectRows<LeadRow>(
        "leads",
        `?select=*&order=created_at.desc&limit=${limitFromRange(start, stop, 200)}`
      );
      return rows.map((row) => JSON.stringify(leadFromRow(row)));
    }

    if (key === CHAT_LOG_KEY) {
      const rows = await selectRows<ChatRow>(
        "chat_logs",
        `?select=*&order=created_at.desc&limit=${limitFromRange(start, stop, 800)}`
      );
      return rows.map((row) => JSON.stringify(chatFromRow(row)));
    }

    if (key === EVENTS_KEY) {
      const rows = await selectRows<AnalyticsRow>(
        "analytics_events",
        `?select=*&order=created_at.desc&limit=${limitFromRange(start, stop, 1500)}`
      );
      return rows.map((row) => JSON.stringify(analyticsFromRow(row)));
    }

    return [];
  }

  async hGetAll(key: string) {
    if (key === LEAD_STATUS_KEY) {
      const rows = await selectRows<StatusRow>("lead_statuses", "?select=*");
      return Object.fromEntries(
        rows.map((row) => [
          row.lead_id,
          JSON.stringify({
            id: row.lead_id,
            status: row.status || "New",
            note: row.note || "",
            updatedAt: row.updated_at || "",
          }),
        ])
      );
    }

    if (key === CHAT_STATE_KEY) {
      const rows = await selectRows<ChatStateRow>("chat_states", "?select=*");
      return Object.fromEntries(
        rows.map((row) => [
          row.visitor_id,
          JSON.stringify({
            visitorId: row.visitor_id,
            state: row.state || "Open",
            updatedAt: row.updated_at || "",
          }),
        ])
      );
    }

    return {};
  }

  async hSet(key: string, field: string, value: string) {
    const payload = parseObject(value);
    const updatedAt = text(payload.updatedAt, new Date().toISOString(), 80);

    if (key === LEAD_STATUS_KEY) {
      await upsertRows(
        "lead_statuses",
        {
          lead_id: field,
          status: text(payload.status, "New", 80),
          note: text(payload.note, "", 2000),
          updated_at: updatedAt,
        },
        "lead_id"
      );
      await updateRows("leads", `?id=eq.${filterValue(field)}`, {
        status: text(payload.status, "New", 80),
      });
      return 1;
    }

    if (key === CHAT_STATE_KEY) {
      await upsertRows(
        "chat_states",
        {
          visitor_id: field,
          state: text(payload.state, "Open", 80),
          updated_at: updatedAt,
        },
        "visitor_id"
      );
      return 1;
    }

    return 0;
  }

  async get(key: string) {
    if (key === PORTFOLIO_KEY) {
      const rows = await selectRows<PortfolioRow>("portfolio_items", "?select=*&order=sort_order.asc");
      return rows.length ? JSON.stringify(rows.map(portfolioFromRow)) : null;
    }

    if (key === CONTENT_KEY) {
      const rows = await selectRows<ContentRow>("content_settings", "?select=content&id=eq.default&limit=1");
      const content = rows[0]?.content;
      return isRecord(content) ? JSON.stringify(content) : null;
    }

    return null;
  }

  async set(key: string, value: string) {
    if (key === PORTFOLIO_KEY) {
      const items = parseArray(value);
      await deleteRows("portfolio_items", "?id=not.is.null");

      if (items.length) {
        await insertRows(
          "portfolio_items",
          items.map((item, index) => ({
            id: text(item.id, `${Date.now()}-${index}`, 120),
            src: text(item.src, "", 180),
            title_en: text(item.titleEN, "AI Video Project", 500),
            desc_en: text(item.descEN, "Burma AI Studio portfolio video", 700),
            title_mm: text(item.titleMM, "AI Video Project", 500),
            desc_mm: text(item.descMM, "Burma AI Studio portfolio video", 700),
            featured: Boolean(item.featured),
            sort_order: index,
            updated_at: new Date().toISOString(),
          }))
        );
      }

      return "OK";
    }

    if (key === CONTENT_KEY) {
      const content = parseObject(value);
      await upsertRows(
        "content_settings",
        {
          id: "default",
          content,
          updated_at: new Date().toISOString(),
        },
        "id"
      );
      return "OK";
    }

    return "OK";
  }

  async incr(key: string) {
    const rows = await selectRows<RateLimitRow>("rate_limits", `?select=*&key=eq.${filterValue(key)}&limit=1`);
    const now = Date.now();
    const current = rows[0];
    const active = current?.reset_at ? new Date(current.reset_at).getTime() > now : false;
    const count = active ? Number(current?.count || 0) + 1 : 1;
    const resetAt = active && current?.reset_at ? current.reset_at : new Date(now + 60_000).toISOString();

    await upsertRows(
      "rate_limits",
      {
        key,
        count,
        reset_at: resetAt,
      },
      "key"
    );

    return count;
  }

  async expire(key: string, seconds: number) {
    await updateRows("rate_limits", `?key=eq.${filterValue(key)}`, {
      reset_at: new Date(Date.now() + seconds * 1000).toISOString(),
    });
    return true;
  }
}

export async function withRedis<T>(callback: (client: SupabaseRedisCompatClient) => Promise<T>) {
  const client = new SupabaseRedisCompatClient();
  return callback(client);
}