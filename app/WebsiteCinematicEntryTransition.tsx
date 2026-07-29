"use client";

import { useEffect } from "react";

const ACTIVE_CLASS = "bas-depth-portal-active";
const REVEAL_CLASS = "bas-depth-portal-reveal";
const SETTLED_CLASS = "bas-depth-portal-settled";

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
        return;
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
        return;
      }

      later(() => body.classList.add(REVEAL_CLASS), 590);
      later(() => body.classList.add(SETTLED_CLASS), 1570);
      later(() => stage?.remove(), 2080);
      later(clearTransition, 2240);
    };

    const observer = new MutationObserver(() => {
      if (body.classList.contains("bas-intro-transitioning")) launch();
    });

    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
    if (body.classList.contains("bas-intro-transitioning")) launch();

    return () => {
      observer.disconnect();
      clearTransition();
    };
  }, []);

  return null;
}
