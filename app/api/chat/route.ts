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

const CONTACT_MM = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011 | Facebook: Burma Ai Studio";
const CONTACT_EN = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011 | Facebook: Burma Ai Studio";

const WEBSITE_KNOWLEDGE = `
Burma AI Studio is an AI video creation service for Myanmar businesses, new brands, online shops, creators and service providers.
Core services:
- AI promotional videos for products, restaurants, shops, real estate, services and personal brands.
- Cinematic brand commercials and storytelling videos.
- AI presenter / virtual spokesperson videos in Burmese or English style.
- TikTok, Facebook Reels, YouTube Shorts and social media ad videos.
- Product showcase videos, service explainer videos, campaign concepts and creative direction.
- Architecture / property / product animation concepts.
- Script writing support, storyboard direction, prompt direction and creative editing.
Useful website pages:
- Home: explains Burma AI Studio and the main offer.
- Services: explains AI video creation services.
- Portfolio: shows sample videos and creative styles.
- Contact: lets visitors send project messages or contact directly.
Business positioning:
- For business owners who want to promote a brand without expensive shooting costs.
- Good for new businesses, online sellers, restaurants, beauty clinics, real estate pages, education pages, local services and creators.
- Main promise: faster, more flexible and more affordable than traditional filming in many cases.
Project process:
1) Ask the visitor what product/service/brand they want to promote.
2) Ask for video purpose, platform, duration, style/reference, language, deadline and budget range.
3) Suggest a suitable video type and creative direction.
4) Invite them to send the idea through Telegram, Viber, phone, email or the website contact form.
Pricing rule:
- Do not invent a fixed exact price.
- Explain that price depends on duration, scene count, presenter/character count, voice/dialogue, realism level, deadline, revisions and complexity.
- Always guide the visitor toward sending their project idea so Burma AI Studio can quote properly.
Contact:
${CONTACT_EN}
`;

const CONSULTANT_SYSTEM_PROMPT = `
You are the official AI sales consultant for Burma AI Studio. You are not a generic chatbot. Speak like a warm, experienced human consultant who wants to help the visitor choose the right video service.

Language rules:
- If the visitor writes Burmese, reply in natural Burmese.
- If the visitor writes English, reply in natural English.
- If mixed, use the visitor's main language.

Conversation style:
- Do not give tiny 1-2 sentence answers unless the visitor asks for a very short answer.
- Give useful, human-like replies with context, suggestions and next steps.
- Use friendly professional wording, not robotic wording.
- Ask one clear follow-up question at the end when useful.
- When the question is vague, do not stop. Guide them by giving options and asking what they want.
- When the requested info is not available, upsell naturally: explain what Burma AI Studio can still do, suggest a suitable service and invite them to share project details.
- Never say you are unable to help with Burma AI Studio website/service questions. Redirect toward service, portfolio, contact, quotation or consultation.

Sales behavior:
- Understand the visitor's business goal first.
- Suggest a suitable package direction: AI presenter video, cinematic commercial, product ad, service explainer, TikTok/Reels short, architecture/product animation, or brand story.
- Use consultative upselling: recommend a stronger video direction, explain why it helps their brand, and invite them to contact.
- Do not sound like spam. Be helpful and specific.

Website knowledge:
${WEBSITE_KNOWLEDGE}

Ideal answer structure:
1) Acknowledge the visitor's question naturally.
2) Answer with Burma AI Studio context.
3) Suggest the best option or next step.
4) Ask for project idea / product / duration / platform / reference / deadline when useful.
5) Include contact only when helpful, not in every sentence.
`;

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

function projectQuestions(mm: boolean) {
  return mm
    ? "Quotation နဲ့ creative direction ကိုတိတိကျကျပြောပေးနိုင်ဖို့ Product/Service အမျိုးအစား၊ Video တင်မယ့် platform, ကြာချိန်, reference video ရှိမရှိ, deadline ကိုပြောပြပေးပါ။"
    : "To suggest the best creative direction and quote, please share your product/service, target platform, duration, reference style, and deadline.";
}

