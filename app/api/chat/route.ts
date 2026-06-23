export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role?: "assistant" | "user"; content?: string };
type GeminiData = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };

type GeminiContent = { role: "model" | "user"; parts: Array<{ text: string }> };

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
const CONTACT = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011";

const SYSTEM_TEXT = `
You are Burma AI Studio's official AI assistant.
Act like a warm, polite, smart human customer-service consultant.
Do not behave like a fixed FAQ bot. Think about the user's exact message and answer naturally.

Language rules:
- English-only input means English reply.
- Burmese input means Burmese reply.
- Mixed Burmese-English input means Burmese reply.

Conversation behavior:
- If the user greets you, warmly welcome them to Burma AI Studio. Do not say “ask only website-related questions” during greeting.
- If the user asks what you can do, explain services clearly and ask one helpful follow-up question.
- If the user asks about any part of the website, guide them accurately to the right page, button, or action.
- If the user asks about a real video project, identify their business type, infer the likely goal, suggest a practical video direction, then ask for the next missing detail.
- If the user is vague, do not repeat a template. Ask 1 or 2 useful questions.
- If the user asks unrelated topics for the first time, reply gently that you may not be the best assistant for that topic, then naturally guide back to AI video help.
- If unrelated topics repeat, thank the user politely, close that topic gracefully, and give a short call to action.
- If the user jokes casually, respond politely with a light friendly tone, then continue the project conversation.
- Never be rude. Never sound strict.
- Avoid one-sentence replies. Give 2 short natural paragraphs when possible.
- Keep answers concise, useful, and complete.
- Never stop mid-sentence.

Website and service knowledge:
- Home: Burma AI Studio is an AI video creation service for brands and businesses. The promise is high-quality and affordable promotional videos powered by advanced AI, with cinematic narratives that help a brand stand out.
- Get Started: guide users to share their project details or contact the team.
- Watch Examples: guide users to the Portfolio page.
- Services: AI presenter videos, cinematic brand commercials, product ads, music promos, hotel ads, restaurant/bar/cafe ads, Reels/TikTok short videos, YouTube Shorts, script ideas, concept direction, voice/dialogue planning, and creative video direction.
- Portfolio: users can review sample videos and choose a reference style. Ask which sample style they like.
- Contact: Email, Telegram, Viber, or phone. Use the contact details below.
- Pricing: never invent a fixed price. Price depends on duration, scene count, voice/dialogue, presenter or character, realism level, deadline, and revisions. Ask for product/service, platform, duration, reference style, and deadline before quotation.
- Delivery: delivery time depends on project complexity, duration, revisions, and asset readiness. Ask for deadline and scope.
- Revisions: revisions depend on the agreed package and project scope. Ask what they want to adjust.
- Project intake: business type, product/service, platform, duration, target audience, reference style, deadline, and whether they need voice/script.
- Hotel projects: 15-30s cinematic TikTok/Reels video with lobby, room, guest experience, service highlights, location, and booking CTA.
- Restaurant/bar/cafe projects: night ambience, food/drink close-ups, customer mood, offer, and location/contact CTA.
- Product/online shop projects: product close-ups, benefit, trust point, offer/price, and order CTA.
- Music projects: song teaser, artist promo, lyric-style short, or cinematic mood video.
- Admin monitored: the chatbot is monitored by admin, and manual replies may be sent by the team.
- Burmese tone: sound like a polite female customer-service assistant. Use polite endings such as “ရှင့်”, “နော်”, and “ပါ”.

Contact:
${CONTACT}
`;

function hasMyanmar(text: string) {
  return /[\u1000-\u109F]/.test(text);
}

function hasAny(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function isMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as ChatMessage;
  return (message.role === "assistant" || message.role === "user") && typeof message.content === "string";
}

