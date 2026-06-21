import { isAdminPin, PORTFOLIO_KEY, withRedis } from "../../lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PortfolioItem = {
  id: string;
  src: string;
  titleEN: string;
  descEN: string;
  titleMM: string;
  descMM: string;
  featured?: boolean;
};

const defaultPortfolio: PortfolioItem[] = [
  { id: "trailer", src: "DVM3o2Wqcys", titleEN: "Cinematic Trailers AI Video", descEN: "TikTok, YouTube, Facebook AI videos", titleMM: "Trailer AI Video", descMM: "TikTok, YouTube, Facebook AI videos", featured: true },
  { id: "architecture", src: "IrukbYGHhQs", titleEN: "Architecture AI Videos", descEN: "Advanced AI video production", titleMM: "Architecture AI Videos", descMM: "Advanced AI video production", featured: true },
  { id: "commercial", src: "T9p2lqcETCE", titleEN: "Cinematic Commercial", descEN: "High-end AI promotional video", titleMM: "Cinematic Commercial", descMM: "High-end AI promotional video", featured: true },
  { id: "presenter", src: "wJjyMQ3bjt4", titleEN: "Virtual Presenter Campaign", descEN: "Advanced AI virtual presenter production", titleMM: "AI Presenter Videos", descMM: "AI presenter video production", featured: true }
];

function safeText(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanSource(value: unknown) {
  return safeText(value, 160)
    .replace("https://youtu.be/", "")
    .replace("https://www.youtube.com/watch?v=", "")
    .replace("https://youtube.com/watch?v=", "")
    .split("&")[0]
    .split("?")[0]
    .trim();
}

function cleanItems(value: unknown): PortfolioItem[] {
  if (!Array.isArray(value)) return [];
  const items: PortfolioItem[] = [];

  value.forEach((item, index) => {
    const raw = item as Partial<PortfolioItem>;
    const src = cleanSource(raw.src);
    if (!src) return;

    items.push({
      id: safeText(raw.id, 80) || `${Date.now()}-${index}`,
      src,
      titleEN: safeText(raw.titleEN) || "AI Video Project",
      descEN: safeText(raw.descEN) || "Burma AI Studio portfolio video",
      titleMM: safeText(raw.titleMM) || "AI Video Project",
      descMM: safeText(raw.descMM) || "Burma AI Studio portfolio video",
      featured: Boolean(raw.featured),
    });
  });

  return items;
}

export async function GET() {
  try {
    const stored = await withRedis(async (client) => client.get(PORTFOLIO_KEY));
    if (!stored) return Response.json({ ok: true, items: defaultPortfolio });
    const parsed = JSON.parse(stored) as unknown;
    const items = cleanItems(parsed);
    return Response.json({ ok: true, items: items.length ? items : defaultPortfolio });
  } catch {
    return Response.json({ ok: true, items: defaultPortfolio });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { pin?: string; items?: unknown } | null;
    if (!isAdminPin(body?.pin)) return Response.json({ ok: false, message: "Invalid admin code." }, { status: 401 });

    const items = cleanItems(body?.items);
    if (!items.length) return Response.json({ ok: false, message: "Add at least one portfolio item." }, { status: 400 });

    await withRedis(async (client) => client.set(PORTFOLIO_KEY, JSON.stringify(items)));
    return Response.json({ ok: true, items });
  } catch (error) {
    console.error("Portfolio save error:", error);
    return Response.json({ ok: false, message: "Portfolio cannot be saved yet." }, { status: 503 });
  }
}
