import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { executeProviderJob } from "../../../lib/ai/adapter";
import { claimGeneration, finishGeneration } from "../../../lib/ai/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.BAS_WORKER_SECRET || "";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (expected.length < 32 || supplied.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (process.env.BAS_ENABLE_PAID_GENERATION !== "true") {
    return NextResponse.json({ error: "Paid generation is disabled." }, { status: 503 });
  }

  const job = await claimGeneration();
  if (!job) return NextResponse.json({ ok: true, claimed: false });
  try {
    const result = await executeProviderJob(job);
    await finishGeneration(job, { status: "succeeded", output: result.output });
    return NextResponse.json({ ok: true, claimed: true, jobId: job.id });
  } catch (error) {
    const code = error instanceof Error ? error.message.slice(0, 100) : "provider_error";
    await finishGeneration(job, { status: "failed", errorCode: code });
    return NextResponse.json({ ok: false, claimed: true, jobId: job.id, error: "Provider execution failed." }, { status: 502 });
  }
}
