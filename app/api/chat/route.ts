export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "assistant" | "user"; content: string };
type GeminiResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
type GeminiContent = { role: "model" | "user"; parts: Array<{ text: string }> };

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.5-flash"];
const CONTACT_MM = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011 | Facebook: Burma Ai Studio";
const CONTACT_EN = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011 | Facebook: Burma Ai Studio";

const SYSTEM_PROMPT = `You are the official AI sales consultant for Burma AI Studio.
Speak like a warm, experienced human creative consultant, not a short generic bot.
Reply in the same language as the visitor. If Burmese, use natural Burmese.
For most answers, write 3 to 6 short paragraphs. Do not give tiny answers unless the visitor asks for short.
Always answer, then suggest a suitable Burma AI Studio service, then ask one useful follow-up question.
If the visitor is vague or asks something not directly available, guide them toward video ideas, services, portfolio, quotation, or direct contact.
Do not invent exact fixed prices. Explain that quote depends on duration, scene count, presenter/character count, voice/dialogue, realism, deadline, revisions and complexity.

Burma AI Studio services: AI promotional videos, cinematic brand commercials, AI presenter videos, TikTok/Reels/Shorts ads, product showcase videos, service explainer videos, brand storytelling videos, architecture/product animation concepts, script support, storyboard direction, prompt direction and creative editing.
Good clients: online shops, restaurants, beauty clinics, real estate pages, education pages, local services, creators, personal brands and new businesses that want promotion without expensive traditional filming.
Process: ask for product/service, platform, duration, style/reference, language, deadline and budget range. Then suggest creative direction and invite contact.
Contact: ${CONTACT_EN}`;

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
  return rawMessages.filter(isValidMessage).slice(-14);
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

function contactLine(mm: boolean) {
  return mm ? `တိုက်ရိုက်ဆက်သွယ်ရန် — ${CONTACT_MM}` : `Direct contact — ${CONTACT_EN}`;
}

function quoteQuestion(mm: boolean) {
  return mm
    ? "Quotation တိတိကျကျတွက်ပေးနိုင်ဖို့ product/service, တင်မယ့် platform, video ကြာချိန်, reference style နဲ့ deadline ကိုပြောပြပေးပါ။"
    : "To quote properly, please share your product/service, platform, duration, reference style and deadline.";
}

