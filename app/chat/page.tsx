"use client";

import {
  Bot,
  Camera,
  CheckCheck,
  FileText,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Newspaper,
  Paperclip,
  Phone,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useLanguage } from "../LanguageContext";
import "./chat.css";

type Role = "assistant" | "user";
type AttachmentKind = "media" | "file" | "camera" | "audio";

type ChatAttachment = {
  id: string;
  name: string;
  type: string;
  kind: AttachmentKind;
  previewUrl?: string;
};

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  attachments?: ChatAttachment[];
};

type AdminReply = { id?: string; content?: string; createdAt?: string };

type AccountUser = {
  email?: string;
  displayName?: string;
};

const SESSION_KEY = "bas_full_chat_session";
const MAX_ATTACHMENT_COUNT = 4;
const MAX_PREVIEW_SIZE = 18 * 1024 * 1024;

const copy = {
  EN: {
    pageTitle: "Chat | Burma AI Studio",
    eyebrow: "STUDIO CONVERSATION",
    title: "Let’s Build Something Remarkable.",
    description: "Discuss your AI video, campaign, script, visual direction, delivery or pricing in one focused conversation.",
    identity: "Signed-in client",
    secure: "Secure studio inbox",
    monitored: "AI guidance • Admin monitored",
    usuallyReplies: "Usually responds through this chat or your account email.",
    quickTitle: "Start with a direction",
    contactTitle: "Direct studio channels",
    email: "Email",
    telegram: "Telegram",
    viber: "Viber",
    call: "Call",
    welcome: "Welcome to Burma AI Studio. Tell me what you want to create, where it will be published, the duration, style, deadline and any references you already have.",
    secondWelcome: "I can help shape the brief immediately, and the studio team can review the conversation from the admin inbox.",
    typing: "Burma AI Studio is preparing a response…",
    placeholder: "Write a message about your project…",
    send: "Send message",
    attachmentOnly: "I’m sharing project references.",
    sendFailed: "The message could not be sent. Please try again or use Telegram below.",
    locationDenied: "Location access was not available. You can paste a Google Maps link instead.",
    attachments: "Attachments",
    photoVideo: "Photo or Video",
    projectFile: "Project File",
    camera: "Camera",
    audio: "Audio",
    location: "Location",
    article: "Article / Script",
    articleTemplate: "Article / script direction:\nTitle or topic:\nTarget audience:\nKey message:\nPreferred tone:\nDeadline:",
    fileNote: "Selected files are previewed in the conversation. Add a short note explaining what the studio should review.",
    online: "Online",
  },
  MM: {
    pageTitle: "Chat | Burma AI Studio",
    eyebrow: "STUDIO CONVERSATION",
    title: "Project အကြောင်း တိုက်ရိုက်ပြောကြမယ်။",
    description: "AI video, campaign, script, visual direction, delivery နဲ့ pricing အကြောင်းကို Chat တစ်ခုတည်းမှာ အဆင်ပြေပြေ ဆွေးနွေးနိုင်ပါတယ်။",
    identity: "Sign in ဝင်ထားသော Client",
    secure: "လုံခြုံသော Studio Inbox",
    monitored: "AI လမ်းညွှန်မှု • Admin ကြည့်ရှုထားသည်",
    usuallyReplies: "ဒီ Chat သို့မဟုတ် Account Email မှတစ်ဆင့် ပြန်လည်ဆက်သွယ်ပေးပါမယ်။",
    quickTitle: "အမြန်စတင်ရန်",
    contactTitle: "Studio ကို တိုက်ရိုက်ဆက်သွယ်ရန်",
    email: "Email",
    telegram: "Telegram",
    viber: "Viber",
    call: "Call",
    welcome: "Burma AI Studio မှ ကြိုဆိုပါတယ်။ ဘာဖန်တီးချင်လဲ၊ ဘယ် Platform မှာသုံးမလဲ၊ ကြာချိန်၊ Style၊ Deadline နဲ့ Reference တွေကို ပြောပေးပါ။",
    secondWelcome: "Project brief ကို AI နဲ့ ချက်ချင်းညှိပေးနိုင်ပြီး Studio Admin ကလည်း ဒီ Conversation ကို Inbox မှာကြည့်နိုင်ပါတယ်။",
    typing: "Burma AI Studio က အဖြေပြင်ဆင်နေပါတယ်…",
    placeholder: "သင့် Project အကြောင်းရေးပါ…",
    send: "စာပို့ရန်",
    attachmentOnly: "Project reference တွေကို မျှဝေနေပါတယ်။",
    sendFailed: "စာပို့လို့မရသေးပါ။ ပြန်ကြိုးစားပါ သို့မဟုတ် Telegram ကိုသုံးပါ။",
    locationDenied: "Location ရယူလို့မရပါ။ Google Maps Link ကို ကူးထည့်နိုင်ပါတယ်။",
    attachments: "Attachment များ",
    photoVideo: "Photo သို့မဟုတ် Video",
    projectFile: "Project File",
    camera: "Camera",
    audio: "Audio",
    location: "Location",
    article: "Article / Script",
    articleTemplate: "Article / Script Direction:\nခေါင်းစဉ်:\nTarget Audience:\nအဓိက Message:\nလိုချင်သော Tone:\nDeadline:",
    fileNote: "ရွေးထားသော File တွေကို Conversation ထဲမှာ Preview ပြပါမယ်။ Studio က ဘာကိုစစ်ရမလဲဆိုတာ စာတိုလေးထည့်ရေးပါ။",
    online: "Online",
  },
} as const;

