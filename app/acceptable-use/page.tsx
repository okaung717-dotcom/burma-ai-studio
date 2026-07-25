import type { Metadata } from "next";
import LegalDocument from "../legal/LegalDocument";

export const metadata: Metadata = {
  title: "Acceptable Use Policy | Burma AI Studio",
  description: "Acceptable-use and regulated-project policy for Burma AI Studio creative services.",
};

export default function AcceptableUsePage() {
  return <LegalDocument documentKey="acceptable-use" />;
}
