"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ၁။ ဘာသာစကား အမျိုးအစားကို တိတိကျကျ သတ်မှတ်ပါမယ်
export type Language = "EN" | "MM";

type LanguageContextType = {
  lang: Language;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("EN");

  useEffect(() => {
    // ဖွင့်တာနဲ့ localStorage ထဲက မှတ်ထားတဲ့ ဘာသာစကားကို ဆွဲယူမယ်
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang === "EN" || savedLang === "MM") {
      setLang(savedLang);
    }
  }, []);

  const toggleLang = () => {
    setLang((prev) => {
      const newLang = prev === "EN" ? "MM" : "EN";
      localStorage.setItem("lang", newLang); // ရွေးချယ်မှုကို မှတ်ထားမယ်
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};