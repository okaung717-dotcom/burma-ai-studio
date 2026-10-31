import { redirect } from "next/navigation";

// Legacy Studio listing no longer appears as a separate website experience.
// The owner-only project records are preserved under /account/legacy-workspaces.
export default function SpacesPage() {
  redirect("/");
}
