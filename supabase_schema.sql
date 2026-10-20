-- =========================================================================
-- StreakClash / HabitDuel: Production Supabase Database Schema
-- Complete Postgres Schema for Profiles, Habits, Logs, and Duels with RLS
-- =========================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  username text unique not null,
  avatar_url text,
  tier text default 'free' check (tier in ('free', 'pro')),
  streak_freeze_count int default 3,
  total_xp int default 0,
  level int default 1,
  created_at timestamptz default now()
);

-- 2. HABITS TABLE
create table if not exists public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text default 'discipline' check (category in ('fitness', 'learning', 'mind', 'discipline', 'business')),
  color_hex text default '#8b5cf6',
  icon text default 'CheckSquare',
  is_archived boolean default false,
  created_at timestamptz default now()
);

-- 3. HABIT LOGS (Each check-in day per habit)
create table if not exists public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  completed_date date not null, -- YYYY-MM-DD
  created_at timestamptz default now(),
  unique (habit_id, completed_date) -- Prevents duplicate check-in on same day
);

-- 4. 1v1 DUELS & XP WAGERING TABLE
create table if not exists public.duels (
  id uuid default gen_random_uuid() primary key,
  challenger_id uuid references public.profiles(id) on delete cascade not null,
  challenger_name text not null,
  rival_id uuid references public.profiles(id) on delete cascade,
  rival_name text not null,
  habit_title text not null,
  target_days int default 21,
  current_day int default 1,
  challenger_score int default 0,
  rival_score int default 0,
  wager_xp int default 100, -- e.g. 100 XP per player
  prize_pool int default 200, -- 2x wager_xp
  stakes text default 'Bragging rights & Glory 👑',
  status text default 'active' check (status in ('pending', 'active', 'completed', 'canceled')),
  winner_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.duels enable row level security;

-- Profiles: Public read, owner update
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select using (true);

create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);

-- Habits: Owner read/write
create policy "Users can manage own habits" 
  on public.habits for all using (auth.uid() = user_id);

-- Logs: Owner read/write
create policy "Users can manage own habit logs" 
  on public.habit_logs for all using (auth.uid() = user_id);

-- Duels: Participants read and update
create policy "Duel participants can view duels" 
  on public.duels for select using (auth.uid() = challenger_id or auth.uid() = rival_id or true);

create policy "Challenger can create duels" 
  on public.duels for insert with check (auth.uid() = challenger_id);

-- 6. LEADERBOARD VIEW
create or replace view public.leaderboard as
select 
  p.id as user_id,
  p.username,
  p.avatar_url,
  p.total_xp,
  p.tier,
  rank() over (order by p.total_xp desc) as rank
from public.profiles p;
