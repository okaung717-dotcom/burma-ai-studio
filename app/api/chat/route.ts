export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role?: "assistant" | "user"; content?: string };

const contact = "Email: okaung717@gmail.com | Phone: 09671010011 | Telegram/Viber: +95 9 671 010 011";
const mm = (s: string) => /[\u1000-\u109F]/.test(s);
const has = (s: string, list: string[]) => list.some((w) => s.includes(w));
const res = (reply: string, status = 200) => Response.json({ reply }, { status });

function last(messages: Msg[]) {
  return [...messages].reverse().find((m) => m.role === "user" && typeof m.content === "string")?.content?.trim() || "";
}

function related(text: string) {
  const q = text.toLowerCase();
  return has(q, ["ai", "video", "ad", "ads", "commercial", "brand", "service", "price", "cost", "portfolio", "contact", "script", "idea", "concept", "tiktok", "reels", "shorts", "product", "hotel", "restaurant", "bar", "cafe", "music", "business", "cinematic", "presenter", "delivery", "revision", "burma", "studio", "website", "ဗီဒီယို", "ကြော်ငြာ", "ဈေး", "စျေး", "နမူနာ", "ဆက်သွယ်", "ဇာတ်ညွှန်း", "ဟိုတယ်", "စားသောက်", "ဆိုင်", "ဘား", "ကဖေး", "သီချင်း", "လုပ်ငန်း", "လုပ်ချင်", "ဖန်တီး", "ပရောဂျက်"]);
}

function greeting(text: string) {
  const q = text.toLowerCase().trim();
  return q.length <= 80 && has(q, ["hi", "hello", "hey", "good morning", "good evening", "မင်္ဂလာပါ", "ဟယ်လို", "နေကောင်း", "ရှိလား", "hello", "hi"]);
}

function goodbye(text: string) {
  const q = text.toLowerCase().trim();
  return q.length <= 120 && has(q, ["bye", "goodbye", "thanks", "thank you", "ok thanks", "see you", "ကျေးဇူး", "တာ့တာ", "သွားတော့မယ်", "ပြီးပြီ", "အိုကေ", "ok"]);
}

function greetingReply(text: string) {
  return mm(text)
    ? "မင်္ဂလာပါ။ Burma AI Studio မှကြိုဆိုပါတယ်။ AI video ကြော်ငြာ, pricing, portfolio, script idea, delivery, revision, contact နဲ့ပတ်သတ်တာတွေကို customer service လိုကူညီပေးနိုင်ပါတယ်။\n\nဘာလုပ်ငန်းအတွက် video project လုပ်ချင်တာလဲ ပြောပြပါ။ အကောင်းဆုံး direction ကိုတိုတိုရှင်းရှင်းညှိပေးမယ်။"
    : "Hello, welcome to Burma AI Studio. I can help with AI video ads, pricing, portfolio, script ideas, delivery, revisions, and contact like a customer service assistant.\n\nWhat kind of video project do you want to create? I’ll suggest the best direction clearly.";
}

function goodbyeReply(text: string) {
  return mm(text)
    ? `ကျေးဇူးတင်ပါတယ်။ AI video project လုပ်ချင်လာရင် Burma AI Studio ကို အချိန်မရွေးဆက်သွယ်နိုင်ပါတယ် — ${contact}။\n\nProject idea, reference video, duration နဲ့ platform ပို့ပေးရင် concept နဲ့ quote ကိုပြန်ညှိပေးပါမယ်။`
    : `Thank you. Whenever you are ready for an AI video project, you can contact Burma AI Studio anytime — ${contact}.\n\nSend your project idea, reference video, duration, and platform, and we will suggest the concept and quote.`;
}

function offTopic(text: string) {
  return mm(text)
    ? "ကျေးဇူးပါ။ ဒီ AI assistant က Burma AI Studio ရဲ့ AI video service အတွက် customer service bot ပါ။\n\nAI video, pricing, portfolio, script idea, delivery, revisions, contact, ဒါမှမဟုတ် သင့် video project အကြောင်းမေးပေးပါ။"
    : "Thanks for asking. I’m Burma AI Studio’s customer service assistant, so I can only help with our AI video services.\n\nPlease ask about AI videos, pricing, portfolio, scripts, delivery, revisions, contact, or your video project.";
}

