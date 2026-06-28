-- Burma AI Studio Supabase schema
-- Run this once in Supabase SQL Editor before deploying the Vercel env variables.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id text primary key,
  created_at timestamptz not null default now(),
  full_name text,
  email text,
  phone text,
  source text,
  status text not null default 'New',
  payload jsonb not null default '{}'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

create table if not exists public.lead_statuses (
  lead_id text primary key,
  status text not null default 'New',
  note text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_logs (
  id text primary key,
  visitor_id text not null default 'unknown',
  role text not null default 'user',
  content text not null default '',
  page text not null default '/',
  language text not null default 'Unknown',
  created_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists chat_logs_created_at_idx on public.chat_logs (created_at desc);
create index if not exists chat_logs_visitor_id_idx on public.chat_logs (visitor_id);

create table if not exists public.chat_states (
  visitor_id text primary key,
  state text not null default 'Open',
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id text primary key,
  src text not null,
  title_en text not null default 'AI Video Project',
  desc_en text not null default 'Burma AI Studio portfolio video',
  title_mm text not null default 'AI Video Project',
  desc_mm text not null default 'Burma AI Studio portfolio video',
  featured boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_items_sort_order_idx on public.portfolio_items (sort_order asc);

create table if not exists public.analytics_events (
  id text primary key,
  visitor_id text,
  event_type text not null default 'page-view',
  path text not null default '/',
  page text not null default '/',
  source text not null default 'Direct',
  device text not null default 'Unknown',
  language text not null default 'Unknown',
  timezone text not null default 'Unknown',
  country text not null default 'Unknown',
  video_id text,
  video_title text,
  day date,
  created_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_day_idx on public.analytics_events (day);
create index if not exists analytics_events_event_type_idx on public.analytics_events (event_type);

create table if not exists public.content_settings (
  id text primary key default 'default',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 1,
  reset_at timestamptz not null default now()
);

create index if not exists rate_limits_reset_at_idx on public.rate_limits (reset_at);

alter table public.leads enable row level security;
alter table public.lead_statuses enable row level security;
alter table public.chat_logs enable row level security;
alter table public.chat_states enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.analytics_events enable row level security;
alter table public.content_settings enable row level security;
alter table public.rate_limits enable row level security;

-- This project reads/writes from server-side API routes using SUPABASE_SERVICE_ROLE_KEY.
-- Service role bypasses RLS, so no public policies are required for these private admin tables.
