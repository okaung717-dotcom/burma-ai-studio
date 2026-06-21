import { withRedis } from "./redis";

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

export async function basicLimit(request: Request, name: string, max = 12, windowSeconds = 60) {
  const key = `burma-ai-studio:limit:${name}:${getClientKey(request)}`;
  try {
    const count = await withRedis(async (client) => {
      const next = await client.incr(key);
      if (next === 1) await client.expire(key, windowSeconds);
      return next;
    });
    return count <= max;
  } catch {
    return true;
  }
}

export function tooLong(text: string, max = 5000) {
  return text.length > max;
}
