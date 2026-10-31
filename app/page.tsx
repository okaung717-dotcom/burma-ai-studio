import Showcase, { metadata as showcaseMetadata } from "./showcase/page";

export const metadata = showcaseMetadata;

// The canonical public website must always show the public Studio experience,
// including for visitors with an existing private Studio session.
export default function Home({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  return <Showcase searchParams={searchParams} />;
}
