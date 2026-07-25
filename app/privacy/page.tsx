import type { Metadata } from "next";
import LegalDocument from "../legal/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy | Burma AI Studio",
  description: "Privacy policy for the Burma AI Studio website, Android app and iOS app.",
};

export default function PrivacyPage() {
  return <LegalDocument documentKey="privacy" />;
}
