-- Burma AI Studio: opt-in email member access foundation.
-- PREVIEW/STAGING ONLY until approved. Depends on 20261029_spaces_private_beta.sql.
-- No existing account or workspace is deleted or rewritten.

create table if not exists public.studio_member_plans (
  code text primary key check (code ~ '^[a-z][a-z0-9_-]{1,31}$'),
  name text not null check (char_length(name) between 1 and 80),
  monthly_credits bigint not null default 0 check (monthly_credits >= 0),
  price_minor bigint not null default 0 check (price_minor >= 0),
  currency text not null default 'MMK' check (currency ~ '^[A-Z]{3}$'),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.studio_member_plans(code, name, monthly_credits, price_minor, currency, active)
values ('starter', 'Starter', 0, 0, 'MMK', true),
       ('pro', 'Pro', 0, 0, 'MMK', true),
       ('premium', 'Premium', 0, 0, 'MMK', true)
on conflict (code) do nothing;
-- Pricing and credits must be configured explicitly by the owner before paid usage.

create table if not exists public.studio_member_accounts (
  user_id uuid primary key references public.studio_memberships(user_id) on delete cascade,
  email text not null unique check (email = lower(trim(email)) and char_length(email) between 3 and 254),
  status text not null default 'invited'
    check (status in ('invited', 'active', 'suspended', 'expired')),
  plan_code text not null default 'starter' references public.studio_member_plans(code),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists studio_member_accounts_status_idx
  on public.studio_member_accounts(status, plan_code);

create table if not exists public.studio_member_wallets (
  user_id uuid primary key references public.studio_member_accounts(user_id) on delete cascade,
  credits_balance bigint not null default 0 check (credits_balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_member_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.studio_member_accounts(user_id) on delete cascade,
  operation_key text not null unique check (char_length(operation_key) between 8 and 160),
  amount bigint not null check (amount <> 0),
  reason text not null check (char_length(reason) between 1 and 120),
  created_at timestamptz not null default now()
);
create index if not exists studio_member_credit_ledger_user_idx
  on public.studio_member_credit_ledger(user_id, created_at desc);

create table if not exists public.studio_member_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  subject_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 1 and 100),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists studio_member_audit_created_idx
  on public.studio_member_audit(created_at desc);

alter table public.studio_member_plans enable row level security;
alter table public.studio_member_accounts enable row level security;
alter table public.studio_member_wallets enable row level security;
alter table public.studio_member_credit_ledger enable row level security;
alter table public.studio_member_audit enable row level security;

revoke all on public.studio_member_plans, public.studio_member_accounts,
  public.studio_member_wallets, public.studio_member_credit_ledger,
  public.studio_member_audit from public, anon, authenticated;

grant select on public.studio_member_plans to authenticated;
grant select on public.studio_member_accounts to authenticated;
grant select on public.studio_member_wallets to authenticated;
grant select on public.studio_member_credit_ledger to authenticated;

create policy studio_member_plans_read on public.studio_member_plans
  for select to authenticated using (active);
create policy studio_member_accounts_self on public.studio_member_accounts
  for select to authenticated using (auth.uid() = user_id);
create policy studio_member_wallets_self on public.studio_member_wallets
  for select to authenticated using (auth.uid() = user_id);
create policy studio_member_ledger_self on public.studio_member_credit_ledger
  for select to authenticated using (auth.uid() = user_id);
-- No client policy permits modifying membership, wallet balances, audit or billing.

create or replace function public.studio_provision_invited_member(
  p_user_id uuid,
  p_email text,
  p_plan_code text default 'starter'
) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if p_user_id is null or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\\.[^[:space:]@]+$' then
    raise exception 'invalid_invitation_account';
  end if;
  if not exists (select 1 from public.studio_member_plans where code = p_plan_code and active) then
    raise exception 'invalid_plan';
  end if;
  insert into public.studio_memberships(user_id, role)
  values (p_user_id, 'member')
  on conflict (user_id) do nothing;
  insert into public.studio_member_accounts(user_id, email, plan_code)
  values (p_user_id, v_email, p_plan_code)
  on conflict (user_id) do nothing;
  insert into public.studio_member_wallets(user_id) values (p_user_id)
  on conflict (user_id) do nothing;
  insert into public.studio_member_audit(subject_id, action, details)
  values (p_user_id, 'member_invited', jsonb_build_object('plan', p_plan_code));
end;
$$;
revoke all on function public.studio_provision_invited_member(uuid,text,text) from public, anon, authenticated;
grant execute on function public.studio_provision_invited_member(uuid,text,text) to service_role;

-- Provision the owner manually after verifying their Supabase Auth user ID:
--   INSERT INTO public.studio_memberships(user_id, role) VALUES ('OWNER-UUID', 'admin')
--     ON CONFLICT (user_id) DO UPDATE SET role='admin';
--   INSERT INTO public.studio_member_accounts(user_id,email,status,plan_code)
--     VALUES ('OWNER-UUID','owner@example.com','active','starter')
--     ON CONFLICT (user_id) DO UPDATE SET status='active';
-- Never bootstrap admin access using an email alone or a browser-supplied role.
