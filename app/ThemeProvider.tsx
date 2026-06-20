"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  // Page တိုင်းကို ရောက်တဲ့အချိန်မှာ localStorage ထဲက Theme ကို အမြဲပြန်ဖတ်မယ်
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Theme ကို အမြဲမှတ်ထားမယ်
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);