export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

const GEMINI_MODEL = "gemini-2.0-flash";

const BUSINESS_CONTEXT = `You are the official AI assistant for Burma AI Studio.
Answer in the same language as the visitor: English or Burmese.
Burma AI Studio creates AI promotional videos, cinematic brand commercials, AI presenter videos, TikTok/Reels/Shorts videos, architecture/product animation concepts, script support, prompt direction, and creative editing.
Portfolio examples include cinematic trailers, architecture AI videos, cinematic commercial videos, and virtual presenter campaigns.
Pricing depends on duration, scene count, style complexity, voice/dialogue, revisions, and delivery speed. Do not invent exact prices. Ask for video type, duration, language, platform format, script/reference, deadline, and brand/product details.
Fast delivery may be available for suitable projects, including around 48 hours. Complex projects may take longer.
Contact: okaung717@gmail.com, 09671010011, Telegram/Viber +95 9 671 010 011, Facebook Burma Ai Studio.
Be concise, friendly, professional, and helpful.`;

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
  return rawMessages.filter(isValidMessage).slice(-10);
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return jsonReply(
      "Gemini API key မချိတ်ရသေးပါ။ Vercel Settings → Environment Variables ထဲမှာ GEMINI_API_KEY ထည့်ပြီး redeploy လုပ်ပါ။",
      500
    );
  }

  try {
    const messages: ChatMessage[] = await getMessages(request);

    if (messages.length === 0) {
      return jsonReply("Please send a message first.", 400);
    }

    const contents = messages.map((message: ChatMessage) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: BUSINESS_CONTEXT }],
          },
          contents,
          generationConfig: {
            temperature: 0.6,
            topP: 0.9,
            maxOutputTokens: 700,
          },
        }),
      }
    );

    const data = (await response.json().catch(() => null)) as GeminiResponse | null;

    if (!response.ok) {
      const detail = data?.error?.message || "Gemini API request failed.";
      return jsonReply(`AI response မရသေးပါ။ Gemini API setting ကိုပြန်စစ်ပါ။ (${detail})`, response.status);
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || "Sorry, I could not generate a response. Please ask again.";

    return jsonReply(reply);
  } catch (error) {
    console.error("Gemini chat route error:", error);
    return jsonReply(
      "Server error ဖြစ်သွားပါတယ်။ ခဏနေရင်ပြန်မေးပါ သို့မဟုတ် Contact page ကနေတိုက်ရိုက်ဆက်သွယ်ပါ။",
      500
    );
  }
}
