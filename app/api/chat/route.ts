export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "assistant" | "user"; content: string };
type GeminiResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
type GeminiContent = { role: "model" | "user"; parts: Array<{ text: string }> };

const GEMINI_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

const SYSTEM_PROMPT = `You are Burma AI Studio's official AI sales consultant.
Reply in the same language as the visitor.
Be concise, friendly and effective.
Keep answers short: maximum 2 short paragraphs and 1 next-step question.
Do not write long essays.
Suggest the best AI video direction for the visitor's business.
Burma AI Studio creates AI promotional videos, cinematic commercials, AI presenter videos, TikTok/Reels/Shorts ads, product videos, script direction and creative editing.
Do not invent exact prices. Ask for product, platform, duration and reference before quote.`;

function jsonReply(reply: string, status = 200) {
  return Response.json({ reply }, { status });
}

function isValidMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<ChatMessage>;
  return (message.role === "assistant" || message.role === "user") && typeof message.content === "string";
}

async function getMessages(request: Request): Promise<ChatMessage[]> {
  const body = (await request.json().catch(() => null)) as { messages?: unknown } | null;
  const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
  return rawMessages.filter(isValidMessage).slice(-8);
}

function hasMyanmar(text: string) {
  return /[\u1000-\u109F]/.test(text);
}

function getLastUserQuestion(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content || "";
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function compact(text: string) {
  const cleaned = text.replace(/\n{3,}/g, "\n\n").trim();
  if (cleaned.length <= 460) return cleaned;
  return cleaned.slice(0, 460).replace(/\s+\S*$/, "") + "...";
}

function fallback(question: string) {
  const q = question.toLowerCase();
  const mm = hasMyanmar(question);

  if (hasAny(q, ["bar", "beer", "cocktail", "restaurant", "cafe", "စားသောက်", "ဘား", "ကဖေး", "ဆိုင်"])) {
    return mm
      ? "Bar/Restaurant ကြော်ငြာအတွက် ညအလင်းရောင် vibe, drink close-up, crowd mood, premium logo ending ပါတဲ့ 15-30s Reels/TikTok video ကအထိရောက်ဆုံးပါ။\n\nဆိုင်နာမည်၊ location, ကြော်ငြာချင်တဲ့ drink/food နဲ့လိုချင်တဲ့ vibe ကိုပို့ပေးပါ။"
      : "For a bar/restaurant ad, a 15-30s Reels/TikTok video with night ambience, drink close-ups, crowd mood and a premium logo ending will work best.\n\nSend the shop name, location, product focus and preferred vibe.";
  }

  if (hasAny(q, ["music", "song", "artist", "singer", "သီချင်း", "အဆိုတော်", "music video"])) {
    return mm
      ? "Music video အတွက် song teaser, artist promo, lyric-style short ဒါမှမဟုတ် cinematic mood video ပုံစံနဲ့ဖန်တီးနိုင်ပါတယ်။ Social media အတွက်ဆို 15-30s hook video ကပိုထိရောက်ပါတယ်။\n\nသီချင်း mood, artist name, duration နဲ့ reference style ကိုပို့ပေးပါ။"
      : "For a music ad, we can create a song teaser, artist promo, lyric-style short or cinematic mood video. For social media, a 15-30s hook video is usually strongest.\n\nSend the song mood, artist name, duration and reference style.";
  }

  if (hasAny(q, ["price", "cost", "how much", "budget", "ဈေး", "စျေး", "ဘယ်လောက်"])) {
    return mm
      ? "ဈေးနှုန်းက video ကြာချိန်, scene count, presenter/character, voice, realism, deadline နဲ့ revision ပေါ်မူတည်ပါတယ်။ Fixed price မပြောတာထက် project အလိုက် quote ပေးတာပိုမှန်ပါတယ်။\n\nProduct/service, platform, duration နဲ့ reference ကိုပို့ပေးပါ။"
      : "Price depends on duration, scene count, presenter/character, voice, realism, deadline and revisions. It’s better to quote based on your exact project.\n\nSend the product/service, platform, duration and reference style.";
  }

  if (hasAny(q, ["contact", "phone", "telegram", "viber", "ဆက်သွယ်", "ဖုန်း", "တယ်လီဂရမ်"])) {
    return mm
      ? "Burma AI Studio ကို Email: okaung717@gmail.com, Phone: 09671010011, Telegram/Viber: +95 9 671 010 011 ကနေတိုက်ရိုက်ဆက်သွယ်နိုင်ပါတယ်။\n\nProject idea ကိုပို့လိုက်ရင် video direction နဲ့ quote ကိုပြန်ညှိပေးပါမယ်။"
      : "You can contact Burma AI Studio directly: Email okaung717@gmail.com, Phone 09671010011, Telegram/Viber +95 9 671 010 011.\n\nSend your project idea and we’ll suggest the video direction and quote.";
  }

  return mm
    ? "Burma AI Studio က သင့်လုပ်ငန်းအတွက် AI presenter, cinematic ad, product ad, Reels/TikTok short video တွေကိုဖန်တီးပေးနိုင်ပါတယ်။\n\nသင့် product/service, တင်မယ့် platform, ကြာချိန်နဲ့လိုချင်တဲ့ style ကိုပြောပြပါ။ အကောင်းဆုံး video direction ကိုတိုတိုရှင်းရှင်းအကြံပေးပါမယ်။"
    : "Burma AI Studio can create AI presenter videos, cinematic ads, product ads and Reels/TikTok short videos for your business.\n\nTell me your product/service, platform, duration and preferred style. I’ll suggest the best video direction clearly and briefly.";
}

async function callGemini(model: string, apiKey: string, contents: GeminiContent[]) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.65, topP: 0.9, maxOutputTokens: 420 },
      }),
    });
    const data = (await response.json().catch(() => null)) as GeminiResponse | null;
    if (!response.ok) return null;
    const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
    return reply ? compact(reply) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  try {
    const messages = await getMessages(request);
    if (messages.length === 0) return jsonReply("Please send a message first.", 400);
    const lastQuestion = getLastUserQuestion(messages);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return jsonReply(fallback(lastQuestion));

    const contents: GeminiContent[] = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    for (const model of GEMINI_MODELS) {
      const reply = await callGemini(model, apiKey, contents);
      if (reply) return jsonReply(reply);
    }
    return jsonReply(fallback(lastQuestion));
  } catch {
    return jsonReply(fallback(""));
  }
}
