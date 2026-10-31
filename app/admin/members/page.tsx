import { notFound, redirect } from "next/navigation";
import { emailAuthEnabled, ownerOnlyBetaEnabled, getMemberSession } from "../../lib/member-auth";
import MemberManager from "./member-manager";

export const metadata = { title: "Member Control | Burma AI Studio", robots: { index: false, follow: false } };

export default async function MemberAdminPage() {
  if (!emailAuthEnabled()) notFound();
  const member = await getMemberSession();
  if (!member) redirect("/login");
  if (member.role !== "admin") notFound();
  return <MemberManager ownerEmail={member.email} ownerOnlyBeta={ownerOnlyBetaEnabled()}/>;
}
