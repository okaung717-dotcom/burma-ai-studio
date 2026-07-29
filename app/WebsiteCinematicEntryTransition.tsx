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
      body.classList.remove(ACTIVE_CLASS, REVEAL_CLASS, SETTLED_CLASS);
      document.querySelectorAll("[data-bas-depth-portal-stage]").forEach((node) => node.remove());

      // Do not clear the cycle lock here. IntroGate removes its trigger slightly
      // after the visual transition finishes. Keeping the lock until that falling
      // edge prevents our own cleanup class mutations from starting a second run.
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

      // Remove state from every retired transition so only the current choreography can own the handoff.
      body.classList.remove(
        "bas-logo-flight-active",
        "bas-logo-flight-arrived",
        "bas-home-elements-reveal",
        "bas-cinematic-entry-active",
        "bas-cinematic-home-reveal",
        "bas-cinematic-home-settled"
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
        later(() => body.classList.add(REVEAL_CLASS, SETTLED_CLASS), 20);
        later(() => stage?.remove(), 220);
        later(clearTransition, 360);
        return true;
      }

      later(() => body.classList.add(REVEAL_CLASS), 590);
      later(() => body.classList.add(SETTLED_CLASS), 1570);
      later(() => stage?.remove(), 2080);
      later(clearTransition, 2240);
      return true;
    };

    const syncTrigger = () => {
      const triggerActive = body.classList.contains(INTRO_TRIGGER_CLASS);

      if (!triggerActive) {
        // Falling edge: arm the controller for the next genuine authentication entry.
        body.removeAttribute(CYCLE_LOCK_ATTRIBUTE);
        return;
      }

      // One persistent lock per IntroGate trigger cycle. It survives the animation's
      // own cleanup mutations and React effect remounts, but is reset once the source
      // trigger class is actually removed.
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
      // Intentionally preserve the cycle lock while IntroGate's trigger remains
      // active, so a development/StrictMode remount cannot replay the transition.
      if (!body.classList.contains(INTRO_TRIGGER_CLASS)) {
        body.removeAttribute(CYCLE_LOCK_ATTRIBUTE);
      }
    };
  }, []);

  return null;
}
