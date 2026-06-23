export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role?: "assistant" | "user"; content?: string };
type GeminiData = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };

type GeminiContent = { role: "model" | "user"; parts: Array<{ text: string }> };

const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];
const CONTACT = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011";

const SYSTEM_TEXT = `
You are Burma AI Studio's AI assistant.
Act like a warm, polite, human customer service assistant.
Do not use fixed template answers.
You can have natural back-and-forth conversation.

Language rules:
- English-only input means English reply.
- Burmese input means Burmese reply.
- Mixed Burmese-English input means Burmese reply.

Behavior:
- If the user greets you, warmly welcome them to Burma AI Studio. Do not say “ask only website-related questions” during greeting.
- If the user asks what you can do, explain Burma AI Studio services clearly.
- If the user asks about any part of the website, guide them accurately to the right page or action.
- If the user asks about a real video project, understand the business type and suggest a useful video direction.
- If the user asks unrelated topics for the first time, answer gently that you may not be best for that topic, then naturally guide back to AI video service.
- If unrelated topics repeat, thank the user politely and give a short call to action.
- If the user jokes casually, respond politely with a light friendly tone, then continue the conversation.
- Never be rude.
- Keep replies short, natural, and complete.
- Never stop mid-sentence.

Burma AI Studio website knowledge:
- Home: introduces Burma AI Studio as an AI video creation service for brands and businesses. Main promise: high-quality, affordable promotional videos powered by advanced AI, with cinematic narratives that make a brand stand out.
- Main buttons: “Get Started” should guide users to contact or send project details. “Watch Examples” should guide users to the Portfolio page.
- Services: Burma AI Studio can help with AI presenter videos, cinematic brand commercials, product ads, music promos, hotel ads, restaurant/bar/cafe ads, Reels/TikTok short videos, YouTube Shorts, script ideas, concept direction, voice/dialogue planning, and creative video direction.
- Portfolio: users can review sample videos and choose a reference style. If they mention samples, examples, previous work, or portfolio, guide them to the Portfolio page and ask which style they like.
- Contact: users can contact directly by Email, Telegram, Viber, or phone. Use the contact details below when needed.
- Pricing: never give a fake fixed price. Explain that price depends on duration, scene count, voice/dialogue, presenter or character, realism level, deadline, and revisions. Ask for product/service, platform, duration, reference style, and deadline before quotation.
- Delivery: delivery time depends on project complexity, duration, revisions, and asset readiness. Ask for deadline and project scope.
- Revisions: revisions depend on the agreed package and project scope. Ask what they want to adjust.
- Project intake: when a user wants to create a video, ask for business type, product/service, target platform, video duration, target audience, reference style, deadline, and whether they need voice/script.
- Hotel projects: suggest a 15-30s cinematic TikTok/Reels video with lobby, room, guest experience, service highlights, location, and booking CTA.
- Restaurant/bar/cafe projects: suggest night ambience, food/drink close-ups, customer mood, offer, and location/contact CTA.
- Product/online shop projects: suggest product close-ups, benefit, trust point, offer/price, order CTA.
- Music projects: suggest song teaser, artist promo, lyric-style short, or cinematic mood video.
- Admin monitored: the chatbot is monitored by admin, and manual replies may be sent by the team.
- Tone: sound like a polite female customer-service assistant. Use Burmese polite endings such as “ရှင့်”, “နော်”, and “ပါ” when replying in Burmese.

Contact:
${CONTACT}
`;

function hasMyanmar(text: string) {
  return /[\u1000-\u109F]/.test(text);
}

function isMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as ChatMessage;
  return (message.role === "assistant" || message.role === "user") && typeof message.content === "string";
}

function fallback(text: string) {
  return hasMyanmar(text)
    ? "မင်္ဂလာပါရှင့်။ Burma AI Studio မှကြိုဆိုပါတယ်။ သင့် video project အကြောင်းပြောပြပါနော်။"
    : "Hello, welcome to Burma AI Studio. Tell me about your video project.";
}

async function callGemini(
  model: string,
  apiKey: string,
  contents: Array<{ role: string; parts: Array<{ text: string }> }>
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

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
            temperature: 0.82,
            topP: 0.95,
            maxOutputTokens: 720,
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
    return Response.json({ reply: fallback(question) });
  }

  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content || "" }],
  }));

  for (const model of MODELS) {
    const answer = await callGemini(model, apiKey, contents);
    if (answer) {
      return Response.json({ reply: answer });
    }
  }

  return Response.json({ reply: fallback(question) });
}
