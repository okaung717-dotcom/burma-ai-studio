export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "assistant" | "user"; content: string };

type GeminiResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };

type GeminiContent = { role: "model" | "user"; parts: Array<{ text: string }> };

const GEMINI_MODEL = "gemini-3.5-flash";

const CONTACT_MM = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011 | Facebook: Burma Ai Studio";
const CONTACT_EN = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011 | Facebook: Burma Ai Studio";

const KNOWLEDGE = `Burma AI Studio is an AI video creation service for Myanmar businesses, new brands, online shops, creators and service providers.
Services: AI promotional videos, cinematic brand commercials, AI presenter videos, TikTok/Reels/Shorts ads, product showcase videos, service explainer videos, brand storytelling, architecture/product animation concepts, script support, storyboard direction, prompt direction and creative editing.
Pages: Home explains the offer, Services explains video services, Portfolio shows sample videos, Contact lets visitors send project messages.
Positioning: faster and more flexible than traditional filming for many promotional needs. Good for online shops, restaurants, beauty clinics, real estate, education pages, local services, creators and personal brands.
Process: ask what product/service they promote, target platform, duration, style/reference, language, deadline and budget range. Suggest a suitable video direction and invite them to contact.
Pricing: do not invent exact fixed prices. Explain price depends on duration, scene count, presenter/character count, voice/dialogue, realism level, deadline, revisions and complexity.
Contact: ${CONTACT_EN}`;

const SYSTEM_PROMPT = `You are the official AI sales consultant for Burma AI Studio. You are not a generic chatbot. Reply like a warm, experienced human creative consultant.

Use the same language as the visitor. If Burmese, reply in natural Burmese. If English, reply in natural English.

Very important behavior:
- Do not give tiny answers. Give a helpful consultant-style response.
- For most answers, use 3 to 6 short paragraphs.
- Acknowledge the question, answer directly, suggest a suitable Burma AI Studio service, then ask one useful follow-up question.
- If the question is vague, guide the visitor instead of stopping.
- If something is not available, naturally upsell toward a relevant service, portfolio, contact, quotation or consultation.
- Do not sound spammy. Be specific and useful.
- Never invent exact prices. Ask for project details before quote.

Website knowledge:
${KNOWLEDGE}`;

function jsonReply(reply: string, status = 200) { return Response.json({ reply }, { status }); }

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

function hasMyanmar(text: string) { return /[\u1000-\u109F]/.test(text); }
function includesAny(query: string, words: string[]) { return words.some((word) => query.includes(word)); }
function getLastUserQuestion(messages: ChatMessage[]) { return [...messages].reverse().find((m) => m.role === "user")?.content || ""; }
function contactLine(mm: boolean) { return mm ? `တိုက်ရိုက်ဆက်သွယ်ရန် — ${CONTACT_MM}` : `Direct contact — ${CONTACT_EN}`; }
function projectQuestions(mm: boolean) { return mm ? "Quotation နဲ့ creative direction တိတိကျကျပြောပေးဖို့ product/service, တင်မယ့် platform, ကြာချိန်, reference style နဲ့ deadline ကိုပြောပြပေးပါ။" : "To suggest the best creative direction and quote, please share your product/service, platform, duration, reference style, and deadline."; }

