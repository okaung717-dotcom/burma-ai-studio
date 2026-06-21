"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, Phone, Globe, Send, MessageCircle } from "lucide-react";
import { useLanguage } from "../LanguageContext";

const translations = {
  EN: {
    title1: "Let's ",
    titleHighlight: "Create",
    title2: "Something Amazing",
    subtitle: "Ready to elevate your brand with next-gen AI video production? Reach out directly via Email, Telegram, Viber, Facebook, or send a quick project message below.",
    contactTitle: "Direct Contact Channels",
    contactSubtitle: "Choose the easiest way to talk with Burma AI Studio.",
    emailLabel: "Email Us",
    phoneLabel: "Call Us",
    telegramLabel: "Telegram",
    viberLabel: "Viber",
    facebookLabel: "Facebook",
    formTitle: "Tell us about your project",
    formSubtitle: "Your message will open as a prepared email so you can review it before sending.",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    projectDetails: "Project Details",
    firstNamePlaceholder: "John",
    lastNamePlaceholder: "Doe",
    emailPlaceholder: "john@company.com",
    projectPlaceholder: "Tell us about your video needs, duration, style, deadline, and brand details...",
    sendButton: "Prepare Email Message",
    telegramButton: "Message on Telegram",
    viberButton: "Chat on Viber",
    emailButton: "Send Email"
  },
  MM: {
    title1: "အကောင်းဆုံး ",
    titleHighlight: "လက်ရာများကို",
    title2: "ဖန်တီးကြစို့",
    subtitle: "ခေတ်မီ AI ဗီဒီယို ဖန်တီးမှုများဖြင့် သင့်လုပ်ငန်းကို မြှင့်တင်ဖို့ အဆင်သင့်ပဲလား? Email, Telegram, Viber, Facebook ကနေ တိုက်ရိုက်ဆက်သွယ်နိုင်သလို အောက်က form ထဲမှာလည်း project အကြောင်းရေးပြီးပို့နိုင်ပါတယ်။",
    contactTitle: "တိုက်ရိုက်ဆက်သွယ်ရန် လမ်းကြောင်းများ",
    contactSubtitle: "Burma AI Studio နဲ့ ဆက်သွယ်ဖို့ အလွယ်ဆုံးနည်းကို ရွေးပါ။",
    emailLabel: "အီးမေးလ် ပို့ရန်",
    phoneLabel: "ဖုန်းခေါ်ဆိုရန်",
    telegramLabel: "Telegram",
    viberLabel: "Viber",
    facebookLabel: "Facebook",
    formTitle: "သင့်ပရောဂျက်အကြောင်း ပြောပြပါ",
    formSubtitle: "Form ဖြည့်ပြီးနှိပ်လိုက်ရင် email draft အဖြစ်ဖွင့်ပေးမှာဖြစ်လို့ မပို့ခင် ပြန်စစ်နိုင်ပါတယ်။",
    firstName: "ပထမအမည်",
    lastName: "နောက်ဆုံးအမည်",
    emailAddress: "အီးမေးလ် လိပ်စာ",
    projectDetails: "ပရောဂျက် အသေးစိတ်",
    firstNamePlaceholder: "ဥပမာ - အောင်",
    lastNamePlaceholder: "ဥပမာ - ခန့်",
    emailPlaceholder: "သင့်အီးမေးလ်ထည့်ပါ",
    projectPlaceholder: "လိုချင်တဲ့ video အမျိုးအစား၊ ကြာချိန်၊ style၊ deadline၊ brand အချက်အလက်တွေ ရေးပေးပါ...",
    sendButton: "Email Message ပြင်ဆင်ရန်",
    telegramButton: "Telegram မှာ စကားပြောရန်",
    viberButton: "Viber မှာ စကားပြောရန်",
    emailButton: "Email ပို့ရန်"
  }
} as const;

const contactLinks = [
  { key: "email", Icon: Mail, val: "okaung717@gmail.com", href: "mailto:okaung717@gmail.com" },
  { key: "phone", Icon: Phone, val: "09671010011", href: "tel:09671010011" },
  { key: "telegram", Icon: Send, val: "@BurmaAiStudio", href: "https://t.me/BurmaAiStudio" },
  { key: "viber", Icon: MessageCircle, val: "+95 9 671 010 011", href: "viber://chat?number=%2B959671010011" },
  { key: "facebook", Icon: Globe, val: "Burma Ai Studio", href: "https://www.facebook.com/BurmaAiaStudio/" },
] as const;

