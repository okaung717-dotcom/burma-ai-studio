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

const CONTACT_TEXT_MM = "ဆက်သွယ်ရန် — Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011 | Facebook: Burma Ai Studio";
const CONTACT_TEXT_EN = "Contact — Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011 | Facebook: Burma Ai Studio";

const BUSINESS_CONTEXT = `You are the official AI assistant for Burma AI Studio.
Answer in the same language as the visitor: English or Burmese.
Burma AI Studio creates AI promotional videos, cinematic brand commercials, AI presenter videos, TikTok/Reels/Shorts videos, architecture/product animation concepts, product/service ads, brand storytelling videos, script support, prompt direction, and creative editing.
Target clients include business owners, new brands, online shops, service providers, creators, and anyone who wants a professional promotional video without expensive traditional filming.
Pricing depends on the client's desired style, duration, scene count, character count, voice/dialogue, revisions, deadline, and complexity. Do not invent exact prices. Ask for the project idea and suggest contacting Burma AI Studio directly for a quote.
When users ask pricing in Burmese, explain that the final price can be confirmed only after understanding the style they want to create and that Burma AI Studio can combine their ideas with a suitable creative direction.
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

function includesAny(query: string, words: string[]) {
  return words.some((word) => query.includes(word));
}

function getLastUserQuestion(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content || "";
}

function fallbackAnswer(question: string) {
  const query = question.toLowerCase();
  const mm = hasMyanmar(question);

  if (includesAny(query, ["price", "pricing", "cost", "fee", "charge", "rate", "budget", "package", "how much", "one video", "per video", "ဈေး", "စျေး", "ဘယ်လောက်", "တစ်ခု", "တစ်ပုဒ်", "တစ်ဗီဒီယို", "ကုန်ကျ"])) {
    return mm
      ? `လူကြီးမင်းတို့ ဖန်တီးချင်တဲ့ video ပုံစံ၊ ကြာချိန်၊ scene အရေအတွက်၊ စကားပြော/voice ပါမပါ၊ character ပါမပါ၊ deadline နဲ့ revision လိုအပ်ချက်တွေ သိရမှ ဈေးနှုန်းကို တိတိကျကျသတ်မှတ်ပေးလို့ရပါတယ်။

လူကြီးမင်းတို့ရဲ့ စိတ်ကူးတွေကို Burma AI Studio ရဲ့ creative direction နဲ့ပေါင်းစပ်ပြီး Brand နဲ့အလိုက်ဖက်ဆုံး AI Video ပုံစံကို အကြံပြုပေးနိုင်ပါတယ်။

စိတ်ဝင်စားရင် အောက်က direct contact တွေကနေ project idea ကိုပို့ပြီး ဈေးစကားတိုက်ရိုက်ပြောနိုင်ပါတယ်။
${CONTACT_TEXT_MM}`
      : `The final price depends on the video style you want, duration, number of scenes, characters, voice/dialogue, deadline, and revision needs.

Share your idea with Burma AI Studio and we can combine your concept with the right creative direction, then suggest the best format and quote.

If you are interested, contact us directly and send your project idea:
${CONTACT_TEXT_EN}`;
  }

  if (includesAny(query, ["contact", "phone", "telegram", "viber", "email", "facebook", "ဆက်သွယ်", "ဖုန်း", "အီးမေး", "တယ်လီ", "ဗိုက်ဘာ", "ဘယ်လိုဆက်"])) {
    return mm
      ? `Burma AI Studio ကို အောက်ပါလမ်းကြောင်းတွေကနေ တိုက်ရိုက်ဆက်သွယ်နိုင်ပါတယ်။

${CONTACT_TEXT_MM}

Telegram/Viber ကနေ project idea, reference video, duration, deadline တွေပို့ပေးရင် quotation ကိုပိုမြန်မြန်တွက်ပေးနိုင်ပါတယ်။`
      : `You can contact Burma AI Studio directly here:

${CONTACT_TEXT_EN}

