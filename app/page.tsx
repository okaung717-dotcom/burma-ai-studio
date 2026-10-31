import { redirect } from "next/navigation";
import { getSpacesUser } from "./lib/spaces-auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getSpacesUser();
  redirect(user ? "/studio/spaces" : "/showcase");
}