export default function Contact() {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    projectDetails: "",
  });

  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];

  const updateField =
    (field: keyof typeof formData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || "New Client";
    const subject = encodeURIComponent(`New AI Video Project Inquiry - ${fullName}`);
    const body = encodeURIComponent(
      `Hello Burma AI Studio,\n\nI want to discuss an AI video project.\n\nName: ${fullName}\nEmail: ${formData.email || "Not provided"}\n\nProject Details:\n${formData.projectDetails || "Please contact me for more details."}\n\nThank you.`
    );

    window.location.href = `mailto:okaung717@gmail.com?subject=${subject}&body=${body}`;
  };

  const labelMap = {
    email: t.emailLabel,
    phone: t.phoneLabel,
    telegram: t.telegramLabel,
    viber: t.viberLabel,
    facebook: t.facebookLabel,
  } as const;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-[#00C2FF] selection:text-white transition-colors duration-300">
      <main className="py-16 md:py-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-16">
        <div className="md:w-1/2 space-y-8">
          <h1 className="max-w-[680px] text-[34px] sm:text-[40px] md:text-[44px] lg:text-[52px] font-extrabold text-gray-900 dark:text-white tracking-normal leading-[1.85] md:leading-[1.72] lg:leading-[1.58] break-words">
            <span className="block">
              {t.title1}<span className="text-[#00C2FF] inline-block">{t.titleHighlight}</span>
            </span>
            <span className="block mt-1 md:mt-2">{t.title2}</span>
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-xl">
            {t.subtitle}
          </p>

          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-7 shadow-sm">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-relaxed">{t.contactTitle}</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 leading-relaxed">{t.contactSubtitle}</p>

            <div className="mt-6 space-y-5">
              {contactLinks.map((item) => (
                <a key={item.key} href={item.href} target={item.key === "phone" ? undefined : "_blank"} rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer w-fit">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-[#00C2FF]/10 transition-colors shrink-0">
                    <item.Icon className="w-5 h-5 text-[#00C2FF]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-[#00C2FF] transition-colors">
                      {labelMap[item.key]}
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white break-all">{item.val}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a href="mailto:okaung717@gmail.com" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 text-sm font-extrabold text-gray-900 dark:text-white hover:text-[#00C2FF] transition-colors">
              <Mail className="w-4 h-4 text-[#00C2FF]" /> {t.emailButton}
            </a>
            <a href="https://t.me/BurmaAiStudio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 text-sm font-extrabold text-gray-900 dark:text-white hover:text-[#00C2FF] transition-colors">
              <Send className="w-4 h-4 text-[#00C2FF]" /> Telegram
            </a>
            <a href="viber://chat?number=%2B959671010011" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 text-sm font-extrabold text-gray-900 dark:text-white hover:text-[#00C2FF] transition-colors">
              <MessageCircle className="w-4 h-4 text-[#00C2FF]" /> Viber
            </a>
          </div>
        </div>

        <div className="md:w-1/2 bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/20 dark:shadow-none border border-gray-100 dark:border-gray-800 h-fit">
          <div className="mb-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#00C2FF]">Project Inquiry</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-relaxed">{t.formTitle}</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 leading-relaxed">{t.formSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.firstName}</label>
                <input value={formData.firstName} onChange={updateField("firstName")} type="text" className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all text-gray-900 dark:text-white" placeholder={t.firstNamePlaceholder} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.lastName}</label>
                <input value={formData.lastName} onChange={updateField("lastName")} type="text" className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all text-gray-900 dark:text-white" placeholder={t.lastNamePlaceholder} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.emailAddress}</label>
              <input value={formData.email} onChange={updateField("email")} type="email" className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all text-gray-900 dark:text-white" placeholder={t.emailPlaceholder} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.projectDetails}</label>
              <textarea value={formData.projectDetails} onChange={updateField("projectDetails")} rows={5} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all resize-none text-gray-900 dark:text-white" placeholder={t.projectPlaceholder}></textarea>
            </div>
            <button type="submit" className="w-full bg-[#911923] text-white px-8 py-4 rounded-xl font-extrabold hover:bg-[#7a141e] focus:outline-none focus:ring-4 focus:ring-[#911923]/25 transition-all shadow-lg shadow-red-900/20">
              <span className="inline-flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" /> {t.sendButton}
              </span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a href="https://t.me/BurmaAiStudio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white hover:text-[#00C2FF] transition-colors">
                <Send className="w-4 h-4 text-[#00C2FF]" /> {t.telegramButton}
              </a>
              <a href="viber://chat?number=%2B959671010011" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white hover:text-[#00C2FF] transition-colors">
                <MessageCircle className="w-4 h-4 text-[#00C2FF]" /> {t.viberButton}
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