function answer(text: string) {
  const q = text.toLowerCase();
  const burmese = mm(text);
  if (greeting(text)) return greetingReply(text);
  if (goodbye(text)) return goodbyeReply(text);
  if (!related(text)) return offTopic(text);

  if (has(q, ["hotel", "room", "booking", "resort", "ဟိုတယ်", "အခန်း", "ဧည့်"])) {
    return burmese
      ? "Hotel ကြော်ငြာအတွက် TikTok 30s cinematic video ဆိုရင် lobby/room/guest experience ကို ၃ စက္ကန့် hook နဲ့စပြီး, luxury mood, service highlight, location နဲ့ booking CTA နဲ့ဆုံးတာအကောင်းဆုံးပါ။\n\nHotel name, location, room type, highlight service နဲ့ reference video ပို့ပေးပါ။ 30s concept/script ကိုညှိပေးမယ်။"
      : "For a hotel ad, a 30s cinematic TikTok video should start with a strong 3-second hook, then show the lobby, rooms, guest experience, service highlights, location, and a booking CTA.\n\nSend the hotel name, location, room type, key service, and reference video. I’ll suggest a 30s concept/script.";
  }

  if (has(q, ["price", "cost", "how much", "budget", "ဈေး", "စျေး", "ဘယ်လောက်"])) {
    return burmese
      ? "ဈေးက video ကြာချိန်, scene အရေအတွက်, voice, presenter/character, realism, deadline နဲ့ revision ပေါ်မူတည်ပါတယ်။\n\nProduct/service, platform, duration နဲ့ reference style ပို့ပေးပါ။ သင့် budget နဲ့ကိုက်တဲ့ quote ကိုညှိပေးပါမယ်။"
      : "Price depends on duration, scene count, voice, presenter/character, realism, deadline, and revisions.\n\nSend your product/service, platform, duration, and reference style. I’ll suggest the best quote for your budget.";
  }

  if (has(q, ["contact", "phone", "telegram", "viber", "ဆက်သွယ်", "ဖုန်း"])) {
    return burmese ? `တိုက်ရိုက်ဆက်သွယ်နိုင်ပါတယ် — ${contact}။\n\nProject idea ပို့ပေးရင် video direction နဲ့ quote ကိုပြန်ညှိပေးပါမယ်။` : `You can contact Burma AI Studio directly — ${contact}.\n\nSend your project idea and we’ll suggest the video direction and quote.`;
  }

  if (has(q, ["music", "song", "သီချင်း", "အဆိုတော်"])) {
    return burmese
      ? "Music ads video အတွက် song teaser, artist promo, lyric-style short ဒါမှမဟုတ် cinematic mood video သင့်ပါတယ်။ Social media အတွက် 15-30s hook video ကပိုထိရောက်ပါတယ်။\n\nသီချင်း mood, artist name, duration နဲ့ reference style ပို့ပေးပါ။"
      : "For a music ad, a song teaser, artist promo, lyric-style short, or cinematic mood video works well. For social media, a 15-30s hook video is strongest.\n\nSend the song mood, artist name, duration, and reference style.";
  }

  if (has(q, ["bar", "restaurant", "cafe", "စားသောက်", "ဆိုင်", "ဘား", "ကဖေး"])) {
    return burmese
      ? "Bar/Restaurant ads video အတွက် night vibe, food/drink close-up, customer mood နဲ့ premium logo ending ပါတဲ့ 15-30s short video ကထိရောက်ပါတယ်။\n\nဆိုင်နာမည်, location, menu/drink နဲ့လိုချင်တဲ့ vibe ကိုပို့ပေးပါ။"
      : "For a bar or restaurant ad, a 15-30s short video with night ambience, food/drink close-ups, customer mood, and a premium logo ending works best.\n\nSend the shop name, location, menu/drink, and preferred vibe.";
  }

  if (has(q, ["script", "idea", "concept", "စာသား", "ဇာတ်ညွှန်း", "အကြံ"])) {
    return burmese
      ? "ရပါတယ်။ ကြော်ငြာ video script အတွက် hook, problem, solution, trust point နဲ့ contact CTA structure သုံးရင်ပိုအလုပ်ဖြစ်ပါတယ်။\n\nဘာ product/service အတွက်ရေးချင်တာလဲ ပြောပါ။ 15s သို့ 30s script direction ညှိပေးမယ်။"
      : "Yes. For an ad script, the strongest structure is hook, problem, solution, trust point, and contact CTA.\n\nWhat product or service is this for? I can suggest a 15s or 30s script direction.";
  }

  return burmese
    ? "ရပါတယ်။ ပေးထားတဲ့ detail အရ သင့်လုပ်ငန်းအတွက် AI presenter ad, cinematic ad, product ad, Reels/TikTok short video direction ထဲကကိုက်တာကိုညှိပေးနိုင်ပါတယ်။\n\nလုပ်ငန်းအမျိုးအစား, platform, duration, style နဲ့ reference ကိုပို့ပေးပါ။ အတိအကျ concept ပြန်ညှိပေးမယ်။"
    : "Yes. Based on your details, Burma AI Studio can suggest the best fit from AI presenter ads, cinematic ads, product ads, or Reels/TikTok short videos.\n\nSend your business type, platform, duration, style, and reference. I’ll refine the exact concept.";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { messages?: unknown } | null;
  const raw = Array.isArray(body?.messages) ? body.messages : [];
  const messages = raw.filter((m): m is Msg => Boolean(m && typeof m === "object"));
  const question = last(messages);
  if (!question) return res("Please send a message first.", 400);
  return res(answer(question));
}
