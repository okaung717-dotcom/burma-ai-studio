"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Page အပြည့်အစုံ Load ပြီးမှသာ ဒီအလုပ်ကို လုပ်မယ်
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Page မပွင့်ခင်မှာ အဖြူရောင် flash မဖြစ်အောင် ခဏစောင့်ပေးမယ်
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);