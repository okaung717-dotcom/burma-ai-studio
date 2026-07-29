export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role?: "assistant" | "user"; content?: string };
type ChatRequest = { messages?: unknown; account?: unknown };
type GeminiData = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
type GeminiContent = { role: "model" | "user"; parts: Array<{ text: string }> };
type GenerationOptions = { temperature?: number; maxOutputTokens?: number };

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
const CONTACT = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011";

const SYSTEM_TEXT = `
You are Burma AI Studio's official AI assistant.
Act like a warm, polite, smart human customer-service consultant.
Do not behave like a fixed FAQ bot. Think about the user's exact message and answer naturally.

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
- Navigation: Home explains the brand promise, Services explains what can be created, Portfolio shows example videos, and Chat lets users discuss a project directly.
- Services: AI presenter videos, cinematic brand commercials, product ads, music promos, hotel ads, restaurant/bar/cafe ads, Reels/TikTok short videos, YouTube Shorts, script ideas, concept direction, voice/dialogue planning, and creative video direction.
- Portfolio: users can review sample videos and choose a reference style. Ask which sample style they like.
- Contact: Email, Telegram, Viber, or phone. Use the contact details below.
- Pricing: never invent a fixed price. Price depends on duration, scene count, voice/dialogue, presenter or character, realism level, deadline, and revisions. Ask for product/service, platform, duration, reference style, and deadline before quotation.
- Delivery: delivery time depends on project complexity, duration, revisions, and asset readiness. Ask for deadline and scope.
- Revisions: revisions depend on the agreed package and project scope. Ask what they want to adjust.
- Project intake: business type, product/service, platform, duration, target audience, reference style, deadline, and whether they need voice/script.
- Hotel projects: 15–30s cinematic TikTok/Reels video with lobby, room, guest experience, service highlights, location, and booking CTA.
- Restaurant/bar/cafe projects: night ambience, food/drink close-ups, customer mood, offer, and location/contact CTA.
- Product/online shop projects: product close-ups, benefit, trust point, offer/price, and order CTA.
- Music projects: song teaser, artist promo, lyric-style short, or cinematic mood video.
- Admin monitored: the chatbot is monitored by admin, and manual replies may be sent by the team.
- When replying in Burmese, sound like a polite female customer-service assistant and use natural polite endings such as “ရှင့်”, “နော်”, and “ပါ”.

Contact:
${CONTACT}
`;

