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

type GeminiContent = {
  role: "model" | "user";
  parts: Array<{ text: string }>;
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

function hasMyanmar(text: string) {
  return /[\u1000-\u109F]/.test(text);
}

function getLastUserQuestion(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content || "";
}

function fallbackAnswer(question: string) {
  const query = question.toLowerCase();
  const mm = hasMyanmar(question);

  if (query.includes("price") || query.includes("cost") || query.includes("ဈေး") || query.includes("စျေး") || query.includes("ဘယ်လောက်")) {
    return mm
      ? "ဈေးနှုန်းက video ကြာချိန်၊ scene အရေအတွက်၊ style complexity၊ voice/dialogue၊ revision နဲ့ delivery speed ပေါ်မူတည်ပါတယ်။ Quote တိကျချင်ရင် video type, duration, language, platform format, script/reference, deadline နဲ့ brand/product details ကိုပို့ပေးပါ။"
      : "Pricing depends on duration, scene count, style complexity, voice/dialogue, revisions, and delivery speed. For an accurate quote, please send the video type, duration, language, platform format, script/reference, deadline, and brand/product details.";
  }

  if (query.includes("contact") || query.includes("phone") || query.includes("telegram") || query.includes("viber") || query.includes("ဆက်သွယ်") || query.includes("ဖုန်း")) {
    return mm
      ? "Burma AI Studio ကို Email: okaung717@gmail.com, Phone: 09671010011, Telegram/Viber: +95 9 671 010 011, Facebook: Burma Ai Studio ကနေဆက်သွယ်နိုင်ပါတယ်။"
      : "You can contact Burma AI Studio by Email: okaung717@gmail.com, Phone: 09671010011, Telegram/Viber: +95 9 671 010 011, or Facebook: Burma Ai Studio.";
  }

  if (query.includes("portfolio") || query.includes("example") || query.includes("sample") || query.includes("နမူနာ") || query.includes("လက်ရာ")) {
    return mm
      ? "Portfolio page မှာ cinematic trailers, architecture AI videos, cinematic commercial videos နဲ့ virtual presenter campaign နမူနာတွေကြည့်နိုင်ပါတယ်။"
      : "You can view examples on the Portfolio page, including cinematic trailers, architecture AI videos, cinematic commercial videos, and virtual presenter campaigns.";
  }

  if (query.includes("delivery") || query.includes("fast") || query.includes("time") || query.includes("ကြာ") || query.includes("မြန်")) {
    return mm
      ? "Suitable project များအတွက် 48-hour fast delivery ရနိုင်ပါတယ်။ Complex cinematic scenes များတာ၊ revision များတာဆိုရင် အချိန်ပိုလိုနိုင်ပါတယ်။"
      : "Fast delivery may be available for suitable projects, including around 48 hours. Complex scenes or heavier revisions may take longer.";
  }

  if (query.includes("process") || query.includes("start") || query.includes("order") || query.includes("ဘယ်လိုစ") || query.includes("မှာယူ")) {
    return mm
      ? "လုပ်ငန်းစဉ်က idea/business goal ပို့ခြင်း၊ reference/brand details ပို့ခြင်း၊ creative direction နဲ့ quote ပြန်ပေးခြင်း၊ confirm ပြီး production စခြင်း၊ preview/revision ပြီး final video ပေးပို့ခြင်း ဖြစ်ပါတယ်။"
      : "The process is: send your idea/business goal, share references and brand details, receive creative direction and a quote, confirm production, review/revise, then receive the final video.";
  }

  return mm
    ? "Burma AI Studio က AI promotional video, cinematic brand commercial, AI presenter video, TikTok/Reels/Shorts content, architecture/product animation concept, script support, prompt direction နဲ့ creative editing တွေဖန်တီးပေးပါတယ်။ သင့် project အတွက် video type, duration, style နဲ့ deadline ကိုပြောပြပါ။"
    : "Burma AI Studio creates AI promotional videos, cinematic brand commercials, AI presenter videos, TikTok/Reels/Shorts content, architecture/product animation concepts, script support, prompt direction, and creative editing. Share your video type, duration, style, and deadline to get the best recommendation.";
}

export async function POST(request: Request) {
  try {
    const messages: ChatMessage[] = await getMessages(request);

    if (messages.length === 0) {
      return jsonReply("Please send a message first.", 400);
    }

    const lastQuestion = getLastUserQuestion(messages);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return jsonReply(fallbackAnswer(lastQuestion));
    }

    const contents: GeminiContent[] = messages.map((message: ChatMessage) => ({
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
      console.warn("Gemini API unavailable:", data?.error?.message || response.statusText);
      return jsonReply(fallbackAnswer(lastQuestion));
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || fallbackAnswer(lastQuestion);

    return jsonReply(reply);
  } catch (error) {
    console.error("Chat route fallback used:", error);
    return jsonReply(
      "Burma AI Studio က AI promotional video, cinematic brand commercial, AI presenter video, social media short video နဲ့ creative editing တွေဖန်တီးပေးပါတယ်။ Project အသေးစိတ်အတွက် Contact page ကနေတိုက်ရိုက်ဆက်သွယ်နိုင်ပါတယ်။"
    );
  }
}
