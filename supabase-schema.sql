-- Run this once in the Supabase SQL Editor.

-- 1. Profiles table: one row per student, linked to their auth account.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  year text,
  major text,
  phone text,
  email text,
  photo_url text,
  resume_url text,
  bio text,
  qualifications text[] default '{}',
  classes text[] default '{}',
  created_at timestamptz default now()
);

-- 2. Papers
create table papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text,
  year int,
  venue text,
  url text not null,
  added_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 3. Photos
create table photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text not null,
  author text,
  photo_date date,
  added_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 4. Observing night signups
create table signups (
  id uuid primary key default gen_random_uuid(),
  observing_date date not null,
  student_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (observing_date, student_id)
);

-- Row Level Security: public can READ everything (profiles, papers, photos).
-- Only logged-in users can WRITE, and only to their own rows where relevant.
-- Signups are private - only visible to logged-in users.

alter table profiles enable row level security;
alter table papers enable row level security;
alter table photos enable row level security;
alter table signups enable row level security;

-- Profiles: publicly readable (for the public homepage), only the owner can edit their own.
create policy "Profiles are publicly readable" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Papers: publicly readable, any logged-in user can add.
create policy "Papers are publicly readable" on papers for select using (true);
create policy "Logged-in users can add papers" on papers for insert with check (auth.uid() is not null);

-- Photos: publicly readable, any logged-in user can add.
create policy "Photos are publicly readable" on photos for select using (true);
create policy "Logged-in users can add photos" on photos for insert with check (auth.uid() is not null);

-- Signups: only visible to logged-in users. Students can only sign up/cancel themselves.
create policy "Signups visible to logged-in users" on signups for select using (auth.uid() is not null);
create policy "Users can sign themselves up" on signups for insert with check (auth.uid() = student_id);
create policy "Users can cancel their own signup" on signups for delete using (auth.uid() = student_id);
