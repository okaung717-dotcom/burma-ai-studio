"use client";

import { useState, type FormEvent } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useLanguage } from "./LanguageContext";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const websiteFacts = {
  EN: {
    welcome: "Hi, I’m the Burma AI Studio assistant. Ask me in English or Burmese about our services, pricing, delivery, portfolio, contact, privacy, or terms.",
    fallback: "I can help with Burma AI Studio services, pricing, delivery, portfolio, contact, project process, revisions, privacy, and terms. For an exact quote, please share your video type, duration, style, deadline, and reference.",
  },
  MM: {
    welcome: "မင်္ဂလာပါ။ Burma AI Studio assistant ပါ။ Website, service, price, delivery, portfolio, contact, privacy/terms အကြောင်း English သို့မဟုတ် မြန်မာလို မေးနိုင်ပါတယ်။",
    fallback: "Burma AI Studio ရဲ့ service, price, delivery, portfolio, contact, project process, revision, privacy/terms အကြောင်းမေးနိုင်ပါတယ်။ Quote တိတိကျကျလိုချင်ရင် video type, duration, style, deadline, reference ကိုပို့ပေးပါ။",
  },
};

const answers = [
  {
    keys: ["service", "services", "ဝန်ဆောင်", "ဘာလုပ်", "ဘာတွေ", "လုပ်ပေး"],
    en: "Burma AI Studio creates AI promotional videos, cinematic brand commercials, AI presenter videos, TikTok/Reels/Shorts content, architecture/product animation concepts, script support, prompt direction, and creative editing.",
    mm: "Burma AI Studio က AI promotional video, cinematic brand commercial, AI presenter video, TikTok/Reels/Shorts content, architecture/product animation concept, script support, prompt direction နဲ့ creative editing တွေဖန်တီးပေးပါတယ်။",
  },
  {
    keys: ["price", "pricing", "cost", "ဈေး", "စျေး", "ဘယ်လောက်", "ကုန်ကျ", "package"],
    en: "Pricing depends on video length, number of scenes, style complexity, voice/dialogue, revisions, and delivery speed. For an accurate quote, send your idea, script/reference, duration, language, deadline, and platform format.",
    mm: "ဈေးနှုန်းက video ကြာချိန်၊ scene အရေအတွက်၊ style complexity၊ voice/dialogue၊ revision နဲ့ delivery speed ပေါ်မူတည်ပါတယ်။ Quote တိကျချင်ရင် idea/script/reference, duration, language, deadline, platform format ကိုပို့ပေးပါ။",
  },
  {
    keys: ["delivery", "fast", "time", "ဘယ်လောက်ကြာ", "အချိန်", "ကြာချိန်", "မြန်"],
    en: "Many suitable projects can be delivered quickly, and the website highlights fast delivery around 48 hours. Complex cinematic videos, multiple scenes, or heavy revisions may take longer.",
    mm: "Suitable project များကိုမြန်မြန်ပေးနိုင်ပြီး website မှာ 48hr fast delivery ကိုပြထားပါတယ်။ Cinematic scene များတာ၊ complexity မြင့်တာ၊ revision များတာဆိုရင် အချိန်ပိုလိုနိုင်ပါတယ်။",
  },
  {
    keys: ["process", "order", "start", "step", "မှာယူ", "ဘယ်လိုစ", "လုပ်ငန်းစဉ်"],
    en: "Process: 1) send your idea/business goal, 2) share references and brand details, 3) we suggest a creative direction and quote, 4) production starts after confirmation, 5) you review, 6) final video is delivered.",
    mm: "လုပ်ငန်းစဉ် — ၁) idea/business goal ပို့ပါ၊ ၂) reference နဲ့ brand details ပို့ပါ၊ ၃) creative direction နဲ့ quote ပြန်ပေးပါမယ်၊ ၄) confirm ပြီးရင် production စပါမယ်၊ ၅) preview ကြည့်ပြီး revision ပြောနိုင်ပါတယ်၊ ၆) final video ပေးပို့ပါမယ်။",
  },
  {
    keys: ["portfolio", "example", "sample", "နမူနာ", "လက်ရာ", "ပြခန်း"],
    en: "You can view examples on the Portfolio page. Current samples include cinematic trailers, architecture AI videos, cinematic commercial videos, and virtual presenter campaigns.",
    mm: "Portfolio page မှာနမူနာလက်ရာတွေကြည့်နိုင်ပါတယ်။ Cinematic trailers, architecture AI videos, cinematic commercial videos, virtual presenter campaigns တွေပါဝင်ပါတယ်။",
  },
  {
    keys: ["contact", "email", "phone", "telegram", "viber", "ဆက်သွယ်", "ဖုန်း", "အီးမေး", "တယ်လီ", "ဗိုက်ဘာ"],
    en: "Contact Burma AI Studio by Email: okaung717@gmail.com, Phone: 09671010011, Telegram/Viber: +95 9 671 010 011, or Facebook: Burma Ai Studio. The fastest path is the Contact page.",
    mm: "Burma AI Studio ကို Email: okaung717@gmail.com, Phone: 09671010011, Telegram/Viber: +95 9 671 010 011, Facebook: Burma Ai Studio ကနေဆက်သွယ်နိုင်ပါတယ်။ အလွယ်ဆုံးက Contact page ကိုသွားပါ။",
  },
  {
    keys: ["presenter", "avatar", "talking", "စကားပြော", "လူ", "model", "virtual"],
    en: "Yes, we can create AI presenter-style videos where a virtual person speaks to camera with natural body language. Provide your script, tone, language, preferred style, and background idea.",
    mm: "ရပါတယ်။ ကင်မရာကိုကြည့်ပြီး natural body language နဲ့စကားပြောတဲ့ AI presenter-style video တွေဖန်တီးပေးနိုင်ပါတယ်။ Script, tone, language, preferred style, background idea ပေးပို့ပါ။",
  },
  {
    keys: ["revision", "edit", "change", "ပြင်", "ပြင်ဆင်", "ပြောင်း"],
    en: "Revisions depend on the agreed package or quote. Normal revisions include editing, pacing, text, scene selection, and presentation style adjustments. Full concept changes may count as new work.",
    mm: "Revision က package သို့မဟုတ် quotation ပေါ်မူတည်ပါတယ်။ ပုံမှန် revision ထဲမှာ editing, pacing, text, scene selection, presentation style adjustment တွေပါနိုင်ပါတယ်။ Concept လုံးဝပြောင်းတာဆိုရင် new work ဖြစ်နိုင်ပါတယ်။",
  },
  {
    keys: ["privacy", "terms", "policy", "rights", "ownership", "မူပိုင်", "စည်းမျဉ်း", "ပိုင်ဆိုင်"],
    en: "Privacy Policy and Terms of Service are available in the website footer. After full payment, final approved deliverables can be used for business, advertising, and social media purposes, subject to platform and project-specific rules.",
    mm: "Privacy Policy နဲ့ Terms of Service ကို website footer မှာဖတ်နိုင်ပါတယ်။ Full payment ပြီးရင် final approved deliverables တွေကို business, advertising, social media purpose တွေအတွက်အသုံးပြုနိုင်ပါတယ်။",
  },
];