function fallback(text: string) {
  const mm = hasMyanmar(text);

  if (hasAny(text, ["what can", "what do", "ဘာလုပ်", "ဘာတွေ", "ကူညီ", "ဘယ်လိုလုပ်", "service"])) {
    return mm
      ? "Burma AI Studio မှာ AI presenter video, cinematic ad, product ad, music promo, hotel/restaurant ads, Reels/TikTok short video, script idea, portfolio guidance, quotation နဲ့ delivery/revision အကြောင်းတွေကို ကူညီပေးနိုင်ပါတယ်ရှင့်။\n\nသင့်လုပ်ငန်းအမျိုးအစား၊ တင်မယ့် platform၊ video ကြာချိန်နဲ့လိုချင်တဲ့ style ကိုပြောပြပါနော်။ အကောင်းဆုံး video direction ကိုညှိပေးပါမယ်။"
      : "Burma AI Studio can help with AI presenter videos, cinematic ads, product ads, music promos, hotel/restaurant ads, Reels/TikTok shorts, script ideas, portfolio guidance, quotation, delivery, and revisions.\n\nTell me your business type, target platform, video duration, and preferred style. I’ll suggest the best direction.";
  }

  if (hasAny(text, ["price", "cost", "how much", "budget", "ဈေး", "စျေး", "ဘယ်လောက်", "quote"])) {
    return mm
      ? "ဈေးနှုန်းက video ကြာချိန်၊ scene အရေအတွက်၊ voice/dialogue၊ presenter/character၊ realism level၊ deadline နဲ့ revision ပေါ်မူတည်ပါတယ်ရှင့်။ Fixed price မပြောခင် project detail သိရင် ပိုမှန်တဲ့ quote ပေးနိုင်ပါတယ်။\n\nProduct/service, platform, duration, reference style နဲ့ deadline ကိုပို့ပေးပါနော်။ သင့် budget နဲ့ကိုက်အောင် option ညှိပေးပါမယ်။"
      : "Pricing depends on duration, scene count, voice/dialogue, presenter or character, realism level, deadline, and revisions. A proper quote is more accurate after seeing the project details.\n\nSend your product/service, platform, duration, reference style, and deadline. I’ll suggest an option that fits your budget.";
  }

  if (hasAny(text, ["portfolio", "sample", "example", "နမူနာ", "လက်ရာ", "ပြခန်း", "watch"])) {
    return mm
      ? "နမူနာ video တွေကို Portfolio page မှာကြည့်နိုင်ပါတယ်ရှင့်။ ကြိုက်တဲ့ style တစ်ခုကို reference အဖြစ်ရွေးပေးရင် သင့် project နဲ့ကိုက်အောင် concept ပြန်ညှိပေးနိုင်ပါတယ်။\n\nAI presenter style ကြိုက်လား၊ cinematic product ad style ကြိုက်လား ပြောပြပါနော်။"
      : "You can check sample videos on the Portfolio page. If you pick a style you like, I can adapt the concept for your project.\n\nDo you prefer AI presenter style or cinematic product-ad style?";
  }

  if (hasAny(text, ["contact", "phone", "telegram", "viber", "email", "ဆက်သွယ်", "ဖုန်း", "တယ်လီဂရမ်"])) {
    return mm
      ? `တိုက်ရိုက်ဆက်သွယ်နိုင်ပါတယ်ရှင့် — ${CONTACT}။\n\nProject idea, reference video, duration နဲ့ platform ပို့ပေးရင် video direction နဲ့ quote ကိုပြန်ညှိပေးပါမယ်။`
      : `You can contact Burma AI Studio directly — ${CONTACT}.\n\nSend your project idea, reference video, duration, and platform, and we’ll suggest the video direction and quote.`;
  }

  if (hasAny(text, ["hotel", "room", "booking", "resort", "ဟိုတယ်", "အခန်း", "ဧည့်"])) {
    return mm
      ? "Hotel ကြော်ငြာအတွက် TikTok/Reels 30s cinematic video ဆိုရင် lobby, room, guest experience, service highlight, location နဲ့ booking CTA ပါတဲ့ structure ကအထိရောက်ဆုံးပါရှင့်။ ပထမ ၃ စက္ကန့်မှာ hotel vibe ကိုဖမ်းနိုင်တဲ့ hook ထည့်သင့်ပါတယ်။\n\nHotel name, location, room type, highlight service နဲ့ reference video ပို့ပေးပါနော်။ 30s concept/script ကိုညှိပေးပါမယ်။"
      : "For a hotel ad, a 30s cinematic TikTok/Reels video should show the lobby, rooms, guest experience, service highlights, location, and a booking CTA. The first 3 seconds should hook viewers with the hotel vibe.\n\nSend the hotel name, location, room type, key service, and reference video. I’ll suggest a 30s concept/script.";
  }

  return mm
    ? "မင်္ဂလာပါရှင့်။ Burma AI Studio မှကြိုဆိုပါတယ်။ သင့် brand အတွက် AI video ကြော်ငြာ၊ cinematic ad၊ product ad၊ Reels/TikTok short video၊ script idea နဲ့ portfolio guidance တွေကို ကူညီပေးနိုင်ပါတယ်ရှင့်။\n\nသင့်လုပ်ငန်းအမျိုးအစား၊ product/service၊ platform၊ duration နဲ့လိုချင်တဲ့ style ကိုပြောပြပါနော်။ အကောင်းဆုံး next step ကိုညှိပေးပါမယ်။"
    : "Welcome to Burma AI Studio. I can help your brand with AI video ads, cinematic ads, product ads, Reels/TikTok shorts, script ideas, and portfolio guidance.\n\nTell me your business type, product/service, platform, duration, and preferred style. I’ll suggest the best next step.";
}

async function callGemini(
  model: string,
  apiKey: string,
  contents: Array<{ role: string; parts: Array<{ text: string }> }>,
  question: string
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_TEXT }] },
          contents,
          generationConfig: {
            temperature: 0.86,
            topP: 0.95,
            maxOutputTokens: 900,
          },
        }),
      }
    );

    const data = (await response.json().catch(() => null)) as GeminiData | null;
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("\n")
      .trim();

    const clean = response.ok && text ? text.replace(/\n{3,}/g, "\n\n").trim() : "";
    return clean || fallback(question);
  } catch {
    return fallback(question);
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { messages?: unknown } | null;
  const messages = Array.isArray(body?.messages)
    ? body.messages.filter(isMessage).slice(-12)
    : [];

  const question =
    [...messages].reverse().find((message) => message.role === "user")?.content?.trim() || "";

  if (!question) {
    return Response.json({ reply: "Please send a message first." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ reply: fallback(question), source: "fallback_no_key" });
  }

  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content || "" }],
  }));

  for (const model of MODELS) {
    const answer = await callGemini(model, apiKey, contents, question);
    if (answer) {
      return Response.json({ reply: answer, source: "gemini", model });
    }
  }

  return Response.json({ reply: fallback(question), source: "fallback" });
}