function naturalFallback(question: string) {
  const query = question.toLowerCase();
  const mm = hasMyanmar(question);

  if (includesAny(query, ["price", "pricing", "cost", "fee", "charge", "rate", "budget", "package", "how much", "ဈေး", "စျေး", "ဘယ်လောက်", "ကုန်ကျ", "package", "ပက်ကေ့"])) {
    return mm
      ? `ဈေးနှုန်းအတွက် တိတိကျကျပြောရရင် video တစ်ပုဒ်ချင်းစီမှာ လိုချင်တဲ့ style မတူလို့ fixed price တစ်ခုတည်းနဲ့မပြောတာပိုမှန်ပါတယ်။ ဥပမာ AI presenter video လား၊ cinematic brand commercial လား၊ product ad လား၊ TikTok/Reels short လားဆိုတာပေါ်မူတည်ပြီး duration, scene အရေအတွက်, voice/dialogue, character ပါမပါ, realism level, deadline နဲ့ revision လိုအပ်ချက်တွေက ဈေးကိုပြောင်းစေပါတယ်။

Burma AI Studio အနေနဲ့တော့ လူကြီးမင်းရဲ့ budget နဲ့ brand goal ကိုကြည့်ပြီး အလွန်ကုန်ကျစရိတ်မကြီးဘဲ ကြော်ငြာအကျိုးသက်ရောက်မှုရှိမယ့် video direction ကိုရွေးပေးနိုင်ပါတယ်။ လုပ်ငန်းအသစ်ဆိုရင် 15-30 seconds social media ad နဲ့စတာက အမြန်ဆုံး result မြင်ရတတ်ပါတယ်။

${projectQuestions(true)}
${contactLine(true)}`
      : `Pricing depends on the style and complexity of the video, so it is better not to give one random fixed price. A simple AI presenter video, a cinematic brand commercial, a product ad, and a TikTok/Reels short all require different scene counts, duration, voice/dialogue, characters, realism level, deadline and revision scope.

Burma AI Studio can help you choose a cost-effective direction first, especially if you are a new business that wants promotion without a heavy filming budget. For many brands, starting with a 15-30 second social media ad is the fastest practical option.

${projectQuestions(false)}
${contactLine(false)}`;
  }

  if (includesAny(query, ["service", "services", "ဘာလုပ်", "ဘာတွေ", "ဝန်ဆောင်", "လုပ်ပေး", "video type", "အမျိုးအစား", "ai video", "ကြော်ငြာ"])) {
    return mm
      ? `Burma AI Studio က AI Video Creation Service ဖြစ်ပြီး လုပ်ငန်းရှင်တွေ Brand ကြော်ငြာချင်တဲ့အခါ ရိုက်ကူးရေးစရိတ်ကြီးမားတာကိုလျှော့ချပြီး professional video content ဖန်တီးပေးနိုင်ပါတယ်။

လုပ်ပေးနိုင်တာတွေက AI presenter video, cinematic commercial, product/service ad, TikTok/Reels/Shorts video, brand storytelling video, architecture/product animation concept, script idea, storyboard direction နဲ့ creative editing တွေပါ။ Online shop, restaurant, beauty clinic, real estate, education page, service business, personal brand တွေအတွက်လည်းအသုံးဝင်ပါတယ်။

သင့်လုပ်ငန်းက ဘာအမျိုးအစားလဲ ပြောပြရင် ဘယ် video type နဲ့စသင့်လဲကို တိတိကျကျအကြံပေးနိုင်ပါတယ်။`
      : `Burma AI Studio creates AI-powered promotional videos for businesses that want professional content without the cost and hassle of traditional filming.

We can help with AI presenter videos, cinematic commercials, product/service ads, TikTok/Reels/Shorts videos, brand storytelling, architecture/product animation concepts, script ideas, storyboard direction and creative editing. It works well for online shops, restaurants, clinics, real estate pages, education pages, service businesses and personal brands.

Tell me what kind of business you have, and I can suggest the best video type to start with.`;
  }

  if (includesAny(query, ["process", "start", "order", "how to", "ဘယ်လိုစ", "မှာယူ", "လုပ်ငန်းစဉ်", "စလုပ်", "စချင်"])) {
    return mm
      ? `စလုပ်ချင်ရင် အဆင့်တွေက ရိုးရှင်းပါတယ်။ ပထမဆုံး လူကြီးမင်းရဲ့ product/service idea ကိုပို့ပါ။ ပြီးရင် target platform က Facebook, TikTok, Reels, YouTube Shorts ဘယ်မှာတင်မလဲ၊ video ကြာချိန်ဘယ်လောက်လိုချင်လဲ၊ reference video ရှိလား၊ deadline ဘယ်နေ့လဲဆိုတာပြောပေးပါ။

အဲဒီအချက်အလက်တွေကိုကြည့်ပြီး Burma AI Studio က သင့် brand နဲ့လိုက်ဖက်တဲ့ creative direction, video concept, format နဲ့ quotation ကိုပြန်ပေးနိုင်ပါတယ်။ Confirm ပြီးရင် production စမယ်၊ preview ကြည့်မယ်၊လိုအပ်တဲ့ revision ပြောမယ်၊ final video ပေးပို့မယ်။

အခုစချင်ရင် သင့်လုပ်ငန်းအမျိုးအစားနဲ့ ကြော်ငြာချင်တဲ့ product/service ကိုရေးပေးပါ။`
      : `The process is simple. First, send your product or service idea. Then share the target platform, video duration, reference style, language, deadline and any brand details.

Burma AI Studio will use that information to suggest the creative direction, concept, format and quotation. After confirmation, production starts, you review a preview, request revisions if needed, and receive the final video.

If you want to start now, tell me what business or product you want to promote.`;
  }

  if (includesAny(query, ["portfolio", "example", "sample", "work", "နမူနာ", "လက်ရာ", "ပြခန်း", "ကြည့်", "video sample"])) {
    return mm
      ? `နမူနာတွေကို Portfolio page မှာကြည့်နိုင်ပါတယ်။ အဲဒီထဲမှာ cinematic style, commercial style, presenter style, architecture/product animation concept နဲ့ social media short video ပုံစံတွေကိုစိတ်ကူးရအောင်ကြည့်လို့ရပါတယ်။

နမူနာကြည့်တဲ့အခါ “ဒီ style လိုချင်တယ်” လို့ reference အဖြစ်ပို့ပေးနိုင်ပါတယ်။ ဒါဆို Burma AI Studio က သင့် product/service နဲ့လိုက်ဖက်အောင် scene, script, tone, format ကိုပြန်ညှိပေးနိုင်ပါတယ်။

Portfolio ထဲက style တစ်ခုခုကြိုက်ရင် ဘယ် video ပုံစံနဲ့တူချင်လဲ ပြောပြပါ။`
      : `You can view sample work on the Portfolio page. It includes styles such as cinematic ads, commercial videos, presenter videos, architecture/product animation concepts and social media short videos.

If you like one of the sample styles, you can send it as a reference. Burma AI Studio can then adapt the scene direction, script tone and format to your own brand or product.

Which style are you most interested in: presenter, cinematic, product ad or social short?`;
  }

  if (includesAny(query, ["delivery", "fast", "time", "deadline", "ဘယ်လောက်ကြာ", "ကြာ", "မြန်", "အချိန်", "အမြန်"])) {
    return mm
      ? `Delivery time က video complexity ပေါ်မူတည်ပါတယ်။ Simple social media ad, basic presenter video လိုမျိုးဆိုရင် မြန်မြန်စီစဉ်လို့ရနိုင်ပါတယ်။ Cinematic scene များတာ၊ character များတာ၊ dialogue/voice များတာ၊ realistic detail အရမ်းလိုတာဆိုရင် အချိန်ပိုလိုနိုင်ပါတယ်။

Deadline အရေးကြီးရင် project မစခင်တည်းကကြိုပြောပေးတာအကောင်းဆုံးပါ။ အဲဒါမှ Burma AI Studio က fast delivery ဖြစ်နိုင်မဖြစ်နိုင်နဲ့ ဘယ် format နဲ့ပိုအမြန်ပြီးမလဲကိုညှိပေးနိုင်ပါတယ်။

ဘယ်နေ့မတိုင်ခင် video လိုတာလဲ ပြောပြပါ။`
      : `Delivery time depends on the complexity. A simple social media ad or basic presenter video can often be planned faster. Cinematic scenes, multiple characters, heavier dialogue/voice work and high realism details may take longer.

If your deadline is important, share it before production starts so Burma AI Studio can suggest the fastest realistic format.

When do you need the video finished?`;
  }

  if (includesAny(query, ["script", "idea", "concept", "caption", "စာသား", "အကြံ", "စိတ်ကူး", "ဇာတ်ညွှန်း", "ကြော်ငြာစာ"])) {
    return mm
      ? `ရပါတယ်။ Burma AI Studio က video ဖန်တီးပေးရုံမက script idea, hook line, scene direction, presenter dialogue, CTA စာသားတွေပါကူညီပေးနိုင်ပါတယ်။ ကြော်ငြာ video တစ်ခုက ရုပ်ထွက်လှတာတစ်ခုတည်းမဟုတ်ဘဲ ပထမ ၃ စက္ကန့်မှာ customer ကိုဖမ်းနိုင်တဲ့ hook, brand problem, solution, trust point နဲ့ contact CTA ပါရင် ပိုအလုပ်ဖြစ်ပါတယ်။

သင့် product/service ကိုပြောပြရင် 15 seconds / 30 seconds / 60 seconds အတွက် script direction တစ်ခုချင်းစီအကြံပေးနိုင်ပါတယ်။

ဘာလုပ်ငန်းအတွက် script လိုတာလဲ?`
      : `Yes. Burma AI Studio can help not only with video creation, but also script ideas, hook lines, scene direction, presenter dialogue and call-to-action wording. A good ad is not just good visuals; it needs a strong first 3 seconds, a clear problem, a solution, a trust point and a contact CTA.

Tell me your product or service and I can suggest a 15-second, 30-second or 60-second script direction.`;
  }

  return mm
    ? `အဲ့မေးခွန်းနဲ့ပတ်သတ်ပြီး Burma AI Studio ဘက်ကနေ အကူညီပေးနိုင်တဲ့နည်းလမ်းရှိပါတယ်။ သင့် website/brand/product/service ကိုပိုပြီးကြော်ငြာချင်တာလား၊ video idea စဉ်းစားနေတာလား၊ ဒါမှမဟုတ် AI presenter / cinematic ad / social media short video လိုချင်တာလားဆိုတာပေါ်မူတည်ပြီး အကောင်းဆုံး direction ကိုရွေးပေးနိုင်ပါတယ်။

မသေချာသေးရင်တောင် စတင်ဖို့လွယ်ပါတယ် — သင့်လုပ်ငန်းအမျိုးအစား၊ ကြော်ငြာချင်တဲ့ product/service, video တင်မယ့် platform နဲ့ လိုချင်တဲ့ vibe ကိုပြောပြပါ။ Burma AI Studio က သင့် brand နဲ့ကိုက်တဲ့ video concept, format, script direction နဲ့ next step ကိုအကြံပေးနိုင်ပါတယ်။

${contactLine(true)}`
    : `I can help from the Burma AI Studio side. Whether you want to promote a website, brand, product, service, personal page, or social media campaign, the right video direction can be selected based on your goal.

Even if you are not sure what you need yet, we can start simply: tell me your business type, product/service, target platform and the style you like. Burma AI Studio can then recommend the best video concept, format, script direction and next step.

${contactLine(false)}`;
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
      return jsonReply(naturalFallback(lastQuestion));
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
            parts: [{ text: CONSULTANT_SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            temperature: 0.82,
            topP: 0.95,
            maxOutputTokens: 1600,
          },
        }),
      }
    );

    const data = (await response.json().catch(() => null)) as GeminiResponse | null;

    if (!response.ok) {
      console.warn("Gemini API unavailable:", data?.error?.message || response.statusText);
      return jsonReply(naturalFallback(lastQuestion));
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || naturalFallback(lastQuestion);

    return jsonReply(reply);
  } catch (error) {
    console.error("Chat route fallback used:", error);
    return jsonReply(naturalFallback("ဘာဝန်ဆောင်မှုတွေလုပ်ပေးလဲ"));
  }
}
