import "server-only";

import { cookies } from "next/headers";
import { ACCESS_COOKIE, authRequest } from "../api/account/_auth";
import { selectRows } from "./supabase";

export type MemberPrincipal = {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "member";
  status: "active";
};

type SupabaseIdentity = { id?: string; email?: string; email_confirmed_at?: string | null };
type Membership = { role: "admin" | "member" };
type Account = { status: string; email: string; expires_at: string | null };

export function emailAuthEnabled() {
  return process.env.BAS_EMAIL_AUTH_ENABLED === "true";
}

/** Always verify tokens with the Supabase Auth server; never trust a decoded JWT alone. */
export async function verifyEmailAuthToken(token: string): Promise<SupabaseIdentity | null> {
  if (!token || token.length > 8192) return null;
  const response = await authRequest("/user", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  const result = (await response.json()) as SupabaseIdentity;
  return result?.id && result?.email ? result : null;
}

/** Server-key lookup is only called AFTER Supabase Auth verifies the user's token. */
export async function getMemberForToken(token: string): Promise<MemberPrincipal | null> {
  if (!emailAuthEnabled()) return null;
  const identity = await verifyEmailAuthToken(token);
  if (!identity?.id || !identity?.email || !identity.email_confirmed_at) return null;

  const id = encodeURIComponent(identity.id);
  const [memberships, accounts] = await Promise.all([
    selectRows<Membership>("studio_memberships", `?select=role&user_id=eq.${id}&limit=1`),
    selectRows<Account>("studio_member_accounts", `?select=status,email,expires_at&user_id=eq.${id}&limit=1`),
  ]);
  const member = memberships[0];
  const account = accounts[0];
  if (!member || !account || !["admin", "member"].includes(member.role)) return null;
  if (account.status !== "active" || account.email.toLowerCase() !== identity.email.toLowerCase()) return null;
  if (account.expires_at && new Date(account.expires_at).getTime() <= Date.now()) return null;

  return {
    id: identity.id,
    email: identity.email,
    displayName: identity.email.split("@")[0],
    role: member.role,
    status: "active",
  };
}

export async function getMemberSession(): Promise<MemberPrincipal | null> {
  if (!emailAuthEnabled()) return null;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value || "";
  if (!token) return null;
  try {
    return await getMemberForToken(token);
  } catch (error) {
    console.error("Member session verification unavailable:", error);
    return null;
  }
}