function naturalFallback(question: string) {
  const query = question.toLowerCase();
  const mm = hasMyanmar(question);

  if (includesAny(query, ["price", "pricing", "cost", "fee", "charge", "rate", "budget", "package", "how much", "ဈေး", "စျေး", "ဘယ်လောက်", "ကုန်ကျ", "ပက်ကေ့"])) {
    return mm
      ? `ဈေးနှုန်းက video style နဲ့ production complexity ပေါ်မူတည်ပါတယ်။ AI presenter video, cinematic brand commercial, product ad, TikTok/Reels short video တို့က scene အရေအတွက်၊ ကြာချိန်၊ voice/dialogue၊ character ပါမပါ၊ realism level၊ deadline နဲ့ revision လိုအပ်ချက်တွေမတူတဲ့အတွက် fixed price တစ်ခုတည်းနဲ့မပြောတာပိုမှန်ပါတယ်။

Burma AI Studio အနေနဲ့ လူကြီးမင်းရဲ့ budget နဲ့ brand goal ကိုကြည့်ပြီး အကုန်အကျမများဘဲ customer ကိုဖမ်းနိုင်မယ့် video direction ကိုရွေးပေးနိုင်ပါတယ်။ လုပ်ငန်းအသစ်ဆိုရင် 15-30 seconds social media ad နဲ့စတာက အမြန်ဆုံး result မြင်ရတတ်ပါတယ်။

${projectQuestions(true)}
${contactLine(true)}`
      : `Pricing depends on the video style and production complexity. AI presenter videos, cinematic brand commercials, product ads and TikTok/Reels shorts need different scene counts, duration, voice/dialogue, characters, realism level, deadline and revision scope.

Burma AI Studio can help you choose a cost-effective direction based on your budget and brand goal. For many new businesses, a 15-30 second social media ad is the fastest practical starting point.

${projectQuestions(false)}
${contactLine(false)}`;
  }

  if (includesAny(query, ["service", "services", "ဘာလုပ်", "ဘာတွေ", "ဝန်ဆောင်", "လုပ်ပေး", "video type", "အမျိုးအစား", "ai video", "ကြော်ငြာ"])) {
    return mm
      ? `Burma AI Studio က လုပ်ငန်းရှင်တွေ Brand ကြော်ငြာချင်တဲ့အခါ ရိုက်ကူးရေးစရိတ်ကြီးမားတာကိုလျှော့ချပြီး professional AI video content ဖန်တီးပေးတဲ့ service ပါ။

လုပ်ပေးနိုင်တာတွေက AI presenter video, cinematic commercial, product/service ad, TikTok/Reels/Shorts video, brand storytelling video, architecture/product animation concept, script idea, storyboard direction နဲ့ creative editing တွေပါ။ Online shop, restaurant, beauty clinic, real estate, education page, service business, personal brand တွေအတွက်လည်းအသုံးဝင်ပါတယ်။

သင့်လုပ်ငန်းက ဘာအမျိုးအစားလဲ ပြောပြရင် ဘယ် video type နဲ့စသင့်လဲကို တိတိကျကျအကြံပေးနိုင်ပါတယ်။`
      : `Burma AI Studio creates AI-powered promotional videos for businesses that want professional content without the heavy cost and hassle of traditional filming.

We can help with AI presenter videos, cinematic commercials, product/service ads, TikTok/Reels/Shorts videos, brand storytelling, architecture/product animation concepts, script ideas, storyboard direction and creative editing.

Tell me what kind of business you have, and I can suggest the best video type to start with.`;
  }

  if (includesAny(query, ["process", "start", "order", "how to", "ဘယ်လိုစ", "မှာယူ", "လုပ်ငန်းစဉ်", "စလုပ်", "စချင်"])) {
    return mm
      ? `စလုပ်ချင်ရင် အဆင့်တွေက ရိုးရှင်းပါတယ်။ ပထမဆုံး product/service idea ကိုပို့ပါ။ ပြီးရင် target platform, video ကြာချိန်, reference video, language, deadline နဲ့ brand detail တွေပြောပေးပါ။

အဲဒီအချက်အလက်တွေကိုကြည့်ပြီး Burma AI Studio က creative direction, concept, format နဲ့ quotation ကိုပြန်ပေးနိုင်ပါတယ်။ Confirm ပြီးရင် production စမယ်၊ preview ကြည့်မယ်၊ revision ပြောမယ်၊ final video ပေးပို့မယ်။

အခုစချင်ရင် သင့်လုပ်ငန်းအမျိုးအစားနဲ့ ကြော်ငြာချင်တဲ့ product/service ကိုရေးပေးပါ။`
      : `The process is simple. First, send your product or service idea. Then share the target platform, duration, reference style, language, deadline and brand details.

Burma AI Studio will suggest the creative direction, concept, format and quotation. After confirmation, production starts, you review a preview, request revisions if needed, and receive the final video.

If you want to start now, tell me what business or product you want to promote.`;
  }

  if (includesAny(query, ["portfolio", "example", "sample", "work", "နမူနာ", "လက်ရာ", "ပြခန်း", "ကြည့်"])) {
    return mm
      ? `နမူနာတွေကို Portfolio page မှာကြည့်နိုင်ပါတယ်။ Cinematic style, commercial style, AI presenter style, architecture/product animation concept နဲ့ social media short video ပုံစံတွေကိုစိတ်ကူးရအောင်ကြည့်လို့ရပါတယ်။

နမူနာထဲက style တစ်ခုခုကြိုက်ရင် reference အဖြစ်ပို့ပေးနိုင်ပါတယ်။ ဒါဆို Burma AI Studio က သင့် product/service နဲ့လိုက်ဖက်အောင် scene, script, tone, format ကိုပြန်ညှိပေးနိုင်ပါတယ်။

Portfolio ထဲက ဘယ် style ကိုပိုကြိုက်လဲ ပြောပြပါ။`
      : `You can view sample work on the Portfolio page, including cinematic ads, commercial videos, AI presenter styles, architecture/product animation concepts and social media short videos.

If you like a sample style, send it as a reference and Burma AI Studio can adapt the scene direction, script tone and format to your own brand.

Which style are you most interested in: presenter, cinematic, product ad or social short?`;
  }

  if (includesAny(query, ["script", "idea", "concept", "caption", "စာသား", "အကြံ", "စိတ်ကူး", "ဇာတ်ညွှန်း", "ကြော်ငြာစာ"])) {
    return mm
      ? `ရပါတယ်။ Burma AI Studio က video ဖန်တီးပေးရုံမက script idea, hook line, scene direction, presenter dialogue နဲ့ call-to-action စာသားတွေပါကူညီပေးနိုင်ပါတယ်။ ကြော်ငြာ video တစ်ခုက ရုပ်ထွက်လှတာတစ်ခုတည်းမဟုတ်ဘဲ ပထမ ၃ စက္ကန့်မှာ customer ကိုဖမ်းနိုင်တဲ့ hook, problem, solution, trust point နဲ့ contact CTA ပါရင်ပိုအလုပ်ဖြစ်ပါတယ်။

သင့် product/service ကိုပြောပြရင် 15 seconds / 30 seconds / 60 seconds အတွက် script direction ကိုအကြံပေးနိုင်ပါတယ်။

ဘာလုပ်ငန်းအတွက် script လိုတာလဲ?`
      : `Yes. Burma AI Studio can help not only with video creation, but also script ideas, hook lines, scene direction, presenter dialogue and call-to-action wording. A good ad needs a strong first 3 seconds, a clear problem, a solution, a trust point and a contact CTA.

Tell me your product or service and I can suggest a 15-second, 30-second or 60-second script direction.`;
  }

  return mm
    ? `အဲ့မေးခွန်းနဲ့ပတ်သတ်ပြီး Burma AI Studio ဘက်ကနေ ကူညီပေးနိုင်တဲ့နည်းလမ်းရှိပါတယ်။ သင့် website/brand/product/service ကိုပိုပြီးကြော်ငြာချင်တာလား၊ video idea စဉ်းစားနေတာလား၊ AI presenter / cinematic ad / social media short video လိုချင်တာလားဆိုတာပေါ်မူတည်ပြီး အကောင်းဆုံး direction ကိုရွေးပေးနိုင်ပါတယ်။

မသေချာသေးရင်တောင် စတင်ဖို့လွယ်ပါတယ် — သင့်လုပ်ငန်းအမျိုးအစား၊ ကြော်ငြာချင်တဲ့ product/service, video တင်မယ့် platform နဲ့ လိုချင်တဲ့ vibe ကိုပြောပြပါ။ Burma AI Studio က သင့် brand နဲ့ကိုက်တဲ့ video concept, format, script direction နဲ့ next step ကိုအကြံပေးနိုင်ပါတယ်။

${contactLine(true)}`
    : `I can help from the Burma AI Studio side. Whether you want to promote a website, brand, product, service, personal page or social media campaign, the right video direction can be selected based on your goal.

Even if you are not sure what you need yet, tell me your business type, product/service, target platform and the style you like. Burma AI Studio can recommend the best video concept, format, script direction and next step.

${contactLine(false)}`;
}

export async function POST(request: Request) {
  try {
    const messages = await getMessages(request);
    if (messages.length === 0) return jsonReply("Please send a message first.", 400);

    const lastQuestion = getLastUserQuestion(messages);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return jsonReply(naturalFallback(lastQuestion));

    const contents: GeminiContent[] = messages.map((message) => ({ role: message.role === "assistant" ? "model" : "user", parts: [{ text: message.content }] }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.85, topP: 0.95, maxOutputTokens: 1800 },
      }),
    });

    const data = (await response.json().catch(() => null)) as GeminiResponse | null;
    if (!response.ok) {
      console.warn("Gemini API unavailable:", data?.error?.message || response.statusText);
      return jsonReply(naturalFallback(lastQuestion));
    }

    const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim() || naturalFallback(lastQuestion);
    return jsonReply(reply);
  } catch (error) {
    console.error("Chat route fallback used:", error);
    return jsonReply(naturalFallback("ဘာဝန်ဆောင်မှုတွေလုပ်ပေးလဲ"));
  }
}
