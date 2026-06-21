import { withRedis } from "./redis";

const ACTIVITY_KEY = "burma-ai-studio:activity-logs";

export async function saveActivity(action: string, details: Record<string, unknown> = {}) {
  try {
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      action,
      details,
      createdAt: new Date().toISOString(),
    };
    await withRedis(async (client) => {
      await client.lPush(ACTIVITY_KEY, JSON.stringify(item));
      await client.lTrim(ACTIVITY_KEY, 0, 299);
    });
  } catch {
    // non-blocking activity record
  }
}

export { ACTIVITY_KEY };
