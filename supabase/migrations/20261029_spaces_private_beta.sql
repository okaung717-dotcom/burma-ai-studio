-- Additive Burma AI Studio Spaces private-beta schema.
-- Review and apply manually. This migration does not modify or delete existing records.

create table if not exists public.studio_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.studio_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_spaces (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.studio_projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  viewport jsonb not null default '{"x":0,"y":0,"zoom":1}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_nodes (
  id uuid primary key,
  space_id uuid not null references public.studio_spaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  node_type text not null check (node_type in ('image','video','text','upload','director','note','group')),
  position jsonb not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_connections (
  id uuid primary key,
  space_id uuid not null references public.studio_spaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_node_id uuid not null references public.studio_nodes(id) on delete cascade,
  target_node_id uuid not null references public.studio_nodes(id) on delete cascade,
  source_handle text,
  target_handle text,
  created_at timestamptz not null default now(),
  unique (space_id, source_node_id, target_node_id, source_handle, target_handle)
);

create table if not exists public.studio_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.studio_projects(id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image','video','audio')),
  mime_type text not null,
  byte_size bigint not null check (byte_size > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.studio_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  idempotency_key uuid not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid not null references public.studio_spaces(id) on delete cascade,
  node_id uuid references public.studio_nodes(id) on delete set null,
  provider text not null,
  model text not null,
  kind text not null check (kind in ('image','video','director')),
  status text not null default 'queued' check (status in ('queued','reserved','running','succeeded','failed','cancelled')),
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  estimated_cost_micros bigint not null default 0 check (estimated_cost_micros >= 0),
  reserved_cost_micros bigint not null default 0 check (reserved_cost_micros >= 0),
  attempt_count integer not null default 0,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_budget_policy (
  id text primary key default 'global' check (id = 'global'),
  enabled boolean not null default false,
  emergency_stop boolean not null default true,
  daily_limit_micros bigint not null default 0 check (daily_limit_micros >= 0),
  per_user_daily_limit_micros bigint not null default 0 check (per_user_daily_limit_micros >= 0),
  updated_at timestamptz not null default now()
);

insert into public.studio_budget_policy (id) values ('global') on conflict (id) do nothing;

create table if not exists public.studio_audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.studio_provider_models (
  provider text not null,
  model text not null,
  kind text not null check (kind in ('image','video','director')),
  enabled boolean not null default false,
  estimated_cost_micros bigint not null default 0 check (estimated_cost_micros >= 0),
  capabilities jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (provider, model)
);

create table if not exists public.studio_usage_ledger (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null unique references public.studio_generation_jobs(id) on delete cascade,
  amount_micros bigint not null check (amount_micros >= 0),
  state text not null default 'reserved' check (state in ('reserved','charged','released')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.studio_generation_jobs add column if not exists lease_token uuid;
alter table public.studio_generation_jobs add column if not exists lease_expires_at timestamptz;
alter table public.studio_generation_jobs add column if not exists provider_job_id text;
alter table public.studio_generation_jobs add column if not exists next_attempt_at timestamptz not null default now();

create index if not exists studio_projects_owner_idx on public.studio_projects(owner_id, updated_at desc);
create index if not exists studio_spaces_project_idx on public.studio_spaces(project_id, updated_at desc);
create index if not exists studio_nodes_space_idx on public.studio_nodes(space_id);
create index if not exists studio_connections_space_idx on public.studio_connections(space_id);
create index if not exists studio_assets_owner_idx on public.studio_assets(owner_id, created_at desc);
create index if not exists studio_jobs_owner_idx on public.studio_generation_jobs(owner_id, created_at desc);
create index if not exists studio_jobs_queue_idx on public.studio_generation_jobs(status, next_attempt_at, created_at);
create index if not exists studio_usage_daily_idx on public.studio_usage_ledger(created_at, state);

alter table public.studio_memberships enable row level security;
alter table public.studio_projects enable row level security;
alter table public.studio_spaces enable row level security;
alter table public.studio_nodes enable row level security;
alter table public.studio_connections enable row level security;
alter table public.studio_assets enable row level security;
alter table public.studio_generation_jobs enable row level security;
alter table public.studio_budget_policy enable row level security;
alter table public.studio_audit_logs enable row level security;
alter table public.studio_provider_models enable row level security;
alter table public.studio_usage_ledger enable row level security;

drop policy if exists "members read self" on public.studio_memberships;
drop policy if exists "owners manage projects" on public.studio_projects;
drop policy if exists "owners manage spaces" on public.studio_spaces;
drop policy if exists "owners manage nodes" on public.studio_nodes;
drop policy if exists "owners manage connections" on public.studio_connections;
drop policy if exists "owners read assets" on public.studio_assets;
drop policy if exists "owners read jobs" on public.studio_generation_jobs;
drop policy if exists "owners read usage" on public.studio_usage_ledger;
create policy "members read self" on public.studio_memberships for select using (user_id = auth.uid());
create policy "owners manage projects" on public.studio_projects for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners manage spaces" on public.studio_spaces for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners manage nodes" on public.studio_nodes for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners manage connections" on public.studio_connections for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners read assets" on public.studio_assets for select using (owner_id = auth.uid());
create policy "owners read jobs" on public.studio_generation_jobs for select using (owner_id = auth.uid());
create policy "owners read usage" on public.studio_usage_ledger for select using (owner_id = auth.uid());

create or replace function public.reserve_studio_generation(
  p_owner_id uuid,
  p_space_id uuid,
  p_node_id uuid,
  p_idempotency_key uuid,
  p_provider text,
  p_model text,
  p_kind text,
  p_input jsonb
) returns public.studio_generation_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_policy public.studio_budget_policy;
  v_model public.studio_provider_models;
  v_existing public.studio_generation_jobs;
  v_global_used bigint;
  v_user_used bigint;
  v_job public.studio_generation_jobs;
begin
  select * into v_existing from public.studio_generation_jobs
    where idempotency_key = p_idempotency_key and owner_id = p_owner_id;
  if found then return v_existing; end if;

  if not exists (select 1 from public.studio_memberships where user_id = p_owner_id) then
    raise exception 'private_beta_membership_required';
  end if;
  if not exists (select 1 from public.studio_spaces where id = p_space_id and owner_id = p_owner_id) then
    raise exception 'space_access_denied';
  end if;

  select * into v_policy from public.studio_budget_policy where id = 'global' for update;
  if not found or not v_policy.enabled or v_policy.emergency_stop then
    raise exception 'generation_disabled';
  end if;
  select * into v_existing from public.studio_generation_jobs
    where idempotency_key = p_idempotency_key and owner_id = p_owner_id;
  if found then return v_existing; end if;
  select * into v_model from public.studio_provider_models
    where provider = p_provider and model = p_model and kind = p_kind and enabled = true;
  if not found then raise exception 'model_not_allowed'; end if;

  select coalesce(sum(amount_micros), 0) into v_global_used from public.studio_usage_ledger
    where state in ('reserved','charged') and created_at >= date_trunc('day', now());
  select coalesce(sum(amount_micros), 0) into v_user_used from public.studio_usage_ledger
    where owner_id = p_owner_id and state in ('reserved','charged') and created_at >= date_trunc('day', now());
  if v_global_used + v_model.estimated_cost_micros > v_policy.daily_limit_micros then
    raise exception 'global_budget_exceeded';
  end if;
  if v_user_used + v_model.estimated_cost_micros > v_policy.per_user_daily_limit_micros then
    raise exception 'user_budget_exceeded';
  end if;

  insert into public.studio_generation_jobs
    (idempotency_key, owner_id, space_id, node_id, provider, model, kind, status, input, estimated_cost_micros, reserved_cost_micros)
  values
    (p_idempotency_key, p_owner_id, p_space_id, p_node_id, p_provider, p_model, p_kind, 'reserved', p_input, v_model.estimated_cost_micros, v_model.estimated_cost_micros)
  returning * into v_job;
  insert into public.studio_usage_ledger(owner_id, job_id, amount_micros) values (p_owner_id, v_job.id, v_model.estimated_cost_micros);
  insert into public.studio_audit_logs(actor_id, action, target_type, target_id, metadata)
    values (p_owner_id, 'generation.reserved', 'generation_job', v_job.id::text, jsonb_build_object('cost_micros', v_model.estimated_cost_micros));
  return v_job;
end;
$$;

create or replace function public.complete_studio_generation(
  p_job_id uuid,
  p_lease_token uuid,
  p_status text,
  p_output jsonb default '{}'::jsonb,
  p_error_code text default null
) returns public.studio_generation_jobs
language plpgsql
security definer
set search_path = public
as $$
declare v_job public.studio_generation_jobs;
begin
  if p_status not in ('succeeded','failed','cancelled') then raise exception 'invalid_completion_status'; end if;
  update public.studio_generation_jobs set status = p_status, output = coalesce(p_output, '{}'::jsonb),
    error_code = left(p_error_code, 100), lease_token = null, lease_expires_at = null, updated_at = now()
    where id = p_job_id and lease_token = p_lease_token and status = 'running'
    returning * into v_job;
  if not found then raise exception 'job_lease_mismatch'; end if;
  update public.studio_usage_ledger set state = case when p_status = 'succeeded' then 'charged' else 'released' end, updated_at = now()
    where job_id = p_job_id and state = 'reserved';
  insert into public.studio_audit_logs(actor_id, action, target_type, target_id, metadata)
    values (v_job.owner_id, 'generation.' || p_status, 'generation_job', v_job.id::text, jsonb_build_object('error_code', p_error_code));
  return v_job;
end;
$$;

create or replace function public.claim_studio_generation(p_lease_seconds integer default 120)
returns public.studio_generation_jobs
language plpgsql
security definer
set search_path = public
as $$
declare v_job public.studio_generation_jobs;
begin
  select * into v_job from public.studio_generation_jobs
    where ((status in ('reserved','queued') and next_attempt_at <= now()) or (status = 'running' and lease_expires_at < now()))
      and attempt_count < 3
    order by created_at
    for update skip locked limit 1;
  if not found then return null; end if;
  update public.studio_generation_jobs set status = 'running', lease_token = gen_random_uuid(),
    lease_expires_at = now() + make_interval(secs => greatest(30, least(p_lease_seconds, 600))),
    attempt_count = attempt_count + 1, updated_at = now()
    where id = v_job.id returning * into v_job;
  return v_job;
end;
$$;

revoke all on function public.reserve_studio_generation(uuid,uuid,uuid,uuid,text,text,text,jsonb) from public, anon, authenticated;
revoke all on function public.claim_studio_generation(integer) from public, anon, authenticated;
revoke all on function public.complete_studio_generation(uuid,uuid,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.reserve_studio_generation(uuid,uuid,uuid,uuid,text,text,text,jsonb) to service_role;
grant execute on function public.claim_studio_generation(integer) to service_role;
grant execute on function public.complete_studio_generation(uuid,uuid,text,jsonb,text) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('studio-media', 'studio-media', false, 52428800, array['image/png','image/jpeg','image/webp','video/mp4','video/webm'])
on conflict (id) do nothing;

drop policy if exists "members read own studio media" on storage.objects;
create policy "members read own studio media" on storage.objects for select to authenticated
  using (bucket_id = 'studio-media' and (storage.foldername(name))[1] = auth.uid()::text);

-- Writes to assets/jobs, budget changes, invitations and audit logs are intentionally
-- server-only through the service role. Keep paid generation disabled until an atomic
-- reservation RPC and durable worker have been deployed and tested.
