"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type LanguageContextType = {
  lang: "EN" | "MM";
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<"EN" | "MM">("EN");
  const toggleLang = () => setLang((prev) => (prev === "EN" ? "MM" : "EN"));

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("Error");
  return context;
};