export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GeminiHealth = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { code?: number; message?: string; status?: string };
};

function getGeminiApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  ).trim();
}

export async function GET() {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return Response.json({
      ok: false,
      keyConfigured: false,
      model: null,
      acceptedEnvNames: ["GEMINI_API_KEY", "GOOGLE_GEMINI_API_KEY", "GOOGLE_AI_API_KEY", "GOOGLE_API_KEY", "NEXT_PUBLIC_GEMINI_API_KEY"],
      message: "No Gemini API key is configured for this deployment environment.",
    });
  }

  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
  const failures: Array<{ model: string; status?: number | string; message: string }> = [];

  for (const model of models) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Reply with exactly: connected" }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 16 },
        }),
      });

      const data = (await response.json().catch(() => null)) as GeminiHealth | null;
      const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join(" ").trim() || "";

      if (response.ok && text) {
        return Response.json({
          ok: true,
          keyConfigured: true,
          model,
          message: "Gemini is connected for this deployment.",
        });
      }

      failures.push({
        model,
        status: data?.error?.status || response.status,
        message: data?.error?.message || "Gemini request failed for this model.",
      });
    } catch {
      failures.push({ model, message: "Network or runtime error while testing this model." });
    }
  }

  return Response.json({
    ok: false,
    keyConfigured: true,
    model: null,
    failures,
    message: "A Gemini key exists, but every tested model failed for this deployment.",
  });
}
