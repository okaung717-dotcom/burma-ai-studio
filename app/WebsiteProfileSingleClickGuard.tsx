"use client";

import { useEffect } from "react";

const PROFILE_CONTROL_SELECTOR = [
  'body:not(.bas-app-mode) > nav a.bas-navbar-profile',
  'body:not(.bas-app-mode) > nav a[href="#profile"]',
  'body:not(.bas-app-mode) > nav a[href="/contact"].hidden.md\\:inline-flex',
].join(", ");

/**
 * Guarantees that the desktop website profile control responds to the first
 * physical click. The navbar control begins life as a Next.js Link and is
 * upgraded into the profile trigger after hydration. Capturing the trusted
 * click prevents Link navigation/event-order races, then replays one guarded
 * click only after the profile listener reports that it is ready.
 */
export default function WebsiteProfileSingleClickGuard() {
  useEffect(() => {
    let replaying = false;
    let retryTimer: number | null = null;

    const replayWhenReady = (link: HTMLAnchorElement, attempt = 0) => {
      if (!document.documentElement.contains(link)) return;

      if (link.dataset.profileReady === "1") {
        replaying = true;
        link.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0,
          })
        );
        replaying = false;
        return;
      }

      if (attempt >= 12) return;
      retryTimer = window.setTimeout(() => replayWhenReady(link, attempt + 1), 40);
    };

    const onClickCapture = (event: MouseEvent) => {
      if (replaying || !event.isTrusted || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (window.innerWidth < 1024 || document.body.classList.contains("bas-app-mode")) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>(PROFILE_CONTROL_SELECTOR);
      if (!link) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (retryTimer !== null) window.clearTimeout(retryTimer);
      replayWhenReady(link);
    };

    document.addEventListener("click", onClickCapture, true);

    return () => {
      document.removeEventListener("click", onClickCapture, true);
      if (retryTimer !== null) window.clearTimeout(retryTimer);
    };
  }, []);

  return null;
}