function naturalFallback(question: string) {
  const query = question.toLowerCase();
  const mm = hasMyanmar(question);

  if (includesAny(query, ["price", "pricing", "cost", "fee", "charge", "budget", "package", "how much", "ဈေး", "စျေး", "ဘယ်လောက်", "ကုန်ကျ", "ပက်ကေ့"])) {
    return mm
      ? `ဈေးနှုန်းက video style နဲ့ production complexity ပေါ်မူတည်ပါတယ်။ AI presenter video, cinematic brand commercial, product ad, TikTok/Reels short video တို့က scene အရေအတွက်၊ ကြာချိန်၊ voice/dialogue၊ character ပါမပါ၊ realism level၊ deadline နဲ့ revision လိုအပ်ချက်တွေမတူလို့ fixed price တစ်ခုတည်းနဲ့မပြောတာပိုမှန်ပါတယ်။

Burma AI Studio အနေနဲ့ လူကြီးမင်းရဲ့ budget နဲ့ brand goal ကိုကြည့်ပြီး အကုန်အကျမများဘဲ customer ကိုဖမ်းနိုင်မယ့် video direction ကိုရွေးပေးနိုင်ပါတယ်။ လုပ်ငန်းအသစ်ဆိုရင် 15-30 seconds social media ad နဲ့စတာက အမြန်ဆုံး result မြင်ရတတ်ပါတယ်။

${quoteQuestion(true)}
${contactLine(true)}`
      : `Pricing depends on video style and complexity. AI presenter videos, cinematic commercials, product ads and TikTok/Reels shorts need different scene counts, duration, voice/dialogue, characters, realism, deadlines and revisions.

Burma AI Studio can help choose a cost-effective direction based on your budget and brand goal. For many new businesses, a 15-30 second social media ad is the fastest practical starting point.

${quoteQuestion(false)}
${contactLine(false)}`;
  }

  if (includesAny(query, ["service", "services", "ဘာလုပ်", "ဘာတွေ", "ဝန်ဆောင်", "လုပ်ပေး", "video type", "အမျိုးအစား", "ai video", "ကြော်ငြာ"])) {
    return mm
      ? `Burma AI Studio က လုပ်ငန်းရှင်တွေ Brand ကြော်ငြာချင်တဲ့အခါ ရိုက်ကူးရေးစရိတ်ကြီးမားတာကိုလျှော့ချပြီး professional AI video content ဖန်တီးပေးတဲ့ service ပါ။

လုပ်ပေးနိုင်တာတွေက AI presenter video, cinematic commercial, product/service ad, TikTok/Reels/Shorts video, brand storytelling video, architecture/product animation concept, script idea, storyboard direction နဲ့ creative editing တွေပါ။ Online shop, restaurant, beauty clinic, real estate, education page, service business, personal brand တွေအတွက်လည်းအသုံးဝင်ပါတယ်။

သင့်လုပ်ငန်းက ဘာအမျိုးအစားလဲ ပြောပြရင် ဘယ် video type နဲ့စသင့်လဲကို တိတိကျကျအကြံပေးနိုင်ပါတယ်။`
      : `Burma AI Studio creates AI-powered promotional videos for businesses that want professional content without the heavy cost and hassle of traditional filming.

We help with AI presenter videos, cinematic commercials, product/service ads, TikTok/Reels/Shorts videos, brand storytelling, architecture/product animation concepts, script ideas, storyboard direction and creative editing.

Tell me your business type, and I can suggest the best video direction to start with.`;
  }

  if (includesAny(query, ["script", "idea", "concept", "caption", "music", "ads", "စာသား", "အကြံ", "စိတ်ကူး", "ဇာတ်ညွှန်း", "ကြော်ငြာစာ"])) {
    return mm
      ? `ရပါတယ်။ Burma AI Studio က video ဖန်တီးပေးရုံမက script idea, hook line, scene direction, presenter dialogue နဲ့ call-to-action စာသားတွေပါကူညီပေးနိုင်ပါတယ်။ ကြော်ငြာ video တစ်ခုက ရုပ်ထွက်လှတာတစ်ခုတည်းမဟုတ်ဘဲ ပထမ ၃ စက္ကန့်မှာ customer ကိုဖမ်းနိုင်တဲ့ hook, problem, solution, trust point နဲ့ contact CTA ပါရင်ပိုအလုပ်ဖြစ်ပါတယ်။

သင့် product/service ကိုပြောပြရင် 15 seconds / 30 seconds / 60 seconds အတွက် script direction ကိုအကြံပေးနိုင်ပါတယ်။

ဘာလုပ်ငန်းအတွက် video idea လိုတာလဲ?`
      : `Yes. Burma AI Studio can help not only with video creation but also script ideas, hook lines, scene direction, presenter dialogue and call-to-action wording. A strong ad needs a first-3-seconds hook, a clear problem, a solution, a trust point and a CTA.

For a music ads video, we can build a cinematic mood teaser, a lyric-style social short, an artist promotion clip, or a product/service ad with music-driven pacing.

What kind of music ad do you want: artist promotion, song teaser, event promo, or brand/product ad with music?`;
  }

  return mm
    ? `Burma AI Studio ဘက်ကနေ ကူညီပေးနိုင်ပါတယ်။ သင့် website/brand/product/service ကိုပိုပြီးကြော်ငြာချင်တာလား၊ video idea စဉ်းစားနေတာလား၊ AI presenter / cinematic ad / social media short video လိုချင်တာလားဆိုတာပေါ်မူတည်ပြီး အကောင်းဆုံး direction ကိုရွေးပေးနိုင်ပါတယ်။

မသေချာသေးရင်တောင် စတင်ဖို့လွယ်ပါတယ် — သင့်လုပ်ငန်းအမျိုးအစား၊ ကြော်ငြာချင်တဲ့ product/service, video တင်မယ့် platform နဲ့ လိုချင်တဲ့ vibe ကိုပြောပြပါ။ Burma AI Studio က သင့် brand နဲ့ကိုက်တဲ့ video concept, format, script direction နဲ့ next step ကိုအကြံပေးနိုင်ပါတယ်။

${contactLine(true)}`
    : `I can help from the Burma AI Studio side. Whether you want to promote a website, brand, product, service, personal page or social media campaign, the right video direction can be selected based on your goal.

Even if you are not sure what you need yet, tell me your business type, product/service, target platform and the style you like. Burma AI Studio can recommend the best video concept, format, script direction and next step.

${contactLine(false)}`;
}

async function callGemini(model: string, apiKey: string, contents: GeminiContent[]) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.85, topP: 0.95, maxOutputTokens: 1600 },
      }),
    });

    const data = (await response.json().catch(() => null)) as GeminiResponse | null;
    if (!response.ok) {
      console.warn(`Gemini API unavailable for ${model}:`, data?.error?.message || response.statusText);
      return null;
    }
    return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim() || null;
  } catch (error) {
    console.warn(`Gemini request failed for ${model}:`, error);
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
    if (!apiKey) return jsonReply(naturalFallback(lastQuestion));

    const contents: GeminiContent[] = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    for (const model of GEMINI_MODELS) {
      const reply = await callGemini(model, apiKey, contents);
      if (reply) return jsonReply(reply);
    }

    return jsonReply(naturalFallback(lastQuestion));
  } catch (error) {
    console.error("Chat route fallback used:", error);
    return jsonReply(naturalFallback("ဘာဝန်ဆောင်မှုတွေလုပ်ပေးလဲ"));
  }
}
