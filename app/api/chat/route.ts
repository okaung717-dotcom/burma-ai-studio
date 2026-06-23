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

function compact(text: string) {
  const cleaned = text.replace(/\n{3,}/g, "\n\n").trim();
  if (cleaned.length <= 460) return cleaned;
  return cleaned.slice(0, 460).replace(/\s+\S*$/, "") + "...";
}

function fallback(question: string) {
  return hasMyanmar(question)
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
