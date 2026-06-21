export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "burma-ai-studio:leads";

async function run(command: string[]) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Storage not configured");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) throw new Error(data?.error || "Storage error");
  return data?.result;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { code?: string } | null;
    const code = process.env.ADMIN_PIN;
    if (!code) return Response.json({ ok: false, message: "ADMIN_PIN is not configured." }, { status: 503 });
    if (!body?.code || body.code !== code) return Response.json({ ok: false, message: "Invalid code." }, { status: 401 });

    const raw = (await run(["LRANGE", KEY, "0", "199"])) as string[] | null;
    const leads = (raw || []).map((item) => {
      try { return JSON.parse(item); } catch { return null; }
    }).filter(Boolean);

    return Response.json({ ok: true, leads });
  } catch (error) {
    console.error("Inbox error:", error);
    return Response.json({ ok: false, message: "Inbox storage is not configured yet." }, { status: 503 });
  }
}
