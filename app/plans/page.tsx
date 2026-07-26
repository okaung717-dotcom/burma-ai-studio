import type { Metadata } from "next";
import PlansPageClient from "./PlansPageClient";
import "./plans.css";

export const metadata: Metadata = {
  title: "Studio Plans | Burma AI Studio",
  description:
    "Choose the Burma AI Studio production plan that fits a one-off campaign, ongoing content needs, or a long-term brand partnership.",
};

export default function PlansPage() {
  return <PlansPageClient />;
}
