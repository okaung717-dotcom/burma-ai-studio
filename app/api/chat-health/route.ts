export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GeminiHealth = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { code?: number; message?: string; status?: string };
};

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({
      ok: false,
      keyConfigured: false,
      model: null,
      message: "GEMINI_API_KEY is not configured for this deployment environment.",
    });
  }

  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];

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

      if (data?.error?.code === 400 || data?.error?.code === 403 || data?.error?.code === 429) {
        return Response.json({
          ok: false,
          keyConfigured: true,
          model,
          status: data.error.status || response.status,
          message: data.error.message || "Gemini request failed for this deployment.",
        });
      }
    } catch {
      // Try the next model before reporting a failure.
    }
  }

  return Response.json({
    ok: false,
    keyConfigured: true,
    model: null,
    message: "Gemini key exists, but all test model calls failed for this deployment.",
  });
}
