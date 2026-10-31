import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSpacesUser, spacesConfigured } from "../../lib/spaces-auth";
import SpacesDashboard from "./spaces-dashboard";
import "./spaces.css";

export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

export default async function SpacesPage() {
  const user = await getSpacesUser();
  if (!user) redirect("/login");
  return <SpacesDashboard user={user} accessConfigured={spacesConfigured()} />;
}
