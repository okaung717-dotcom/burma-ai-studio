import type { Metadata } from "next";
import LegalDocument from "../legal/LegalDocument";

export const metadata: Metadata = {
  title: "Copyright & Content Complaints | Burma AI Studio",
  description: "Rights-reporting process for content hosted or displayed by Burma AI Studio.",
};

export default function CopyrightPage() {
  return <LegalDocument documentKey="copyright" />;
}
