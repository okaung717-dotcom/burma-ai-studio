"use client";
import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext({ lang: "EN", toggleLang: () => {} });

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState("EN");

  useEffect(() => {
    // Page ဖွင့်တာနဲ့ localStorage ထဲက နောက်ဆုံးရွေးထားတဲ့ ဘာသာစကားကို ပြန်ဆွဲထုတ်မယ်
    const savedLang = localStorage.getItem("lang") || "EN";
    setLang(savedLang);
  }, []);

  const toggleLang = () => {
    const newLang = lang === "EN" ? "MM" : "EN";
    setLang(newLang);
    localStorage.setItem("lang", newLang); // ရွေးလိုက်တဲ့ ဘာသာစကားကို သိမ်းထားမယ်
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);