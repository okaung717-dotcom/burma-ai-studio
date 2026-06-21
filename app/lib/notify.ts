type Message = {
  subject: string;
  html: string;
  text: string;
};

export async function sendOwnerNotice(message: Message) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL || "okaung717@gmail.com";
  if (!key) return { ok: false, skipped: true };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Burma AI Studio <onboarding@resend.dev>",
      to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });

  return { ok: response.ok, status: response.status };
}
