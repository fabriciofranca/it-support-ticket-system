-- ============================================================
-- IT Support Ticket System - Supabase database schema
-- Run this in the Supabase dashboard: SQL Editor -> New query
-- ============================================================

-- 1) Tickets table
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null check (category in ('Hardware','Software','Network','Account','Other')),
  priority text not null check (priority in ('Low','Medium','High')),
  description text not null,
  status text not null default 'Open' check (status in ('Open','In Progress','Resolved')),
  created_at timestamptz not null default now()
);

-- 2) Enable Row Level Security
alter table public.tickets enable row level security;

-- 3) Policies: each user can only access their own rows (auth.uid() = user_id)
create policy "select own tickets" on public.tickets
  for select using (auth.uid() = user_id);

create policy "insert own tickets" on public.tickets
  for insert with check (auth.uid() = user_id);

create policy "update own tickets" on public.tickets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "delete own tickets" on public.tickets
  for delete using (auth.uid() = user_id);
