"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, Phone, Globe, Send, MessageCircle, Sparkles, ClipboardList } from "lucide-react";
import { useLanguage } from "../LanguageContext";

const telegramDirectLink = "tg://resolve?phone=959671010011";
const viberDirectLink = "viber://chat?number=%2B959671010011";

const translations = {
  EN: {
    title: "Project Intake",
    subtitle: "Tell Burma AI Studio what kind of AI video you need. We will guide your direction, script, style and delivery clearly.",
    contactTitle: "Direct contact",
    emailLabel: "Email",
    phoneLabel: "Call",
    telegramLabel: "Telegram",
    viberLabel: "Viber",
    facebookLabel: "Facebook",
    formTitle: "Send project brief",
    formSubtitle: "Your message goes to the admin inbox for follow-up.",
    firstName: "First name",
    lastName: "Last name",
    emailAddress: "Email address",
    projectDetails: "Project details",
    firstNamePlaceholder: "John",
    lastNamePlaceholder: "Doe",
    emailPlaceholder: "john@company.com",
    projectPlaceholder: "Video type, platform, duration, product/service, style, deadline, reference...",
    sendButton: "Send brief",
    sending: "Sending...",
    saved: "Message saved. Opening email backup...",
    fallback: "Email backup is opening. Admin inbox storage may need setup."
  },
  MM: {
    title: "Project Intake",
    subtitle: "လိုချင်တဲ့ AI video အမျိုးအစား၊ platform၊ ကြာချိန်၊ style နဲ့ deadline ကိုပြောပေးပါ။ Direction, script, style နဲ့ delivery ကိုသေချာလမ်းညွှန်ပေးပါမယ်။",
    contactTitle: "တိုက်ရိုက်ဆက်သွယ်ရန်",
    emailLabel: "Email",
    phoneLabel: "Call",
    telegramLabel: "Telegram",
    viberLabel: "Viber",
    facebookLabel: "Facebook",
    formTitle: "Project brief ပို့ရန်",
    formSubtitle: "ပို့လိုက်တဲ့စာကို Admin Inbox ထဲသိမ်းပြီး follow-up ပြန်လုပ်ပေးပါမယ်။",
    firstName: "ပထမအမည်",
    lastName: "နောက်ဆုံးအမည်",
    emailAddress: "အီးမေးလ်",
    projectDetails: "Project အသေးစိတ်",
    firstNamePlaceholder: "ဥပမာ - အောင်",
    lastNamePlaceholder: "ဥပမာ - ခန့်",
    emailPlaceholder: "သင့်အီးမေးလ်ထည့်ပါ",
    projectPlaceholder: "Video အမျိုးအစား၊ platform၊ ကြာချိန်၊ product/service၊ style၊ deadline၊ reference ရေးပေးပါ...",
    sendButton: "Brief ပို့ရန်",
    sending: "ပို့နေပါတယ်...",
    saved: "Message သိမ်းပြီးပါပြီ။ Email backup ဖွင့်နေပါတယ်...",
    fallback: "Email backup ဖွင့်နေပါတယ်။ Admin inbox storage ကို setup လုပ်ဖို့လိုနိုင်ပါတယ်။"
  }
} as const;

const contactLinks = [
  { key: "email", Icon: Mail, val: "okaung717@gmail.com", href: "mailto:okaung717@gmail.com" },
  { key: "phone", Icon: Phone, val: "09671010011", href: "tel:09671010011" },
  { key: "telegram", Icon: Send, val: "+95 9 671 010 011", href: telegramDirectLink },
  { key: "viber", Icon: MessageCircle, val: "+95 9 671 010 011", href: viberDirectLink },
  { key: "facebook", Icon: Globe, val: "Burma Ai Studio", href: "https://www.facebook.com/BurmaAiaStudio/" },
] as const;

