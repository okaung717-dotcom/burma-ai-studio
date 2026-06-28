export type JsonRecord = Record<string, unknown>;

type SupabaseConfig = { url: string; key: string };

function cleanUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVER_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) {
    throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVER_KEY in Vercel.");
  }

  return { url: cleanUrl(url), key };
}

function errorMessage(data: unknown) {
  if (isRecord(data)) return [data.message, data.details, data.hint].filter(Boolean).join(" ");
  return "Supabase request failed.";
}

export function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function text(value: unknown, fallback = "", max = 4000) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}

export async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  const { url, key } = getSupabaseConfig();
  const headers = new Headers(init.headers);

  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${key}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${url}/rest/v1/${path}`, { ...init, headers, cache: "no-store" });
  const raw = await response.text();
  const data = raw ? (JSON.parse(raw) as unknown) : null;

  if (!response.ok) throw new Error(errorMessage(data));
  return data as T;
}

export async function selectRows<T>(table: string, query = "?select=*") {
  const suffix = query ? (query.startsWith("?") ? query : `?${query}`) : "";
  return supabaseRequest<T[]>(`${table}${suffix}`);
}

export async function insertRows<T extends JsonRecord>(table: string, rows: T | T[]) {
  return supabaseRequest<T[]>(table, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(Array.isArray(rows) ? rows : [rows]),
  });
}

export async function upsertRows<T extends JsonRecord>(table: string, rows: T | T[], onConflict: string) {
  return supabaseRequest<T[]>(`${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(Array.isArray(rows) ? rows : [rows]),
  });
}

export async function updateRows<T extends JsonRecord>(table: string, query: string, values: JsonRecord) {
  const suffix = query ? (query.startsWith("?") ? query : `?${query}`) : "";
  return supabaseRequest<T[]>(`${table}${suffix}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(values),
  });
}

export async function deleteRows(table: string, query: string) {
  const suffix = query ? (query.startsWith("?") ? query : `?${query}`) : "";
  await supabaseRequest<null>(`${table}${suffix}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
}

export function getAdminControlCode() {
  return process.env.ADMIN_CONTROL || process.env["ADMIN_Control"] || process.env.ADMIN_PIN || "";
}

export function isAdminPin(pin: unknown) {
  const adminCode = getAdminControlCode();
  return typeof pin === "string" && Boolean(adminCode) && pin === adminCode;
}
