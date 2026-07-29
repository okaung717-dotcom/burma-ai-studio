"use client";

import { useEffect } from "react";

const ACTIVE_CLASS = "bas-depth-portal-active";
const REVEAL_CLASS = "bas-depth-portal-reveal";
const SETTLED_CLASS = "bas-depth-portal-settled";
const INTRO_TRIGGER_CLASS = "bas-intro-transitioning";
const CYCLE_LOCK_ATTRIBUTE = "data-bas-depth-portal-cycle";

export default function WebsiteCinematicEntryTransition() {
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    let running = false;
    let stage: HTMLDivElement | null = null;
    let timers: number[] = [];

    const clearTimers = () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers = [];
    };

    const clearTransition = () => {
      clearTimers();
      stage?.remove();
      stage = null;
      running = false;
      body.classList.remove(ACTIVE_CLASS, REVEAL_CLASS, SETTLED_CLASS, "bas-home-arriving");
      document.querySelectorAll("[data-bas-depth-portal-stage]").forEach((node) => node.remove());
    };

    const later = (callback: () => void, delay: number) => {
      timers.push(window.setTimeout(callback, delay));
    };

    const launch = () => {
      if (
        running ||
        body.classList.contains("bas-app-mode") ||
        !html.classList.contains("bas-website-context")
      ) {
        return false;
      }

      running = true;
      document.querySelectorAll("[data-bas-depth-portal-stage]").forEach((node) => node.remove());

      body.classList.remove(
        "bas-logo-flight-active",
        "bas-logo-flight-arrived",
        "bas-home-elements-reveal",
        "bas-cinematic-entry-active",
        "bas-cinematic-home-reveal",
        "bas-cinematic-home-settled",
        "bas-home-arriving"
      );
      body.classList.add(ACTIVE_CLASS);

      stage = document.createElement("div");
      stage.className = "bas-depth-portal-stage";
      stage.dataset.basDepthPortalStage = "true";
      stage.setAttribute("aria-hidden", "true");
      stage.innerHTML = `
        <span class="bas-depth-portal-field"></span>
        <span class="bas-depth-portal-rays"></span>
        <span class="bas-depth-portal-aperture"></span>
        <span class="bas-depth-portal-ring is-outer"></span>
        <span class="bas-depth-portal-ring is-inner"></span>
        <span class="bas-depth-portal-core"></span>
        <span class="bas-depth-portal-vignette"></span>
        <span class="bas-depth-portal-grain"></span>
      `;
      body.appendChild(stage);

      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => stage?.classList.add("is-running"));
      });

      if (reducedMotion) {
        later(() => {
          body.classList.remove(INTRO_TRIGGER_CLASS, "bas-home-arriving");
          body.classList.add(REVEAL_CLASS, SETTLED_CLASS);
        }, 20);
        later(() => stage?.remove(), 180);
        later(clearTransition, 280);
        return true;
      }

      // Reveal Home while the dark portal field is still covering the frame.
      // Removing the retired trigger class here prevents the old hidden-page state
      // from surviving after the portal disappears and producing a white screen.
      later(() => {
        body.classList.remove(INTRO_TRIGGER_CLASS, "bas-home-arriving");
        body.classList.add(REVEAL_CLASS);
      }, 320);

      later(() => body.classList.add(SETTLED_CLASS), 980);
      later(() => stage?.remove(), 1240);
      later(clearTransition, 1380);
      return true;
    };

    const syncTrigger = () => {
      const triggerActive = body.classList.contains(INTRO_TRIGGER_CLASS);

      if (!triggerActive) {
        body.removeAttribute(CYCLE_LOCK_ATTRIBUTE);
        return;
      }

      if (body.hasAttribute(CYCLE_LOCK_ATTRIBUTE)) return;
      if (
        body.classList.contains("bas-app-mode") ||
        !html.classList.contains("bas-website-context")
      ) {
        return;
      }

      body.setAttribute(CYCLE_LOCK_ATTRIBUTE, "consumed");
      if (!launch()) {
        body.removeAttribute(CYCLE_LOCK_ATTRIBUTE);
      }
    };

    const observer = new MutationObserver(syncTrigger);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
    syncTrigger();

    return () => {
      observer.disconnect();
      clearTransition();
      if (!body.classList.contains(INTRO_TRIGGER_CLASS)) {
        body.removeAttribute(CYCLE_LOCK_ATTRIBUTE);
      }
    };
  }, []);

  return null;
}