const quick = {
  EN: ["What services do you offer?", "How much does a video cost?", "How can I contact you?"],
  MM: ["ဘာဝန်ဆောင်မှုတွေလုပ်ပေးလဲ", "ဗီဒီယိုဈေးဘယ်လောက်လဲ", "ဘယ်လိုဆက်သွယ်ရမလဲ"],
} as const;

function hasMyanmar(text: string) {
  return /[\u1000-\u109F]/.test(text);
}

function replyTo(text: string, preferMM: boolean) {
  const query = text.toLowerCase();
  const match = answers.find((item) => item.keys.some((key) => query.includes(key.toLowerCase())));
  return match ? (preferMM ? match.mm : match.en) : preferMM ? websiteFacts.MM.fallback : websiteFacts.EN.fallback;
}

export default function AIAssistant() {
  const { lang } = useLanguage();
  const activeLang = lang === "MM" ? "MM" : "EN";
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: websiteFacts[activeLang].welcome }]);

  const sendMessage = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const preferMM = hasMyanmar(clean) || activeLang === "MM";
    setMessages((current) => [...current, { role: "user", content: clean }, { role: "assistant", content: replyTo(clean, preferMM) }]);
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[10000] font-sans">
      {isOpen && (
        <div className="mb-4 flex h-[600px] max-h-[calc(100vh-7rem)] w-[calc(100vw-2.5rem)] max-w-[420px] flex-col overflow-hidden rounded-[2rem] border border-[#be9537]/30 bg-white shadow-[0_24px_80px_rgba(145,25,35,0.22)] dark:border-[#be9537]/20 dark:bg-[#100708]">
          <div className="flex items-center justify-between bg-[#911923] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/12"><Bot className="h-6 w-6" /></div>
              <div><p className="text-base font-extrabold">Burma AI Assistant</p><p className="text-xs text-white/75">English / မြန်မာ • Instant answers</p></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Close AI assistant"><X className="h-5 w-5" /></button>
          </div>

          <div className="border-b border-[#be9537]/20 bg-[#fff9f0] px-5 py-3 dark:bg-[#1a0b0e]">
            <div className="flex flex-wrap gap-2">
              {quick[activeLang].map((prompt) => (
                <button key={prompt} onClick={() => sendMessage(prompt)} className="rounded-full border border-[#be9537]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#911923] hover:bg-[#fff3e3] dark:bg-[#241113] dark:text-[#e3bc61]">
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#fffdf8] px-5 py-5 dark:bg-[#100708]">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "bg-[#911923] text-white" : "border border-[#be9537]/20 bg-white text-gray-700 dark:bg-[#1a0b0e] dark:text-[#fff7eb]"}`}>{message.content}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#be9537]/20 bg-white p-4 dark:bg-[#1a0b0e]">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={activeLang === "MM" ? "မေးချင်တာရေးပါ..." : "Ask anything about the website..."} className="min-w-0 flex-1 rounded-2xl border border-[#be9537]/30 bg-[#fff9f0] px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#911923]/30 dark:bg-[#100708] dark:text-white" />
              <button type="submit" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#911923] text-white hover:scale-105" aria-label="Send message"><Send className="h-5 w-5" /></button>
            </form>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen((current) => !current)} className="group flex items-center gap-3 rounded-full bg-[#911923] px-5 py-4 font-extrabold text-white shadow-[0_18px_45px_rgba(145,25,35,0.35)] hover:scale-105" aria-label="Open Burma AI assistant">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/12"><MessageCircle className="h-5 w-5" /><span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#911923] bg-[#be9537]" /></span>
        <span className="hidden sm:inline">Ask AI</span><Sparkles className="hidden h-4 w-4 text-[#f1d180] sm:block" />
      </button>
    </div>
  );
}
