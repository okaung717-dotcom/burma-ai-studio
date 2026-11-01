import { redirect } from "next/navigation";
import { getSpacesUser } from "./lib/spaces-auth";
import Showcase, { metadata as showcaseMetadata } from "./showcase/page";

export const metadata = showcaseMetadata;
export const dynamic = "force-dynamic";

// Always authenticate at the canonical domain, independent of the visitor's
// location, VPN, or whether the public Studio URL was bookmarked.
export default async function Home({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  if (!await getSpacesUser()) redirect("/login");
  return <Showcase searchParams={searchParams} />;
}
