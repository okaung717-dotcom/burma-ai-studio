"use client";

import { useEffect } from "react";

const TARGET_LOGO_SELECTOR = 'body:not(.bas-app-mode) > nav > div > a[href="/"]';
const ACTIVE_CLASS = "bas-logo-flight-active";
const ARRIVED_CLASS = "bas-logo-flight-arrived";
const REVEAL_CLASS = "bas-home-elements-reveal";

function removeDuplicateIds(root: HTMLElement) {
  root.removeAttribute("id");
  root.querySelectorAll<HTMLElement>("[id]").forEach((element) => element.removeAttribute("id"));
}

export default function WebsiteLogoFlightTransition() {
  useEffect(() => {
    const body = document.body;
    let activeCleanup: (() => void) | null = null;
    let launching = false;

    const clearTransitionArtifacts = () => {
      activeCleanup?.();
      activeCleanup = null;
      launching = false;
      body.classList.remove(ACTIVE_CLASS, ARRIVED_CLASS, REVEAL_CLASS);
      document.querySelectorAll("[data-bas-logo-flight-stage]").forEach((node) => node.remove());
    };

    const launch = () => {
      if (launching || activeCleanup || document.body.classList.contains("bas-app-mode")) return;
      launching = true;

      // Add the class before measuring so the replacement CSS neutralizes the old
      // Intro transition transforms and exposes the logo's true final geometry.
      body.classList.add(ACTIVE_CLASS);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const target = document.querySelector<HTMLElement>(TARGET_LOGO_SELECTOR);
          if (!target) {
            body.classList.add(ARRIVED_CLASS, REVEAL_CLASS);
            launching = false;
            return;
          }

          const targetRect = target.getBoundingClientRect();
          if (targetRect.width <= 0 || targetRect.height <= 0) {
            body.classList.add(ARRIVED_CLASS, REVEAL_CLASS);
            launching = false;
            return;
          }

          const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
          const stage = document.createElement("div");
          stage.className = "bas-logo-flight-stage";
          stage.dataset.basLogoFlightStage = "true";
          stage.setAttribute("aria-hidden", "true");

          const veil = document.createElement("span");
          veil.className = "bas-logo-flight-veil";

          const atmosphere = document.createElement("span");
          atmosphere.className = "bas-logo-flight-atmosphere";

          const traveler = document.createElement("div");
          traveler.className = "bas-logo-flight-traveler";

          const logoClone = target.cloneNode(true) as HTMLElement;
          removeDuplicateIds(logoClone);
          logoClone.removeAttribute("href");
          logoClone.removeAttribute("title");
          logoClone.removeAttribute("aria-label");
          logoClone.setAttribute("tabindex", "-1");
          logoClone.className = "bas-logo-flight-clone";
          logoClone.querySelectorAll("script").forEach((script) => script.remove());

          traveler.appendChild(logoClone);
          stage.append(veil, atmosphere, traveler);
          body.appendChild(stage);

          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const preferredWidth = viewportWidth < 760 ? viewportWidth * 0.68 : viewportWidth * 0.29;
          const startWidth = Math.min(Math.max(preferredWidth, 250), viewportWidth < 760 ? 340 : 470, viewportWidth - 40);
          const ratio = targetRect.height / targetRect.width;
          const startHeight = startWidth * ratio;
          const startLeft = (viewportWidth - startWidth) / 2;
          const startTop = viewportHeight * 0.48 - startHeight / 2;
          const deltaX = targetRect.left - startLeft;
          const deltaY = targetRect.top - startTop;
          const finalScale = targetRect.width / startWidth;

          traveler.style.left = `${startLeft}px`;
          traveler.style.top = `${startTop}px`;
          traveler.style.width = `${startWidth}px`;
          traveler.style.height = `${startHeight}px`;

          const timers: number[] = [];
          const animations: Animation[] = [];
          const later = (callback: () => void, delay: number) => {
            timers.push(window.setTimeout(callback, delay));
          };

          if (reducedMotion) {
            traveler.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${finalScale})`;
            logoClone.style.opacity = "1";
            body.classList.add(ARRIVED_CLASS, REVEAL_CLASS);
            later(clearTransitionArtifacts, 420);
          } else {
            animations.push(
              veil.animate(
                [
                  { opacity: 0, background: "rgba(9,4,5,.82)", offset: 0 },
                  { opacity: 1, background: "#fffaf4", offset: 0.18 },
                  { opacity: 1, background: "#fffaf4", offset: 0.68 },
                  { opacity: 0.22, background: "rgba(255,250,244,.76)", offset: 0.88 },
                  { opacity: 0, background: "rgba(255,250,244,0)", offset: 1 },
                ],
                { duration: 1660, easing: "cubic-bezier(.22,.82,.16,1)", fill: "forwards" }
              )
            );

            animations.push(
              atmosphere.animate(
                [
                  { opacity: 0, transform: "translate(-50%,-50%) scale(.42)", filter: "blur(28px)", offset: 0 },
                  { opacity: 0.86, transform: "translate(-50%,-50%) scale(.82)", filter: "blur(8px)", offset: 0.24 },
                  { opacity: 0.46, transform: "translate(-50%,-50%) scale(1.12)", filter: "blur(16px)", offset: 0.55 },
                  { opacity: 0, transform: "translate(-50%,-50%) scale(1.42)", filter: "blur(28px)", offset: 1 },
                ],
                { duration: 1450, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
              )
            );

            animations.push(
              traveler.animate(
                [
                  { transform: "translate3d(0,0,0) scale(1)", offset: 0 },
                  { transform: "translate3d(0,0,0) scale(1)", offset: 0.38 },
                  {
                    transform: `translate3d(${deltaX * 0.28}px, ${deltaY * 0.08 - 13}px, 0) scale(${1 - (1 - finalScale) * 0.22}) rotate(-0.7deg)`,
                    offset: 0.61,
                  },
                  {
                    transform: `translate3d(${deltaX * 0.76}px, ${deltaY * 0.62 - 7}px, 0) scale(${1 - (1 - finalScale) * 0.72}) rotate(0.3deg)`,
                    offset: 0.83,
                  },
                  { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${finalScale}) rotate(0deg)`, offset: 1 },
                ],
                { duration: 1390, easing: "cubic-bezier(.72,0,.18,1)", fill: "forwards" }
              )
            );

            animations.push(
              logoClone.animate(
                [
                  { opacity: 0, transform: "scale(.84)", filter: "blur(14px)", offset: 0 },
                  { opacity: 1, transform: "scale(1.025)", filter: "blur(0)", offset: 0.18 },
                  { opacity: 1, transform: "scale(1)", filter: "blur(0)", offset: 0.78 },
                  { opacity: 1, transform: "scale(1)", filter: "blur(0)", offset: 0.92 },
                  { opacity: 0, transform: "scale(1)", filter: "blur(0)", offset: 1 },
                ],
                { duration: 1510, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
              )
            );

            later(() => body.classList.add(ARRIVED_CLASS), 1320);
            later(() => body.classList.add(REVEAL_CLASS), 1390);
            later(() => stage.remove(), 1880);
            later(() => {
              body.classList.remove(ACTIVE_CLASS, ARRIVED_CLASS, REVEAL_CLASS);
              activeCleanup = null;
              launching = false;
            }, 2260);
          }

          activeCleanup = () => {
            timers.forEach((timer) => window.clearTimeout(timer));
            animations.forEach((animation) => animation.cancel());
            stage.remove();
          };
          launching = false;
        });
      });
    };

    const observer = new MutationObserver(() => {
      if (body.classList.contains("bas-intro-transitioning")) {
        launch();
      } else if (activeCleanup && !body.classList.contains(ACTIVE_CLASS)) {
        clearTransitionArtifacts();
      }
    });

    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
    if (body.classList.contains("bas-intro-transitioning")) launch();

    return () => {
      observer.disconnect();
      clearTransitionArtifacts();
    };
  }, []);

  return null;
}
