import { redirect } from "next/navigation";
import { getSpacesUser } from "../../../lib/spaces-auth";
import SpaceWorkspace from "./workspace";
import "../spaces.css";
import "@xyflow/react/dist/style.css";

export default async function SpacePage({ params }: { params: Promise<{ spaceId: string }> }) {
  const user = await getSpacesUser();
  if (!user) redirect("/login");
  const { spaceId } = await params;
  return <SpaceWorkspace spaceId={spaceId} user={user} />;
}
