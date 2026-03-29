-- Dia a Dia - Supabase Schema
-- Run this in the Supabase SQL editor to set up the database

-- Study: subjects and weekly tasks
create table subjects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  color text not null default '#4f8cff',
  created_at timestamptz default now()
);

create table study_tasks (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references subjects(id) on delete cascade,
  day text not null,
  task text not null,
  done boolean default false,
  week_start date not null default (date_trunc('week', current_date)::date),
  created_at timestamptz default now()
);

-- Sleep: goals and records
create table sleep_goals (
  id uuid default gen_random_uuid() primary key,
  hours numeric not null default 8,
  bedtime time not null default '23:00',
  wakeup time not null default '07:00',
  created_at timestamptz default now()
);

create table sleep_records (
  id uuid default gen_random_uuid() primary key,
  date date not null default current_date,
  bedtime text not null,
  wakeup text not null,
  hours numeric not null,
  created_at timestamptz default now()
);

-- Gym: routines, exercises, and attendance
create table routines (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now()
);

create table exercises (
  id uuid default gen_random_uuid() primary key,
  routine_id uuid references routines(id) on delete cascade,
  name text not null,
  sets integer not null default 4,
  reps text not null default '10-12',
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table gym_log (
  id uuid default gen_random_uuid() primary key,
  date date not null default current_date,
  routine_id uuid references routines(id) on delete set null,
  completed boolean default false,
  created_at timestamptz default now()
);

-- Reading: books
create table books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text,
  total_pages integer not null,
  current_page integer default 0,
  goal text,
  notes text,
  start_date date default current_date,
  created_at timestamptz default now()
);

-- Storage bucket for future use (book covers, etc.)
-- Run in Supabase dashboard: create a bucket called 'uploads'

-- RLS policies (permissive for now, no auth)
alter table subjects enable row level security;
alter table study_tasks enable row level security;
alter table sleep_goals enable row level security;
alter table sleep_records enable row level security;
alter table routines enable row level security;
alter table exercises enable row level security;
alter table gym_log enable row level security;
alter table books enable row level security;

-- Allow all operations (single user app, no auth yet)
create policy "Allow all" on subjects for all using (true) with check (true);
create policy "Allow all" on study_tasks for all using (true) with check (true);
create policy "Allow all" on sleep_goals for all using (true) with check (true);
create policy "Allow all" on sleep_records for all using (true) with check (true);
create policy "Allow all" on routines for all using (true) with check (true);
create policy "Allow all" on exercises for all using (true) with check (true);
create policy "Allow all" on gym_log for all using (true) with check (true);
create policy "Allow all" on books for all using (true) with check (true);
