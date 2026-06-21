"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Mail, MessageCircle, Phone, Send, Sparkles, X } from "lucide-react";
import { useLanguage } from "./LanguageContext";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const contactLinks = {
  email: "mailto:okaung717@gmail.com",
  telegram: "tg://resolve?phone=959671010011",
  viber: "viber://chat?number=%2B959671010011",
  phone: "tel:09671010011",
};

const websiteFacts = {
  EN: {
    welcome: "Hi, I’m the Burma AI Studio assistant. Ask me in English or Burmese about services, pricing, delivery, portfolio, formats, revisions, or direct contact.",
    fallback: "AI response is not available right now. You can still ask about our AI video services, pricing, delivery, portfolio, and contact details. For a quote, please send your video type, duration, style, deadline, and reference.",
    typing: "AI is thinking...",
    contactTitle: "Direct contact",
  },
  MM: {
    welcome: "မင်္ဂလာပါ။ Burma AI Studio assistant ပါ။ Service, ဈေးနှုန်း, delivery, portfolio, video format, revision, direct contact အကြောင်း English သို့မဟုတ် မြန်မာလို မေးနိုင်ပါတယ်။",
    fallback: "AI response ယာယီမရသေးပါ။ AI video service, price, delivery, portfolio, contact အကြောင်းမေးနိုင်ပါတယ်။ Quote တိတိကျကျလိုချင်ရင် video type, duration, style, deadline, reference ကိုပို့ပေးပါ။",
    typing: "AI စဉ်းစားနေပါတယ်...",
    contactTitle: "တိုက်ရိုက်ဆက်သွယ်ရန်",
  },
};

const quick = {
  EN: ["How much in one video?", "What services do you offer?", "How can I contact you?"],
  MM: ["ဗီဒီယိုတစ်ပုဒ်ဈေးဘယ်လောက်လဲ", "ဘာဝန်ဆောင်မှုတွေလုပ်ပေးလဲ", "ဘယ်လိုဆက်သွယ်ရမလဲ"],
} as const;

