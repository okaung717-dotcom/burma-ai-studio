"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  // အရေးကြီးဆုံး: Page တိုင်းကို ရောက်တိုင်း ဒီအလုပ်ကို အရင်လုပ်ခိုင်းမယ်
  useEffect(() => {
    // ၁။ Browser ထဲမှာ သိမ်းထားတဲ့ 'theme' ကို အရင်ရှာမယ်
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    
    // ၂။ HTML တက်ဂ်မှာ class ပြန်ထည့်မယ်
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []); // [] ဆိုတော့ Page တိုင်းစဖွင့်တိုင်း တစ်ခါပဲ အလုပ်လုပ်မယ်

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Theme ကို အမြဲသိမ်းထားမယ်
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);