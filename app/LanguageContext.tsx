"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "EN" | "MM";

type LanguageContextType = {
  lang: Language;
  toggleLang: () => void;
};

// ဒီနေရာမှာ default value ကို "EN" လို့ ပေးထားလိုက်ရင် Error မတက်တော့ပါဘူး
const LanguageContext = createContext<LanguageContextType>({
  lang: "EN",
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("EN");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang === "EN" || savedLang === "MM") {
      setLang(savedLang);
    }
  }, []);

  const toggleLang = () => {
    setLang((prev) => {
      const newLang = prev === "EN" ? "MM" : "EN";
      localStorage.setItem("lang", newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);