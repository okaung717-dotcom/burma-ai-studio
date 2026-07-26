import type { Metadata } from "next";
import StoriesPageClient from "./StoriesPageClient";
import "./stories.css";

export const metadata: Metadata = {
  title: "Stories | Burma AI Studio Originals",
  description: "Watch Burma AI Studio original films, series and episodic stories in one public cinematic library.",
};

export default function StoriesPage() {
  return <StoriesPageClient />;
}
