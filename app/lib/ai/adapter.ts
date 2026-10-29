import "server-only";

import type { GenerationJob } from "./jobs";

export type ProviderResult = { providerJobId?: string; output: Record<string, unknown> };

export async function executeProviderJob(job: GenerationJob): Promise<ProviderResult> {
  void job;
  if (process.env.BAS_ENABLE_PAID_GENERATION !== "true") {
    throw new Error("paid_generation_disabled");
  }

  // Provider HTTP execution is intentionally fail-closed until model identifiers,
  // webhook signatures, callback URLs and account budgets are configured and
  // verified against the owner's provider accounts.
  throw new Error("provider_adapter_not_activated");
}
