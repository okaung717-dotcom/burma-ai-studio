import type { Metadata } from "next";
import LegalDocument from "../legal/LegalDocument";

export const metadata: Metadata = {
  title: "Project & Payment Policy | Burma AI Studio",
  description: "Project scope, revisions, cancellation, refund, delivery and payment policy for Burma AI Studio.",
};

export default function ProjectPolicyPage() {
  return <LegalDocument documentKey="project" />;
}
