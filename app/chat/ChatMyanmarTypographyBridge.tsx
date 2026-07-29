"use client";

import { useEffect } from "react";
import { useLanguage } from "../LanguageContext";

export default function ChatMyanmarTypographyBridge() {
  const { lang } = useLanguage();

  useEffect(() => {
    const enabled = lang === "MM";
    const page = document.querySelector<HTMLElement>(".bas-chat-page");

    document.body.classList.toggle("bas-chat-mm", enabled);
    page?.classList.toggle("is-mm", enabled);
    page?.setAttribute("lang", enabled ? "my" : "en");

    return () => {
      document.body.classList.remove("bas-chat-mm");
      page?.classList.remove("is-mm");
      page?.removeAttribute("lang");
    };
  }, [lang]);

  return null;
}
