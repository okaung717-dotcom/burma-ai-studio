import "server-only";

import { getAdminSession } from "./local-auth";

export async function hasAdminSession() {
  try { return Boolean(await getAdminSession()); }
  catch (error) { console.error("Administrator session check failed:", error); return false; }
}

export async function requireAdminSession() {
  return (await hasAdminSession()) ? null : Response.json({ ok: false, message: "Administrator login required." }, { status: 401 });
}
