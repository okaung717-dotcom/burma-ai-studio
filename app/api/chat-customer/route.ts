export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Message = { role: "assistant" | "user"; content: string };
type GeminiResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };

const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
const CONTACT = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011";

function myanmar(text: string) { return /[\u1000-\u109F]/.test(text); }
function contains(text: string, words: string[]) { return words.some((word) => text.includes(word)); }
function reply(text: string, status = 200) { return Response.json({ reply: text }, { status }); }

function lastUser(messages: Message[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content || "";
}

function valid(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<Message>;
  return (message.role === "assistant" || message.role === "user") && typeof message.content === "string";
}

function relevant(question: string) {
  const q = question.toLowerCase();
  return contains(q, [
    "burma", "studio", "website", "site", "ai", "video", "ad", "ads", "commercial", "promo", "marketing", "brand", "service", "price", "pricing", "cost", "budget", "package", "quote", "portfolio", "sample", "contact", "phone", "telegram", "viber", "email", "delivery", "revision", "script", "idea", "concept", "reels", "tiktok", "shorts", "product", "restaurant", "cafe", "bar", "music", "song", "business", "company", "presenter", "cinematic", "duration", "deadline",
    "ဝက်ဘ်", "ဆိုက်", "ဗီဒီယို", "ကြော်ငြာ", "ဈေး", "စျေး", "ဘယ်လောက်", "ကုန်ကျ", "ပက်ကေ့", "ဝန်ဆောင်", "လုပ်ချင်", "လုပ်မယ်", "ဖန်တီး", "နမူနာ", "လက်ရာ", "ပြခန်း", "ဆက်သွယ်", "ဖုန်း", "တယ်လီဂရမ်", "အီးမေးလ်", "ဇာတ်ညွှန်း", "စာသား", "အကြံ", "စိတ်ကူး", "လုပ်ငန်း", "စားသောက်", "ဘား", "ကဖေး", "သီချင်း", "အဆိုတော်", "ပို့ပေး", "ရက်", "အချိန်", "ပြင်ဆင်", "မှာယူ", "ပရောဂျက်"
  ]);
}

function offTopic(question: string) {
  return myanmar(question)
    ? "ကျေးဇူးပါ။ ဒီ AI assistant က Burma AI Studio website နဲ့ AI video service အတွက် customer service bot ဖြစ်ပါတယ်။\n\nAI video, pricing, portfolio, script idea, delivery, revisions, contact, ဒါမှမဟုတ် သင့်လုပ်ငန်းအတွက် video project နဲ့ပတ်သတ်တာကိုမေးပေးပါ။"
    : "Thanks for asking. I’m Burma AI Studio’s website customer service assistant, so I can only help with our AI video services.\n\nPlease ask me about AI videos, pricing, portfolio, script ideas, delivery, revisions, contact, or your video project.";
}

function fallback(question: string) {
  const q = question.toLowerCase();
  const mm = myanmar(question);
  if (!relevant(question)) return offTopic(question);
  if (contains(q, ["price", "cost", "how much", "budget", "ဈေး", "စျေး", "ဘယ်လောက်", "ကုန်ကျ"])) {
    return mm ? "ဈေးက video ကြာချိန်၊ scene အရေအတွက်၊ voice, presenter, realism, deadline နဲ့ revision ပေါ်မူတည်ပါတယ်။\n\nProduct/service, platform, duration နဲ့ reference style ပို့ပေးပါ။ သင့် budget နဲ့ကိုက်တဲ့ quote ကိုညှိပေးပါမယ်။" : "Price depends on duration, scene count, voice, presenter, realism, deadline and revisions.\n\nSend your product/service, platform, duration and reference style. I will suggest the best quote for your budget.";
  }
  if (contains(q, ["contact", "phone", "telegram", "viber", "ဆက်သွယ်", "ဖုန်း", "တယ်လီဂရမ်"])) {
    return mm ? `တိုက်ရိုက်ဆက်သွယ်နိုင်ပါတယ် — ${CONTACT}။\n\nProject idea ပို့ပေးရင် video direction နဲ့ quote ကိုပြန်ညှိပေးပါမယ်။` : `You can contact Burma AI Studio directly — ${CONTACT}.\n\nSend your project idea and we will suggest the video direction and quotation.`;
  }
  if (contains(q, ["music", "song", "သီချင်း", "အဆိုတော်"])) {
    return mm ? "Music ads video အတွက် song teaser, artist promo, lyric-style short, cinematic mood video ပုံစံတွေသင့်ပါတယ်။\n\nသီချင်း mood, artist name, duration နဲ့ reference style ပို့ပေးပါ။" : "For a music ad, a song teaser, artist promo, lyric-style short, or cinematic mood video will work well.\n\nSend the song mood, artist name, duration and reference style.";
  }
  if (contains(q, ["bar", "restaurant", "cafe", "ဘား", "စားသောက်", "ကဖေး", "ဆိုင်"])) {
    return mm ? "Bar/Restaurant ads video အတွက် night vibe, food/drink close-up, customer mood နဲ့ premium logo ending ပါတဲ့ 15-30s short video ကထိရောက်ပါတယ်။\n\nဆိုင်နာမည်, location, menu/drink နဲ့လိုချင်တဲ့ vibe ကိုပို့ပေးပါ။" : "For a bar or restaurant ad, a 15-30s short video with night ambience, food/drink close-ups, customer mood and a premium logo ending works best.\n\nSend the shop name, location, menu/drink and preferred vibe.";
  }
  return mm ? "ရပါတယ်။ Burma AI Studio က သင့် product/service အတွက် AI presenter ad, cinematic ad, product ad, Reels/TikTok short video direction ကိုညှိပေးနိုင်ပါတယ်။\n\nလုပ်ငန်းအမျိုးအစား, platform, duration နဲ့လိုချင်တဲ့ style ကိုပြောပြပါ။" : "Yes. Burma AI Studio can suggest AI presenter ads, cinematic ads, product ads, or Reels/TikTok short video directions for your product/service.\n\nTell me your business type, platform, duration and preferred style.";
}

async function callGemini(model: string, apiKey: string, messages: Message[], question: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  const systemText = `You are Burma AI Studio's customer service assistant. Only answer questions about Burma AI Studio website, AI video services, pricing, portfolio, script ideas, delivery, revisions, contact, or video projects. If unrelated, politely redirect. English-only means English. Burmese or mixed Burmese-English means Burmese. Keep replies concise and complete.`;
  try {
    const contents = messages.map((message) => ({ role: message.role === "assistant" ? "model" : "user", parts: [{ text: message.content }] }));
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      signal: controller.signal,
      body: JSON.stringify({ systemInstruction: { parts: [{ text: systemText }] }, contents, generationConfig: { temperature: 0.6, topP: 0.9, maxOutputTokens: 560 } }),
    });
    const data = (await res.json().catch(() => null)) as GeminiResponse | null;
    const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
    return res.ok && text ? text : fallback(question);
  } catch {
    return fallback(question);
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { messages?: unknown } | null;
  const messages = Array.isArray(body?.messages) ? body.messages.filter(valid).slice(-8) : [];
  const question = lastUser(messages);
  if (!question) return reply("Please send a message first.", 400);
  if (!relevant(question)) return reply(offTopic(question));
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return reply(fallback(question));
  for (const model of MODELS) {
    const answer = await callGemini(model, apiKey, messages, question);
    if (answer) return reply(answer.replace(/\n{3,}/g, "\n\n").trim());
  }
  return reply(fallback(question));
}