const quickPrompts = {
  EN: [
    "Suggest the best AI video format for my brand",
    "Help me build a short video brief",
    "I need a presenter video campaign",
    "Tell me about pricing and delivery",
  ],
  MM: [
    "ငါ့ Brand အတွက် သင့်တော်တဲ့ AI Video Format အကြံပေးပါ",
    "Short Video Brief တစ်ခု တည်ဆောက်ပေးပါ",
    "Presenter Video Campaign လိုချင်ပါတယ်",
    "Pricing နဲ့ Delivery အကြောင်းပြောပြပါ",
  ],
} as const;

const emojis = ["😀", "😊", "😍", "🔥", "✨", "🎬", "🎥", "👍", "🙏", "💡", "🚀", "❤️"];

const directLinks = {
  email: "mailto:okaung717@gmail.com",
  telegram: "tg://resolve?phone=959671010011",
  viber: "viber://chat?number=%2B959671010011",
  phone: "tel:09671010011",
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getVisitorId() {
  const key = "bas_visitor_id";
  let visitorId = window.localStorage.getItem(key);
  if (!visitorId) {
    visitorId = createId("visitor");
    window.localStorage.setItem(key, visitorId);
  }
  return visitorId;
}

async function logChat(visitorId: string, role: Role, content: string) {
  await fetch("/api/chat-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId,
      role,
      content,
      page: "/chat",
      language: navigator.language || "Unknown",
    }),
  }).catch(() => undefined);
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

