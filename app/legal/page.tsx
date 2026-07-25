import type { Metadata } from "next";
import LegalDocument from "./LegalDocument";

export const metadata: Metadata = {
  title: "Legal & Policies | Burma AI Studio",
  description: "Legal, privacy, payment, AI and intellectual-property policies for Burma AI Studio website and mobile apps.",
};

export default function LegalPage() {
  return <LegalDocument documentKey="legal" />;
}
