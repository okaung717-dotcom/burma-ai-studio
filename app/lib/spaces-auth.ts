import "server-only";

import { headers } from "next/headers";
import { ADMIN_USERNAME, getAdminSession } from "./local-auth";

export type SpacesUser = { id: string; email: string; displayName: string; role: "admin" | "member" };

export async function getSpacesUser(): Promise<SpacesUser | null> {
  const testSecret = process.env.BAS_SPACES_TEST_TOKEN || "";
  const testHeader = (await headers()).get("x-bas-spaces-test") || "";
  if (process.env.NODE_ENV !== "production" && testSecret.length >= 24 && testHeader === testSecret) {
    return { id: "00000000-0000-4000-8000-000000000001", email: "spaces-test@local.invalid", displayName: "Spaces Test", role: "admin" };
  }

  let session;
  try { session = await getAdminSession(); }
  catch (error) { console.error("Shared administrator session validation failed:", error); return null; }
  if (!session) return null;
  return {
    id: session.uid,
    email: "",
    displayName: ADMIN_USERNAME,
    role: "admin",
  };
}

export function spacesConfigured() {
  const principalConfigured = process.env.NODE_ENV !== "production" || Boolean(process.env.BAS_ADMIN_USER_ID);
  return Boolean(process.env.BAS_ADMIN_PASSWORD_HASH && process.env.BAS_SESSION_SECRET && principalConfigured);
}
