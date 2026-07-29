"use client";

import { useEffect } from "react";
import { useLanguage } from "../LanguageContext";

export default function ChatMyanmarTypographyBridge() {
  const { lang } = useLanguage();

  useEffect(() => {
    const enabled = lang === "MM";
    document.body.classList.toggle("bas-chat-mm", enabled);

    return () => {
      document.body.classList.remove("bas-chat-mm");
    };
  }, [lang]);

  return null;
}
