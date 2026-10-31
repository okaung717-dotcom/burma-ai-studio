import { NextResponse } from "next/server";
import { z } from "zod";
import { basicLimit } from "../../../lib/guard";
import { getSpacesUser } from "../../../lib/spaces-auth";
import { providerCapabilities, publicCapabilities } from "../../../lib/ai/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  kind: z.enum(["image", "video", "director"]),
  prompt: z.string().trim().min(3).max(4000),
  requestId: z.string().uuid(),
});

export async function GET() {
  const user = await getSpacesUser();
  if (!user) return NextResponse.json({ error: "Invite-only access required." }, { status: 401 });
  return NextResponse.json({ demoMode: true, capabilities: publicCapabilities() });
}

export async function POST(request: Request) {
  const user = await getSpacesUser();
  if (!user) return NextResponse.json({ error: "Invite-only access required." }, { status: 401 });
  if (!(await basicLimit(request, `spaces-generation-${user.id}`, 12, 60))) {
    return NextResponse.json({ error: "Generation rate limit reached. Try again shortly." }, { status: 429 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid generation request." }, { status: 400 });

  const capability = providerCapabilities[parsed.data.kind];
  if (capability.enabled) {
    return NextResponse.json(
      { error: "Paid provider execution is locked until the durable budget reservation queue is configured." },
      { status: 503 }
    );
  }

  return NextResponse.json({
    id: parsed.data.requestId,
    status: "demo",
    demo: true,
    kind: parsed.data.kind,
    message: "Demo workflow completed. No provider was contacted and no paid media was generated.",
    prompt: parsed.data.prompt,
    createdAt: new Date().toISOString(),
  });
}
