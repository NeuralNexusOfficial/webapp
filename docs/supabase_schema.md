# Supabase Schema v1

This document outlines the database schema for the NeuralNexus hackathon platform.

## Tables

### 1. Profiles
Linked to `auth.users`, stores user-specific information and roles.
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text unique,
  phone text,
  college_company text,
  role text check (role in ('USER', 'ADMIN', 'JUDGE')) default 'USER',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a profile for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 2. Teams
Stores hackathon teams. `team_owner_id` is denormalized for fast ownership checks.
```sql
create table teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  invite_code text unique not null,
  team_owner_id uuid not null references profiles(id),
  max_members int not null default 4 check (max_members between 2 and 5),
  status text check (status in ('FORMING','LOCKED','SUBMITTED','JUDGED')) default 'FORMING',
  created_at timestamp with time zone default now()
);
```

### 3. Team Members
Links users to teams. `UNIQUE(user_id)` enforces **one active team per user** at the DB level.
```sql
create table team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references teams(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text check (role in ('LEADER', 'MEMBER')) default 'MEMBER',
  joined_at timestamp with time zone default now(),
  unique(team_id, user_id),  -- no duplicate membership
  unique(user_id)             -- one active team per user
);
```

### 4. Payments
Tracks Razorpay payments for hackathon registration or other fees.
```sql
create table payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  razorpay_order_id text unique,
  amount int,
  status text check (status in ('PENDING', 'SUCCESS', 'FAILED')) default 'PENDING',
  created_at timestamp with time zone default now()
);
```

### 5. Submissions
Stores project submissions for each team.
```sql
create table submissions (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references teams(id) unique,
  project_name text,
  description text,
  video_link text,
  github_link text,
  score float default 0,
  judged_by uuid references profiles(id),
  created_at timestamp with time zone default now()
);
```
