import "server-only";

import { supabaseRequest } from "../supabase";

export type GenerationJob = {
  id: string;
  owner_id: string;
  provider: string;
  model: string;
  kind: "image" | "video" | "director";
  status: string;
  input: Record<string, unknown>;
  lease_token?: string;
  attempt_count: number;
};

export async function reserveGeneration(input: {
  ownerId: string;
  spaceId: string;
  nodeId?: string;
  requestId: string;
  provider: string;
  model: string;
  kind: GenerationJob["kind"];
  payload: Record<string, unknown>;
}) {
  return supabaseRequest<GenerationJob>("rpc/reserve_studio_generation", {
    method: "POST",
    body: JSON.stringify({
      p_owner_id: input.ownerId,
      p_space_id: input.spaceId,
      p_node_id: input.nodeId || null,
      p_idempotency_key: input.requestId,
      p_provider: input.provider,
      p_model: input.model,
      p_kind: input.kind,
      p_input: input.payload,
    }),
  });
}

export async function claimGeneration() {
  return supabaseRequest<GenerationJob | null>("rpc/claim_studio_generation", {
    method: "POST",
    body: JSON.stringify({ p_lease_seconds: 120 }),
  });
}

export async function finishGeneration(job: GenerationJob, result: { status: "succeeded" | "failed"; output?: Record<string, unknown>; errorCode?: string }) {
  return supabaseRequest<GenerationJob>("rpc/complete_studio_generation", {
    method: "POST",
    body: JSON.stringify({
      p_job_id: job.id,
      p_lease_token: job.lease_token,
      p_status: result.status,
      p_output: result.output || {},
      p_error_code: result.errorCode || null,
    }),
  });
}