export default function ChatPage() {
  const { lang } = useLanguage();
  const activeLang = lang === "MM" ? "MM" : "EN";
  const t = copy[activeLang];
  const prompts = quickPrompts[activeLang];

  const initialMessages = useMemo<ChatMessage[]>(
    () => [
      { id: "welcome-1", role: "assistant", content: t.welcome, createdAt: new Date().toISOString() },
      { id: "welcome-2", role: "assistant", content: t.secondWelcome, createdAt: new Date().toISOString() },
    ],
    [t.secondWelcome, t.welcome]
  );

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [account, setAccount] = useState<AccountUser>({});

  const visitorIdRef = useRef("");
  const seenAdminReplies = useRef<Set<string>>(new Set());
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    document.title = t.pageTitle;
  }, [t.pageTitle]);

  useEffect(() => {
    visitorIdRef.current = getVisitorId();

    try {
      const stored = window.sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {
      window.sessionStorage.removeItem(SESSION_KEY);
    }

    fetch("/api/account/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { user?: AccountUser }) => {
        if (data?.user) setAccount(data.user);
      })
      .catch(() => undefined);

    try {
      const raw = window.localStorage.getItem("bas_website_profile");
      if (raw) {
        const profile = JSON.parse(raw) as AccountUser;
        setAccount((current) => ({ ...profile, ...current }));
      }
    } catch {
      // The chat remains usable when local profile storage is unavailable.
    }
  }, []);

  useEffect(() => {
    const serializable = messages.map(({ attachments: _attachments, ...message }) => message);
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(serializable.slice(-50)));
  }, [messages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending, attachments]);

  useEffect(() => {
    const poll = async () => {
      const visitorId = visitorIdRef.current || getVisitorId();
      const response = await fetch("/api/chat-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, seenIds: Array.from(seenAdminReplies.current) }),
      }).catch(() => null);
      const data = await response?.json().catch(() => null);
      const replies: AdminReply[] = Array.isArray(data?.replies) ? data.replies : [];

      replies.forEach((reply) => {
        if (!reply.id || !reply.content || seenAdminReplies.current.has(reply.id)) return;
        seenAdminReplies.current.add(reply.id);
        setMessages((current) => [
          ...current,
          {
            id: `admin-${reply.id}`,
            role: "assistant",
            content: reply.content || "",
            createdAt: reply.createdAt || new Date().toISOString(),
          },
        ]);
      });
    };

    void poll();
    const timer = window.setInterval(() => void poll(), 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const urls = attachmentUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const addFiles = (event: ChangeEvent<HTMLInputElement>, kind: AttachmentKind) => {
    const incoming = Array.from(event.target.files || []).slice(0, MAX_ATTACHMENT_COUNT);
    event.target.value = "";
    if (!incoming.length) return;

    const next = incoming.map<ChatAttachment>((file) => {
      const canPreview = file.size <= MAX_PREVIEW_SIZE && (file.type.startsWith("image/") || file.type.startsWith("video/") || file.type.startsWith("audio/"));
      const previewUrl = canPreview ? URL.createObjectURL(file) : undefined;
      if (previewUrl) attachmentUrlsRef.current.add(previewUrl);
      return {
        id: createId("attachment"),
        name: file.name,
        type: file.type || "application/octet-stream",
        kind,
        previewUrl,
      };
    });

    setAttachments((current) => [...current, ...next].slice(0, MAX_ATTACHMENT_COUNT));
    setNotice(t.fileNote);
    setAttachmentMenuOpen(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
        attachmentUrlsRef.current.delete(target.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  };

  const shareLocation = () => {
    setAttachmentMenuOpen(false);
    if (!navigator.geolocation) {
      setNotice(t.locationDenied);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const link = `https://maps.google.com/?q=${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`;
        setInput((current) => `${current}${current ? "\n" : ""}Location: ${link}`);
      },
      () => setNotice(t.locationDenied),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const insertArticleTemplate = () => {
    setInput((current) => `${current}${current ? "\n\n" : ""}${t.articleTemplate}`);
    setAttachmentMenuOpen(false);
  };

  const sendMessage = async (rawText: string) => {
    const clean = rawText.trim();
    if ((!clean && attachments.length === 0) || isSending) return;

    const attachmentSummary = attachments.length
      ? `\n\n${t.attachments}: ${attachments.map((item) => item.name).join(", ")}`
      : "";
    const apiContent = `${clean || t.attachmentOnly}${attachmentSummary}`;
    const visitorId = visitorIdRef.current || getVisitorId();
    const userMessage: ChatMessage = {
      id: createId("user"),
      role: "user",
      content: clean || t.attachmentOnly,
      createdAt: new Date().toISOString(),
      attachments,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setAttachments([]);
    setNotice("");
    setEmojiOpen(false);
    setAttachmentMenuOpen(false);
    setIsSending(true);
    void logChat(visitorId, "user", apiContent);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          account,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: `${message.content}${message.attachments?.length ? `\n\n${t.attachments}: ${message.attachments.map((item) => item.name).join(", ")}` : ""}`,
          })),
        }),
      });
      const data = await response.json().catch(() => null);
      const reply = data?.reply || t.sendFailed;
      setMessages((current) => [
        ...current,
        { id: createId("assistant"), role: "assistant", content: reply, createdAt: new Date().toISOString() },
      ]);
      void logChat(visitorId, "assistant", reply);
    } catch {
      setMessages((current) => [
        ...current,
        { id: createId("error"), role: "assistant", content: t.sendFailed, createdAt: new Date().toISOString() },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const accountName = account.displayName || (activeLang === "MM" ? "Burma AI Studio Client" : "Burma AI Studio Client");
  const accountEmail = account.email || "Secure account session";

  return (
    <div className="bas-chat-page">
      <main className="bas-chat-shell">
        <aside className="bas-chat-sidebar">
          <div className="bas-chat-sidebar-glow" aria-hidden="true" />
          <div className="bas-chat-sidebar-content">
            <div className="bas-chat-kicker"><Sparkles className="h-4 w-4" /> {t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p className="bas-chat-sidebar-copy">{t.description}</p>

            <div className="bas-chat-trust-list">
              <div><ShieldCheck className="h-5 w-5" /><span><b>{t.secure}</b><small>{t.usuallyReplies}</small></span></div>
              <div><MessageCircle className="h-5 w-5" /><span><b>{t.monitored}</b><small>Burma AI Studio creative support</small></span></div>
            </div>

            <div className="bas-chat-profile-card">
              <div className="bas-chat-avatar is-client">{accountName.charAt(0).toUpperCase()}</div>
              <div className="min-w-0">
                <p>{t.identity}</p>
                <strong>{accountName}</strong>
                <span>{accountEmail}</span>
              </div>
            </div>

            <div className="bas-chat-direct">
              <p>{t.contactTitle}</p>
              <div className="bas-chat-direct-grid">
                <a href={directLinks.email}><Mail className="h-4 w-4" />{t.email}</a>
                <a href={directLinks.telegram}><Send className="h-4 w-4" />{t.telegram}</a>
                <a href={directLinks.viber}><MessageCircle className="h-4 w-4" />{t.viber}</a>
                <a href={directLinks.phone}><Phone className="h-4 w-4" />{t.call}</a>
              </div>
            </div>
          </div>
        </aside>

        <section className="bas-chat-workspace" aria-label="Burma AI Studio chat">
          <header className="bas-chat-header">
            <div className="bas-chat-avatar is-studio"><Bot className="h-6 w-6" strokeWidth={2.3} /><span /></div>
            <div className="min-w-0">
              <h2>Burma AI Studio Chat</h2>
              <p><span className="bas-chat-online-dot" /> {t.online} · {t.monitored}</p>
            </div>
            <div className="bas-chat-header-actions">
              <a href={directLinks.email} aria-label="Email Burma AI Studio"><Mail className="h-5 w-5" /></a>
              <a href={directLinks.phone} aria-label="Call Burma AI Studio"><Phone className="h-5 w-5" /></a>
            </div>
          </header>

          <div className="bas-chat-quick-bar">
            <span>{t.quickTitle}</span>
            <div>
              {prompts.map((prompt) => (
                <button key={prompt} type="button" disabled={isSending} onClick={() => void sendMessage(prompt)}>{prompt}</button>
              ))}
            </div>
          </div>

          <div className="bas-chat-messages" aria-live="polite">
            <div className="bas-chat-day-chip">Today</div>
            {messages.map((message) => (
              <article key={message.id} className={`bas-chat-message-row ${message.role === "user" ? "is-user" : "is-assistant"}`}>
                {message.role === "assistant" ? <div className="bas-chat-mini-avatar"><Bot className="h-4 w-4" /></div> : null}
                <div className="bas-chat-message-wrap">
                  <div className="bas-chat-bubble">
                    {message.attachments?.length ? (
                      <div className="bas-chat-message-attachments">
                        {message.attachments.map((item) => (
                          <div key={item.id} className="bas-chat-message-attachment">
                            {item.previewUrl && item.type.startsWith("image/") ? <img src={item.previewUrl} alt={item.name} /> : null}
                            {item.previewUrl && item.type.startsWith("video/") ? <video src={item.previewUrl} controls playsInline /> : null}
                            {item.previewUrl && item.type.startsWith("audio/") ? <audio src={item.previewUrl} controls /> : null}
                            {!item.previewUrl ? <FileText className="h-5 w-5" /> : null}
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <p>{message.content}</p>
                    <footer><time>{formatTime(message.createdAt)}</time>{message.role === "user" ? <CheckCheck className="h-4 w-4" /> : null}</footer>
                  </div>
                </div>
              </article>
            ))}

            {isSending ? (
              <article className="bas-chat-message-row is-assistant">
                <div className="bas-chat-mini-avatar"><Bot className="h-4 w-4" /></div>
                <div className="bas-chat-bubble bas-chat-typing"><Sparkles className="h-4 w-4" /><span>{t.typing}</span><i /><i /><i /></div>
              </article>
            ) : null}
            <div ref={messageEndRef} className="h-1" />
          </div>

          <div className="bas-chat-composer-area">
            {attachments.length ? (
              <div className="bas-chat-pending-files">
                {attachments.map((item) => (
                  <div key={item.id}>
                    {item.previewUrl && item.type.startsWith("image/") ? <img src={item.previewUrl} alt="" /> : <FileText className="h-4 w-4" />}
                    <span>{item.name}</span>
                    <button type="button" onClick={() => removeAttachment(item.id)} aria-label={`Remove ${item.name}`}><X className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            ) : null}

            {notice ? <p className="bas-chat-notice">{notice}</p> : null}

            <form onSubmit={handleSubmit} className="bas-chat-composer">
              <div className="bas-chat-popover-anchor">
                <button type="button" className={`bas-chat-round-button ${attachmentMenuOpen ? "is-active" : ""}`} onClick={() => { setAttachmentMenuOpen((value) => !value); setEmojiOpen(false); }} aria-label="Add attachment">
                  <Paperclip className="h-6 w-6" />
                </button>

                {attachmentMenuOpen ? (
                  <div className="bas-chat-attachment-menu">
                    <button type="button" onClick={() => mediaInputRef.current?.click()}><ImageIcon className="h-5 w-5" /><span>{t.photoVideo}</span></button>
                    <button type="button" onClick={() => fileInputRef.current?.click()}><FileText className="h-5 w-5" /><span>{t.projectFile}</span></button>
                    <button type="button" onClick={() => cameraInputRef.current?.click()}><Camera className="h-5 w-5" /><span>{t.camera}</span></button>
                    <button type="button" onClick={() => audioInputRef.current?.click()}><Mic className="h-5 w-5" /><span>{t.audio}</span></button>
                    <button type="button" onClick={shareLocation}><MapPin className="h-5 w-5" /><span>{t.location}</span></button>
                    <button type="button" onClick={insertArticleTemplate}><Newspaper className="h-5 w-5" /><span>{t.article}</span></button>
                  </div>
                ) : null}
              </div>

              <div className="bas-chat-input-wrap">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage(input);
                    }
                  }}
                  rows={1}
                  placeholder={t.placeholder}
                  disabled={isSending}
                />
                <div className="bas-chat-popover-anchor">
                  <button type="button" className="bas-chat-emoji-button" onClick={() => { setEmojiOpen((value) => !value); setAttachmentMenuOpen(false); }} aria-label="Add emoji"><Smile className="h-6 w-6" /></button>
                  {emojiOpen ? (
                    <div className="bas-chat-emoji-menu">
                      {emojis.map((emoji) => <button key={emoji} type="button" onClick={() => setInput((current) => `${current}${emoji}`)}>{emoji}</button>)}
                    </div>
                  ) : null}
                </div>
              </div>

              <button type="submit" className="bas-chat-send-button" disabled={isSending || (!input.trim() && attachments.length === 0)} aria-label={t.send}><Send className="h-5 w-5" /></button>
            </form>

            <input ref={mediaInputRef} type="file" accept="image/*,video/*" multiple hidden onChange={(event) => addFiles(event, "media")} />
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip" multiple hidden onChange={(event) => addFiles(event, "file")} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={(event) => addFiles(event, "camera")} />
            <input ref={audioInputRef} type="file" accept="audio/*" hidden onChange={(event) => addFiles(event, "audio")} />
          </div>
        </section>
      </main>
    </div>
  );
}
