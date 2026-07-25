"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AnalyticsTracker from "./AnalyticsTracker";
import { PRIVACY_CONSENT_KEY, type PrivacyConsentValue } from "./PrivacyConsent";

export default function ConsentAwareAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setAllowed(localStorage.getItem(PRIVACY_CONSENT_KEY) === "analytics");
      } catch {
        setAllowed(false);
      }
    };

    const onChange = (event: Event) => {
      const custom = event as CustomEvent<PrivacyConsentValue>;
      setAllowed(custom.detail === "analytics");
    };

    read();
    window.addEventListener("bas-privacy-consent-change", onChange as EventListener);
    window.addEventListener("storage", read);

    return () => {
      window.removeEventListener("bas-privacy-consent-change", onChange as EventListener);
      window.removeEventListener("storage", read);
    };
  }, []);

  if (!allowed) return null;

  return (
    <>
      <AnalyticsTracker />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
