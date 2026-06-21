import { createClient } from "redis";

export const LEADS_KEY = "burma-ai-studio:leads";
export const PORTFOLIO_KEY = "burma-ai-studio:portfolio";
export const CHAT_LOG_KEY = "burma-ai-studio:chat-logs";

export async function withRedis<T>(callback: (client: ReturnType<typeof createClient>) => Promise<T>) {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not configured.");

  const client = createClient({ url });
  client.on("error", (error) => console.error("Redis client error:", error));

  await client.connect();
  try {
    return await callback(client);
  } finally {
    await client.quit();
  }
}

export function isAdminPin(pin: unknown) {
  return typeof pin === "string" && Boolean(process.env.ADMIN_PIN) && pin === process.env.ADMIN_PIN;
}