export default function AIAssistant() {
  const { lang } = useLanguage();
  const activeLang = lang === "MM" ? "MM" : "EN";
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: websiteFacts[activeLang].welcome }]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen, isLoading]);

  const askGemini = async (nextMessages: ChatMessage[]) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: nextMessages }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return data?.reply || websiteFacts[activeLang].fallback;
    }

    return data?.reply || websiteFacts[activeLang].fallback;
  };

  const sendMessage = async (text: string) => {
    const clean = text.trim();
    if (!clean || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: clean };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await askGemini(nextMessages);
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: websiteFacts[activeLang].fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[10000] font-sans">
      {isOpen && (
        <div className="mb-4 flex h-[620px] max-h-[calc(100vh-7rem)] w-[calc(100vw-2.5rem)] max-w-[420px] flex-col overflow-hidden rounded-[2rem] border border-[#be9537]/30 bg-white shadow-[0_24px_80px_rgba(145,25,35,0.22)] dark:border-[#be9537]/20 dark:bg-[#100708]">
          <div className="flex shrink-0 items-center justify-between bg-[#911923] px-5 py-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff9f0] text-[#911923] shadow-inner ring-2 ring-[#be9537]/45 dark:bg-[#e3bc61] dark:text-[#100708]">
                <Bot className="h-6 w-6" strokeWidth={2.4} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold">Burma AI Assistant</p>
                <p className="truncate text-xs text-white/75">Powered by Gemini • English / မြန်မာ</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff9f0] text-[#911923] shadow-sm transition-transform hover:scale-105" aria-label="Close AI assistant">
              <X className="h-5 w-5" strokeWidth={2.6} />
            </button>
          </div>

          <div className="shrink-0 border-b border-[#be9537]/20 bg-[#fff9f0] px-5 py-3 dark:bg-[#1a0b0e]">
            <div className="flex flex-wrap gap-2">
              {quick[activeLang].map((prompt) => (
                <button key={prompt} disabled={isLoading} onClick={() => void sendMessage(prompt)} className="rounded-full border border-[#be9537]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#911923] transition-colors hover:bg-[#fff3e3] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#241113] dark:text-[#e3bc61] dark:hover:bg-[#331719]">
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto scroll-smooth bg-[#fffdf8] px-5 py-5 pb-8 dark:bg-[#100708]">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[86%] whitespace-pre-wrap break-words rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ${message.role === "user" ? "bg-[#911923] text-white" : "border border-[#be9537]/20 bg-white text-gray-700 dark:bg-[#1a0b0e] dark:text-[#fff7eb]"}`}>{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[86%] rounded-3xl border border-[#be9537]/20 bg-white px-4 py-3 text-sm leading-relaxed text-gray-500 shadow-sm dark:bg-[#1a0b0e] dark:text-[#d8c4a3]">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#911923] dark:text-[#e3bc61]" /> {websiteFacts[activeLang].typing}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          <div className="shrink-0 border-t border-[#be9537]/20 bg-white p-4 shadow-[0_-18px_40px_rgba(145,25,35,0.08)] dark:bg-[#1a0b0e]">
            <div className="mb-3">
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#911923] dark:text-[#e3bc61]">{websiteFacts[activeLang].contactTitle}</p>
              <div className="grid grid-cols-4 gap-2">
                <a href={contactLinks.email} className="flex items-center justify-center gap-1 rounded-xl border border-[#be9537]/25 bg-[#fff9f0] px-2 py-2 text-[11px] font-bold text-[#911923] hover:bg-[#fff3e3] dark:bg-[#100708] dark:text-[#e3bc61]">
                  <Mail className="h-3.5 w-3.5" /> Email
                </a>
                <a href={contactLinks.telegram} className="flex items-center justify-center gap-1 rounded-xl border border-[#be9537]/25 bg-[#fff9f0] px-2 py-2 text-[11px] font-bold text-[#911923] hover:bg-[#fff3e3] dark:bg-[#100708] dark:text-[#e3bc61]">
                  <Send className="h-3.5 w-3.5" /> Telegram
                </a>
                <a href={contactLinks.viber} className="flex items-center justify-center gap-1 rounded-xl border border-[#be9537]/25 bg-[#fff9f0] px-2 py-2 text-[11px] font-bold text-[#911923] hover:bg-[#fff3e3] dark:bg-[#100708] dark:text-[#e3bc61]">
                  <MessageCircle className="h-3.5 w-3.5" /> Viber
                </a>
                <a href={contactLinks.phone} className="flex items-center justify-center gap-1 rounded-xl border border-[#be9537]/25 bg-[#fff9f0] px-2 py-2 text-[11px] font-bold text-[#911923] hover:bg-[#fff3e3] dark:bg-[#100708] dark:text-[#e3bc61]">
                  <Phone className="h-3.5 w-3.5" /> Call
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input value={input} disabled={isLoading} onChange={(event) => setInput(event.target.value)} placeholder={activeLang === "MM" ? "မေးချင်တာရေးပါ..." : "Ask anything about the website..."} className="min-w-0 flex-1 rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-[#911923]/30 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#100708] dark:text-white" />
              <button type="submit" disabled={isLoading} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#911923] text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70" aria-label="Send message"><Send className="h-5 w-5" /></button>
            </form>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen((current) => !current)} className="group flex items-center gap-3 rounded-full bg-[#911923] px-5 py-4 font-extrabold text-white shadow-[0_18px_45px_rgba(145,25,35,0.35)] transition-transform hover:scale-105" aria-label="Open Burma AI assistant">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#fff9f0] text-[#911923] ring-2 ring-[#be9537]/35"><MessageCircle className="h-5 w-5" /><span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#911923] bg-[#be9537]" /></span>
        <span className="hidden sm:inline">Ask AI</span><Sparkles className="hidden h-4 w-4 text-[#f1d180] sm:block" />
      </button>
    </div>
  );
}