For a faster quote, send your project idea, reference video, duration, platform format, and deadline by Telegram or Viber.`;
  }

  if (includesAny(query, ["service", "services", "what do you", "ဘာလုပ်", "ဘာတွေ", "ဝန်ဆောင်", "လုပ်ပေး", "video type", "အမျိုးအစား"])) {
    return mm
      ? "Burma AI Studio မှာ AI promotional video, cinematic brand commercial, AI presenter video, TikTok/Reels/Shorts content, product/service advertising video, architecture/product animation concept, script support, prompt direction နဲ့ creative editing ဝန်ဆောင်မှုတွေ ရနိုင်ပါတယ်။ လုပ်ငန်းအသစ်တွေ Brand ကြော်ငြာချင်ရင်လည်း အဆင်ပြေပါတယ်။"
      : "Burma AI Studio offers AI promotional videos, cinematic brand commercials, AI presenter videos, TikTok/Reels/Shorts content, product/service ad videos, architecture/product animation concepts, script support, prompt direction, and creative editing. It is suitable for new brands, businesses, online shops, and creators.";
  }

  if (includesAny(query, ["process", "start", "order", "how to", "ဘယ်လိုစ", "မှာယူ", "လုပ်ငန်းစဉ်", "စလုပ်"])) {
    return mm
      ? "လုပ်ငန်းစဉ်က ရိုးရှင်းပါတယ် — ၁) သင့် product/service idea ပို့ပါ၊ ၂) reference video/brand info/duration/deadline ပို့ပါ၊ ၃) Burma AI Studio က creative direction နဲ့ quote ပြန်ပေးပါမယ်၊ ၄) confirm ပြီး production စပါမယ်၊ ၅) preview ကြည့်ပြီး revision ပြောနိုင်ပါတယ်၊ ၆) final video ပေးပို့ပါမယ်။"
      : "The process is simple: 1) send your product/service idea, 2) share references, brand info, duration, and deadline, 3) Burma AI Studio suggests the creative direction and quote, 4) production starts after confirmation, 5) you review and request revisions, 6) final video is delivered.";
  }

  if (includesAny(query, ["delivery", "fast", "time", "deadline", "ဘယ်လောက်ကြာ", "ကြာ", "မြန်", "အချိန်"])) {
    return mm
      ? "Simple project များအတွက် 48-hour fast delivery ရနိုင်ပါတယ်။ ဒါပေမယ့် cinematic scene များတာ၊ character များတာ၊ voice/dialogue များတာ၊ revision များတာဆိုရင် အချိန်ပိုလိုနိုင်ပါတယ်။ Deadline အရေးကြီးရင် project မစခင် ကြိုပြောပေးပါ။"
      : "Fast delivery may be available for suitable simple projects, including around 48 hours. Complex cinematic scenes, multiple characters, voice/dialogue work, or heavier revisions may take longer. Please share your deadline before production starts.";
  }

  if (includesAny(query, ["portfolio", "example", "sample", "work", "နမူနာ", "လက်ရာ", "ပြခန်း", "ကြည့်"])) {
    return mm
      ? "နမူနာလက်ရာတွေကို Portfolio page မှာကြည့်နိုင်ပါတယ်။ Cinematic trailer, architecture AI video, commercial video, virtual presenter campaign နဲ့ social media short video sample တွေပါဝင်ပါတယ်။"
      : "You can view sample works on the Portfolio page, including cinematic trailers, architecture AI videos, commercial videos, virtual presenter campaigns, and social media short video examples.";
  }

  if (includesAny(query, ["revision", "edit", "change", "ပြင်", "ပြင်ဆင်", "ပြောင်း", "မကြိုက်"])) {
    return mm
      ? "Revision က package/quotation ပေါ်မူတည်ပါတယ်။ ပုံမှန်အားဖြင့် text, pacing, scene selection, color/tone, presentation style ပြင်ဆင်မှုတွေပါနိုင်ပါတယ်။ Concept သို့မဟုတ် script ကိုလုံးဝပြောင်းချင်တာဆိုရင် new work အဖြစ်သတ်မှတ်နိုင်ပါတယ်။"
      : "Revisions depend on the agreed package or quote. Normal revisions may include text, pacing, scene selection, color/tone, and presentation style adjustments. A full concept or script change may count as new work.";
  }

  if (includesAny(query, ["format", "size", "tiktok", "reels", "shorts", "facebook", "youtube", "ratio", "ပုံစံ", "ဆိုဒ်", "အရွယ်", "ဖော်မက်"])) {
    return mm
      ? "Social media အတွက် 9:16 vertical TikTok/Reels/Shorts format, Facebook post/video format, YouTube Shorts format, 16:9 landscape commercial format စတာတွေကို project လိုအပ်ချက်အတိုင်းဖန်တီးပေးနိုင်ပါတယ်။ Platform ဘယ်မှာတင်မလဲဆိုတာပြောပေးရင် format ကိုသေချာညှိပေးနိုင်ပါတယ်။"
      : "We can create formats for 9:16 TikTok/Reels/Shorts, Facebook videos, YouTube Shorts, and 16:9 landscape commercial videos. Tell us the platform and we will suggest the best format.";
  }

  return mm
    ? `Burma AI Studio က လုပ်ငန်းရှင်များ၊ brand အသစ်များ၊ online shop များနဲ့ creator များအတွက် AI video creation service ဖြစ်ပါတယ်။ Product/service ကြော်ငြာဗီဒီယို၊ AI presenter video၊ cinematic commercial၊ social media short video နဲ့ creative editing တွေကို ဖန်တီးပေးနိုင်ပါတယ်။

သင့် project ကိုအကောင်းဆုံးအကြံပြုပေးနိုင်ဖို့ video type, duration, style, deadline နဲ့ reference ရှိရင်ပို့ပေးပါ။
${CONTACT_TEXT_MM}`
    : `Burma AI Studio is an AI video creation service for businesses, new brands, online shops, and creators. We create product/service ads, AI presenter videos, cinematic commercials, social media short videos, and creative edits.

To recommend the best direction, please share your video type, duration, style, deadline, and any reference.
${CONTACT_TEXT_EN}`;
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
    return jsonReply(fallbackAnswer("ဘာဝန်ဆောင်မှုတွေလုပ်ပေးလဲ"));
  }
}
