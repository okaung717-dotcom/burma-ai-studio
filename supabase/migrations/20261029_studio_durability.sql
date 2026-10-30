-- Burma AI Studio durability and shared-auth additions.
-- Additive only. Apply to staging first, verify, then apply to production manually.

create table if not exists public.studio_admin_sessions (
  session_id uuid primary key,
  principal_id uuid not null,
  username text not null check (char_length(username) between 1 and 64),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_seen_at timestamptz not null default now()
);

create index if not exists studio_admin_sessions_expiry_idx
  on public.studio_admin_sessions(expires_at) where revoked_at is null;

alter table public.studio_admin_sessions enable row level security;
revoke all on public.studio_admin_sessions from public, anon, authenticated;

create table if not exists public.studio_login_attempts (
  key_hash text primary key check (char_length(key_hash) = 64),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  window_started_at timestamptz not null default now(),
  blocked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.studio_login_attempts enable row level security;
revoke all on public.studio_login_attempts from public, anon, authenticated;

create or replace function public.consume_studio_login_attempt(
  p_key text,
  p_limit integer default 5,
  p_window_seconds integer default 900
) returns table(allowed boolean, retry_after integer, attempt_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_row public.studio_login_attempts;
  v_window integer := greatest(60, least(p_window_seconds, 86400));
  v_limit integer := greatest(2, least(p_limit, 20));
begin
  if p_key !~ '^[0-9a-f]{64}$' then raise exception 'invalid_rate_limit_key'; end if;

  insert into public.studio_login_attempts(key_hash, attempt_count, window_started_at, updated_at)
  values (p_key, 0, v_now, v_now)
  on conflict (key_hash) do nothing;

  select * into v_row from public.studio_login_attempts where key_hash = p_key for update;

  if v_row.window_started_at + make_interval(secs => v_window) <= v_now then
    v_row.attempt_count := 0;
    v_row.window_started_at := v_now;
    v_row.blocked_until := null;
  end if;

  v_row.attempt_count := v_row.attempt_count + 1;
  if v_row.attempt_count > v_limit then
    v_row.blocked_until := greatest(coalesce(v_row.blocked_until, v_now), v_row.window_started_at + make_interval(secs => v_window));
  end if;

  update public.studio_login_attempts set
    attempt_count = v_row.attempt_count,
    window_started_at = v_row.window_started_at,
    blocked_until = v_row.blocked_until,
    updated_at = v_now
  where key_hash = p_key;

  return query select
    v_row.attempt_count <= v_limit and coalesce(v_row.blocked_until <= v_now, true),
    case when v_row.blocked_until > v_now then ceil(extract(epoch from (v_row.blocked_until - v_now)))::integer else 0 end,
    v_row.attempt_count;
end;
$$;

revoke all on function public.consume_studio_login_attempt(text,integer,integer) from public, anon, authenticated;
grant execute on function public.consume_studio_login_attempt(text,integer,integer) to service_role;

create table if not exists public.studio_pages (
  id uuid primary key,
  space_id uuid not null references public.studio_spaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  position integer not null default 0,
  viewport jsonb not null default '{"x":0,"y":0,"zoom":1}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(space_id, position)
);

alter table public.studio_nodes add column if not exists page_id uuid references public.studio_pages(id) on delete cascade;
alter table public.studio_connections add column if not exists page_id uuid references public.studio_pages(id) on delete cascade;
alter table public.studio_connections add column if not exists client_id text;
alter table public.studio_nodes drop constraint if exists studio_nodes_node_type_check;
alter table public.studio_nodes add constraint studio_nodes_node_type_check
  check (node_type in ('creation','image','video','text','director','sticky','combiner','audio','panel','upload','note','group'));

create index if not exists studio_pages_space_idx on public.studio_pages(space_id, position);
create index if not exists studio_nodes_page_idx on public.studio_nodes(page_id);
create index if not exists studio_connections_page_idx on public.studio_connections(page_id);
create unique index if not exists studio_connections_client_idx on public.studio_connections(space_id, client_id) where client_id is not null;

create table if not exists public.studio_workspace_documents (
  space_id uuid primary key references public.studio_spaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  version integer not null default 2,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_image_records (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null check (char_length(prompt) between 1 and 4000),
  aspect_ratio text not null,
  quality text not null,
  favorite boolean not null default false,
  demo_only boolean not null default true check (demo_only = true),
  asset_id uuid references public.studio_assets(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.studio_pages enable row level security;
alter table public.studio_workspace_documents enable row level security;
alter table public.studio_image_records enable row level security;

drop policy if exists "owners manage pages" on public.studio_pages;
create policy "owners manage pages" on public.studio_pages for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "owners manage workspace documents" on public.studio_workspace_documents;
create policy "owners manage workspace documents" on public.studio_workspace_documents for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "owners manage image records" on public.studio_image_records;
create policy "owners manage image records" on public.studio_image_records for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- The custom administrator session is intentionally server-only. The server maps
-- BAS_ADMIN_USER_ID to an existing invited auth.users row before using service-role
-- persistence. Browser clients never receive the service key.
