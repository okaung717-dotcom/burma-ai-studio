"use client";

import { useEffect } from "react";

const ACTIVE_CLASS = "bas-cinematic-entry-active";
const REVEAL_CLASS = "bas-cinematic-home-reveal";
const SETTLED_CLASS = "bas-cinematic-home-settled";

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
      document.querySelectorAll("[data-bas-cinematic-entry-stage]").forEach((node) => node.remove());
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
      document.querySelectorAll("[data-bas-cinematic-entry-stage]").forEach((node) => node.remove());
      body.classList.remove(
        "bas-logo-flight-active",
        "bas-logo-flight-arrived",
        "bas-home-elements-reveal"
      );
      body.classList.add(ACTIVE_CLASS);

      stage = document.createElement("div");
      stage.className = "bas-cinematic-entry-stage";
      stage.dataset.basCinematicEntryStage = "true";
      stage.setAttribute("aria-hidden", "true");
      stage.innerHTML = `
        <span class="bas-cinematic-entry-veil"></span>
        <span class="bas-cinematic-entry-bloom"></span>
        <span class="bas-cinematic-entry-sweep"></span>
        <span class="bas-cinematic-entry-line"></span>
        <span class="bas-cinematic-entry-frame"></span>
        <span class="bas-cinematic-entry-grain"></span>
      `;
      body.appendChild(stage);

      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

      window.requestAnimationFrame(() => {
        stage?.classList.add("is-running");
      });

      if (reducedMotion) {
        later(() => body.classList.add(REVEAL_CLASS, SETTLED_CLASS), 20);
        later(() => stage?.remove(), 220);
        later(clearTransition, 360);
        return;
      }

      later(() => body.classList.add(REVEAL_CLASS), 710);
      later(() => body.classList.add(SETTLED_CLASS), 1760);
      later(() => stage?.remove(), 2180);
      later(clearTransition, 2280);
    };

    const observer = new MutationObserver(() => {
      if (body.classList.contains("bas-intro-transitioning")) {
        launch();
      }
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
