export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "assistant" | "user"; content: string };
type GeminiResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
type GeminiContent = { role: "model" | "user"; parts: Array<{ text: string }> };

const GEMINI_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
const CONTACT = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011";

const SYSTEM_PROMPT = `You are Burma AI Studio's official AI sales consultant.
Reply in the same language as the visitor.
Sound like a real project consultant, not a generic bot.
Keep answers concise: 2 short paragraphs and 1 useful follow-up question.
Answer the exact intent first. Then recommend a suitable AI video direction. Then ask for the next detail.
Never repeat the same generic service answer.
Never invent exact fixed prices. Ask for product, platform, duration, reference and deadline before quotation.
Burma AI Studio creates AI promotional videos, cinematic commercials, AI presenter videos, TikTok/Reels/Shorts ads, product videos, music ads, bar/restaurant ads, script direction and creative editing.
Contact: ${CONTACT}`;

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
  if (cleaned.length <= 520) return cleaned;
  return cleaned.slice(0, 520).replace(/\s+\S*$/, "") + "...";
}

function fallback(question: string) {
  const q = question.toLowerCase();
  const mm = hasMyanmar(question);

  if (hasAny(q, ["price", "cost", "how much", "budget", "ဈေး", "စျေး", "ဘယ်လောက်", "ကုန်ကျ", "ပက်ကေ့", "package"])) {
    return mm
      ? "ဈေးက video ကြာချိန်၊ scene အရေအတွက်၊ voice/dialogue, presenter/character, realism level, deadline နဲ့ revision ပေါ်မူတည်ပါတယ်။ ဒါကြောင့် fixed price တစ်ခုတည်းမပြောဘဲ project အလိုက် quote ပေးတာပိုမှန်ပါတယ်။\n\nProduct/service, တင်မယ့် platform, duration နဲ့ reference style ပို့ပေးပါ။ သင့် budget နဲ့ကိုက်တဲ့ option ကိုညှိပေးပါမယ်။"
      : "Price depends on duration, scene count, voice/dialogue, presenter/character, realism level, deadline and revisions. So it’s better to quote based on the exact project, not a fixed random price.\n\nSend your product/service, platform, duration and reference style. I’ll suggest the best option for your budget.";
  }

  if (hasAny(q, ["music", "song", "artist", "singer", "သီချင်း", "အဆိုတော်", "music video", "mv"])) {
    return mm
      ? "Music ads video ဆိုရင် song teaser, artist promo, lyric-style short, cinematic mood video ဆိုပြီးရွေးလို့ရပါတယ်။ Social media မှာတင်မယ်ဆို 15-30s hook video ကပိုထိရောက်ပါတယ်။\n\nသီချင်း mood, artist name, duration နဲ့ reference style ပို့ပေးပါ။ အကောင်းဆုံး video concept ကိုရွေးပေးမယ်။"
      : "For a music ad, the best options are a song teaser, artist promo, lyric-style short, or cinematic mood video. For social media, a 15-30s hook video usually works best.\n\nSend the song mood, artist name, duration and reference style, and I’ll suggest the strongest concept.";
  }

  if (hasAny(q, ["bar", "beer", "cocktail", "restaurant", "cafe", "စားသောက်", "ဘား", "ကဖေး", "ဆိုင်", "အရက်", "drink", "food"])) {
    return mm
      ? "Bar/Restaurant ads video အတွက် ညအလင်းရောင် vibe, drink/food close-up, customer mood, premium logo ending ပါတဲ့ 15-30s Reels/TikTok video ကအထိရောက်ဆုံးပါ။\n\nဆိုင်နာမည်, location, ကြော်ငြာချင်တဲ့ menu/drink နဲ့လိုချင်တဲ့ vibe ကိုပို့ပေးပါ။"
      : "For a bar/restaurant ad, a 15-30s Reels/TikTok video with night ambience, drink/food close-ups, customer mood and a premium logo ending will work best.\n\nSend the shop name, location, product focus and preferred vibe.";
  }

  if (hasAny(q, ["script", "idea", "concept", "caption", "စာသား", "အကြံ", "စိတ်ကူး", "ဇာတ်ညွှန်း", "ကြော်ငြာစာ"])) {
    return mm
      ? "ရပါတယ်။ ကြော်ငြာ video script အတွက် hook, problem, solution, trust point နဲ့ contact CTA ပါတဲ့ structure သုံးရင်ပိုအလုပ်ဖြစ်ပါတယ်။\n\nဘာ product/service အတွက်ရေးချင်တာလဲ ပြောပါ။ 15s သို့ 30s script direction တစ်ခုအမြန်ညှိပေးမယ်။"
      : "Yes. For an ad script, the strongest structure is hook, problem, solution, trust point and contact CTA.\n\nWhat product/service is this for? I can suggest a 15s or 30s script direction.";
  }

  if (hasAny(q, ["လုပ်ချင်", "လုပ်မယ်", "ဖန်တီး", "create", "make", "video", "ad", "ads", "commercial", "ကြော်ငြာ", "ဗီဒီယို"])) {
    return mm
      ? "ရပါတယ်။ ကြော်ငြာ video တစ်ပုဒ်လုပ်ချင်ရင် ပထမဆုံး သင့် product/service အတွက် customer ကို ၃ စက္ကန့်အတွင်းဖမ်းနိုင်မယ့် hook video concept ကိုရွေးတာအရေးကြီးပါတယ်။ Burma AI Studio အနေနဲ့ AI presenter ad, cinematic product ad, Reels/TikTok short ad ပုံစံတွေထဲက သင့်လုပ်ငန်းနဲ့ကိုက်တာရွေးပေးနိုင်ပါတယ်။\n\nလုပ်ငန်းအမျိုးအစား, product/service, တင်မယ့် platform နဲ့ video ကြာချိန်ကိုပို့ပေးပါ။ အကောင်းဆုံး concept ကိုတိုတိုရှင်းရှင်းညှိပေးမယ်။"
      : "Yes. If you want to create an ad video, the first step is choosing a hook that grabs attention in the first 3 seconds. Burma AI Studio can help with AI presenter ads, cinematic product ads, or Reels/TikTok short ads depending on your business.\n\nSend your business type, product/service, target platform and duration. I’ll suggest the best concept clearly.";
  }

  if (hasAny(q, ["portfolio", "sample", "example", "နမူနာ", "လက်ရာ", "ပြခန်း"])) {
    return mm
      ? "နမူနာတွေကို Portfolio page မှာကြည့်နိုင်ပါတယ်။ ကြိုက်တဲ့ style တစ်ခုကို reference အဖြစ်ပို့ပေးရင် သင့် product/service နဲ့ကိုက်အောင် concept ပြန်ညှိပေးနိုင်ပါတယ်။\n\nAI presenter style ကြိုက်လား၊ cinematic style ကြိုက်လား?"
      : "You can check the Portfolio page for examples. If you like a style, send it as a reference and we can adapt the concept for your product/service.\n\nDo you prefer AI presenter style or cinematic style?";
  }

  if (hasAny(q, ["contact", "phone", "telegram", "viber", "ဆက်သွယ်", "ဖုန်း", "တယ်လီဂရမ်", "အီးမေးလ်"])) {
    return mm
      ? `Burma AI Studio ကို တိုက်ရိုက်ဆက်သွယ်နိုင်ပါတယ် — ${CONTACT}။\n\nProject idea ကိုပို့လိုက်ရင် video direction နဲ့ quote ကိုပြန်ညှိပေးပါမယ်။`
      : `You can contact Burma AI Studio directly — ${CONTACT}.\n\nSend your project idea and we’ll suggest the video direction and quotation.`;
  }

  return mm
    ? "သင့်မေးခွန်းနဲ့ပတ်သတ်ပြီး Burma AI Studio က AI video direction, script idea, ad format, budget-friendly concept တွေကိုကူညီပေးနိုင်ပါတယ်။\n\nသင့် product/service နဲ့လိုချင်တဲ့ video style ကိုပြောပြပါ။ အကောင်းဆုံး direction ကိုတိုတိုရှင်းရှင်းညှိပေးပါမယ်။"
    : "Burma AI Studio can help with AI video direction, script ideas, ad formats and budget-friendly concepts for your brand.\n\nTell me your product/service and preferred video style, and I’ll suggest the best direction.";
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
        generationConfig: { temperature: 0.68, topP: 0.9, maxOutputTokens: 520 },
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

    const contents: GeminiContent[] = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    if (apiKey) {
      for (const model of GEMINI_MODELS) {
        const reply = await callGemini(model, apiKey, contents);
        if (reply) return jsonReply(reply);
      }
    }

    return jsonReply(fallback(lastQuestion));
  } catch {
    return jsonReply(fallback(""));
  }
}