const WEBSITE_LANGUAGE_POLICY = `
MANDATORY WEBSITE CHAT LANGUAGE POLICY — APPLY ON EVERY TURN:
- Detect the language of the latest user message itself and reply entirely in that same language.
- This applies to every natural language and writing system, including English, Burmese, Thai, Chinese, Japanese, Korean, Arabic, Hindi, Spanish, French, German, Russian, and all others.
- Never choose the reply language from the website interface, account settings, browser locale, or older conversation messages.
- If the latest message mixes languages, use the dominant language used for the actual request. Keep brand names, product names, URLs, numbers, and necessary technical terms unchanged.
- Do not translate the user's message into English or Burmese unless the user explicitly asks for a translation.
- Preserve the user's script and natural regional tone. The answer must feel native and readable in that language.
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

  if (hasAny(text, ["price", "cost", "how much", "budget", "ဈေး", "စျေး", "ဘယ်လောက်", "quote"])) {
    return mm
      ? "ဈေးနှုန်းက video ကြာချိန်၊ scene အရေအတွက်၊ voice/dialogue၊ presenter/character၊ realism level၊ deadline နဲ့ revision ပေါ်မူတည်ပါတယ်ရှင့်။ Product/service, platform, duration, reference style နဲ့ deadline ကိုပို့ပေးပါနော်။"
      : "Pricing depends on duration, scene count, voice/dialogue, presenter or character, realism level, deadline, and revisions. Send your product/service, platform, duration, reference style, and deadline for an accurate quote.";
  }

  if (hasAny(text, ["contact", "phone", "telegram", "viber", "email", "ဆက်သွယ်", "ဖုန်း", "တယ်လီဂရမ်"])) {
    return mm
      ? `တိုက်ရိုက်ဆက်သွယ်နိုင်ပါတယ်ရှင့် — ${CONTACT}။ Project idea, reference video, duration နဲ့ platform ပို့ပေးရင် ဆက်လက်ညှိပေးပါမယ်။`
      : `You can contact Burma AI Studio directly — ${CONTACT}. Send your project idea, reference video, duration, and platform, and we’ll guide you from there.`;
  }

  return mm
    ? "Burma AI Studio မှာ AI presenter video, cinematic ad, product ad, Reels/TikTok short video, script idea နဲ့ creative direction တွေကို ကူညီပေးနိုင်ပါတယ်ရှင့်။ သင့်လုပ်ငန်း၊ platform၊ duration နဲ့လိုချင်တဲ့ style ကိုပြောပြပါနော်။"
    : "Burma AI Studio can help with AI presenter videos, cinematic ads, product ads, Reels/TikTok shorts, script ideas, and creative direction. Tell me your business, platform, duration, and preferred style.";
}

async function callGemini(
  model: string,
  apiKey: string,
  contents: GeminiContent[],
  systemText: string,
  options: GenerationOptions = {}
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 14000);

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
          systemInstruction: { parts: [{ text: systemText }] },
          contents,
          generationConfig: {
            temperature: options.temperature ?? 0.82,
            topP: 0.95,
            maxOutputTokens: options.maxOutputTokens ?? 900,
          },
        }),
      }
    );

    const data = (await response.json().catch(() => null)) as GeminiData | null;
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("\n")
      .trim();

    return response.ok && text ? text.replace(/\n{3,}/g, "\n\n").trim() : "";
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

function sanitizeLanguageName(value: string) {
  return value
    .replace(/[^A-Za-z0-9 ()/.,'’\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

async function detectMessageLanguage(model: string, apiKey: string, question: string) {
  const detectorSystem = `You are a precise language-identification engine. Identify the dominant natural language used for the actual request in the user's latest message. Return only the language name in English, for example: Thai, Burmese, English, Spanish, Japanese, Arabic, Chinese (Traditional). Do not answer the user's question and do not add punctuation or explanation.`;
  const detected = await callGemini(
    model,
    apiKey,
    [{ role: "user", parts: [{ text: question }] }],
    detectorSystem,
    { temperature: 0, maxOutputTokens: 24 }
  );
  return sanitizeLanguageName(detected);
}

async function verifyLanguageMatch(
  model: string,
  apiKey: string,
  question: string,
  answer: string
) {
  const verifierSystem = `You are a strict language-match validator. Compare the user's message and the assistant answer. The answer passes only when it is written primarily in the same natural language as the user's actual request. Ignore brand names, URLs, numbers, contact details, and unavoidable technical terms. For a mixed-language request, accept the dominant language of the request. Reply with exactly PASS or FAIL.`;
  const result = await callGemini(
    model,
    apiKey,
    [
      {
        role: "user",
        parts: [{ text: `USER MESSAGE:\n${question}\n\nASSISTANT ANSWER:\n${answer}` }],
      },
    ],
    verifierSystem,
    { temperature: 0, maxOutputTokens: 8 }
  );
  return result.trim().toUpperCase().startsWith("PASS");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ChatRequest | null;
  const messages = Array.isArray(body?.messages)
    ? body.messages.filter(isMessage).slice(-12)
    : [];

  const question =
    [...messages].reverse().find((message) => message.role === "user")?.content?.trim() || "";

  if (!question) {
    return Response.json({ reply: "Please send a message first." }, { status: 400 });
  }

  const isWebsiteChat = Boolean(body && Object.prototype.hasOwnProperty.call(body, "account"));
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({ reply: fallback(question), source: "fallback_no_key" });
  }

  const contents: GeminiContent[] = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content || "" }],
  }));

  for (const model of MODELS) {
    const detectedLanguage = isWebsiteChat
      ? await detectMessageLanguage(model, apiKey, question)
      : "";

    const languageDirective = isWebsiteChat
      ? `${WEBSITE_LANGUAGE_POLICY}\nThe detected language of the latest user request is: ${detectedLanguage || "the same language used in the latest user message"}. Reply only in that language.`
      : "";

    const systemText = languageDirective
      ? `${SYSTEM_TEXT}\n\n${languageDirective}`
      : SYSTEM_TEXT;

    const answer = await callGemini(model, apiKey, contents, systemText);
    if (!answer) continue;

    if (!isWebsiteChat || (await verifyLanguageMatch(model, apiKey, question, answer))) {
      return Response.json({
        reply: answer,
        source: "gemini",
        model,
        detectedLanguage: detectedLanguage || undefined,
      });
    }

    const correctionSystem = `${SYSTEM_TEXT}\n\n${languageDirective}\n\nLANGUAGE CORRECTION: The previous answer used the wrong language. Answer the latest user message again, entirely in the detected language, without mentioning this correction.`;
    const correctedAnswer = await callGemini(
      model,
      apiKey,
      [{ role: "user", parts: [{ text: question }] }],
      correctionSystem,
      { temperature: 0.55, maxOutputTokens: 900 }
    );

    if (
      correctedAnswer &&
      (await verifyLanguageMatch(model, apiKey, question, correctedAnswer))
    ) {
      return Response.json({
        reply: correctedAnswer,
        source: "gemini_language_corrected",
        model,
        detectedLanguage: detectedLanguage || undefined,
      });
    }
  }

  return Response.json({ reply: fallback(question), source: "fallback_all_models_failed" });
}
