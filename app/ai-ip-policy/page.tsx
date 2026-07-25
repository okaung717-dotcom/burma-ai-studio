import type { Metadata } from "next";
import LegalDocument from "../legal/LegalDocument";

export const metadata: Metadata = {
  title: "AI & Intellectual Property Policy | Burma AI Studio",
  description: "AI generation, client assets, likeness permission and intellectual-property policy for Burma AI Studio.",
};

export default function AIIPPolicyPage() {
  return <LegalDocument documentKey="ai-ip" />;
}
