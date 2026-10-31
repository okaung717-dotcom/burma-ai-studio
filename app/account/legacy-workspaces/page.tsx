import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSpacesUser, spacesConfigured } from "../../lib/spaces-auth";
import SpacesDashboard from "../../studio/spaces/spaces-dashboard";
import "../../studio/spaces/spaces.css";

// Data-safe legacy access for the account owner. Not used as a public homepage.
export const metadata: Metadata = { title: "Private Workspace Archive", robots: { index: false, follow: false } };

export default async function PrivateWorkspaceArchive() {
  const user = await getSpacesUser();
  if (!user) redirect("/login");
  return <SpacesDashboard user={user} accessConfigured={spacesConfigured()} />;
}
