import type { Metadata } from "next";
import LegalDocument from "../legal/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service | Burma AI Studio",
  description: "Terms of service for Burma AI Studio website, mobile app and creative services.",
};

export default function TermsPage() {
  return <LegalDocument documentKey="terms" />;
}