export default function Contact() {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", projectDetails: "" });
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const safeLang = (lang === "MM" ? "MM" : "EN") as keyof typeof translations;
  const t = translations[safeLang];

  const updateField = (field: keyof typeof formData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const openEmailBackup = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || "New Client";
    const subject = encodeURIComponent(`New AI Video Project Inquiry - ${fullName}`);
    const body = encodeURIComponent(`Hello Burma AI Studio,\n\nI want to discuss an AI video project.\n\nName: ${fullName}\nEmail: ${formData.email || "Not provided"}\n\nProject Details:\n${formData.projectDetails || "Please contact me for more details."}\n\nThank you.`);
    window.location.href = `mailto:okaung717@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);
    setStatus(t.sending);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "contact-page" }),
      });
      setStatus(response.ok ? t.saved : t.fallback);
    } catch {
      setStatus(t.fallback);
    } finally {
      setIsSending(false);
      window.setTimeout(openEmailBackup, 350);
    }
  };

  const labelMap = { email: t.emailLabel, phone: t.phoneLabel, telegram: t.telegramLabel, viber: t.viberLabel, facebook: t.facebookLabel } as const;

  return (
    <div className="min-h-screen bg-[#fff9f0] text-[#1a0b0e] transition-colors duration-300 dark:bg-[#100708] dark:text-[#fff7eb]">
      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-[0.9fr_1.1fr] md:px-12 lg:px-24">
        <section className="space-y-6">
          <div className="rounded-[2.2rem] border border-[#ead9bd] bg-[#1a0b0e] p-7 text-white shadow-[0_18px_55px_rgba(26,11,14,0.14)] dark:border-[#4b2a1d] md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#e3bc61]"><Sparkles className="h-4 w-4" /> Contact App</div>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">{t.title}</h1>
            <p className="mt-4 text-base font-medium leading-relaxed text-white/70 md:text-lg">{t.subtitle}</p>
          </div>

          <div className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-6 dark:border-[#4b2a1d] dark:bg-[#1a0b0e]">
            <h2 className="text-2xl font-black leading-relaxed">{t.contactTitle}</h2>
            <div className="mt-5 grid gap-3">
              {contactLinks.map((item) => (
                <a key={item.key} href={item.href} target={item.key === "phone" || item.key === "email" ? undefined : "_blank"} rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl border border-[#ead9bd] bg-[#fff9f0] p-4 transition hover:border-[#911923]/40 dark:border-white/10 dark:bg-white/5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#911923] text-white"><item.Icon className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#911923] dark:text-[#e3bc61]">{labelMap[item.key]}</p><p className="break-all text-sm font-bold text-[#79695d] dark:text-[#d8c4a3]">{item.val}</p></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#ead9bd] bg-[#fffdf8] p-6 shadow-[0_18px_55px_rgba(26,11,14,0.08)] dark:border-[#4b2a1d] dark:bg-[#1a0b0e] md:p-8">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#be9537] text-[#100708]"><ClipboardList className="h-7 w-7" /></div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#911923] dark:text-[#e3bc61]">Brief Form</p>
              <h2 className="mt-2 text-2xl font-black leading-snug md:text-3xl">{t.formTitle}</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#79695d] dark:text-[#d8c4a3]">{t.formSubtitle}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-black text-[#1a0b0e] dark:text-white">{t.firstName}</label><input value={formData.firstName} onChange={updateField("firstName")} type="text" className="mt-2 w-full rounded-2xl border border-[#ead9bd] bg-[#fff9f0] px-4 py-3 text-[#1a0b0e] outline-none focus:ring-2 focus:ring-[#911923]/30 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder={t.firstNamePlaceholder} /></div>
              <div><label className="text-sm font-black text-[#1a0b0e] dark:text-white">{t.lastName}</label><input value={formData.lastName} onChange={updateField("lastName")} type="text" className="mt-2 w-full rounded-2xl border border-[#ead9bd] bg-[#fff9f0] px-4 py-3 text-[#1a0b0e] outline-none focus:ring-2 focus:ring-[#911923]/30 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder={t.lastNamePlaceholder} /></div>
            </div>
            <div><label className="text-sm font-black text-[#1a0b0e] dark:text-white">{t.emailAddress}</label><input value={formData.email} onChange={updateField("email")} type="email" className="mt-2 w-full rounded-2xl border border-[#ead9bd] bg-[#fff9f0] px-4 py-3 text-[#1a0b0e] outline-none focus:ring-2 focus:ring-[#911923]/30 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder={t.emailPlaceholder} /></div>
            <div><label className="text-sm font-black text-[#1a0b0e] dark:text-white">{t.projectDetails}</label><textarea value={formData.projectDetails} onChange={updateField("projectDetails")} rows={7} className="mt-2 w-full resize-none rounded-2xl border border-[#ead9bd] bg-[#fff9f0] px-4 py-3 text-[#1a0b0e] outline-none focus:ring-2 focus:ring-[#911923]/30 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder={t.projectPlaceholder} /></div>
            <button type="submit" disabled={isSending} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#911923] px-6 py-4 text-base font-black text-white shadow-lg shadow-[#911923]/20 transition hover:bg-[#7a141e] disabled:opacity-60"><Send className="h-5 w-5" /> {isSending ? t.sending : t.sendButton}</button>
            {status && <p className="rounded-2xl bg-[#fff3e3] px-4 py-3 text-sm font-bold text-[#911923] dark:bg-white/5 dark:text-[#e3bc61]">{status}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}
