"use client";

import { useEffect } from "react";

const PROFILE_STORAGE_KEY = "bas_website_profile";

export default function WebsiteLogoutRedirect() {
  useEffect(() => {
    let signingOut = false;

    const onClick = async (event: MouseEvent) => {
      if (signingOut) return;

      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest<HTMLButtonElement>("#bas-profile-menu button");
      if (!button) return;

      const label = (button.textContent || "").trim().toLowerCase();
      if (!label.startsWith("log out")) return;

      signingOut = true;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      button.disabled = true;
      button.setAttribute("aria-busy", "true");

      try {
        await fetch("/api/account/sign-out", {
          method: "POST",
          cache: "no-store",
          credentials: "same-origin",
          keepalive: true,
        });
      } catch {
        // The local browser state is still cleared below; the server gate
        // re-checks the secure session on the Intro route.
      }

      try {
        window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      } catch {
        // Private browsing/storage restrictions must not block logout.
      }

      document.documentElement.classList.remove("bas-intro-skip");
      document.body.classList.remove("bas-intro-open");

      // Full navigation is intentional: it forces the server to read the now-cleared
      // auth cookies before first paint, so logout lands directly on the Intro page.
      window.location.replace("/");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
