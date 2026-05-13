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
Tracks Razorpay payments. FSM states: `INITIATED → SUCCESS | FAILED`.

```sql
create table payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  razorpay_order_id text unique,
  razorpay_payment_id text,           -- populated by webhook on SUCCESS
  receipt text,                        -- nn_<user_prefix>_<timestamp>
  amount int,
  status text check (status in ('INITIATED', 'SUCCESS', 'FAILED')) default 'INITIATED',
  created_at timestamp with time zone default now()
);
```

#### Migration (run in Supabase SQL Editor if table already exists)
```sql
-- Step 1: drop old constraint, rename state, add new columns
alter table payments
  drop constraint if exists payments_status_check;

alter table payments
  add column if not exists razorpay_payment_id text,
  add column if not exists receipt text;

-- rename existing PENDING rows to INITIATED
update payments set status = 'INITIATED' where status = 'PENDING';

-- Step 2: re-add constraint with new allowed values
alter table payments
  add constraint payments_status_check
  check (status in ('INITIATED', 'SUCCESS', 'FAILED'));
```


### 5. Submissions
Stores project submissions for each team. One submission per team (enforced by `UNIQUE(team_id)`).
Deadline is enforced server-side; client never controls it.

```sql
create table submissions (
  id            uuid default gen_random_uuid() primary key,

  -- One submission per team
  team_id       uuid references teams(id) on delete cascade unique not null,

  -- Core MVP fields
  title         text not null,
  description   text not null,
  track         text not null
    check (track in ('AI/ML', 'Web3', 'HealthTech', 'FinTech', 'OpenInnovation')),
  repo_url      text,           -- GitHub / GitLab link
  demo_url      text,           -- live demo or video link
  file_url      text,           -- Supabase Storage path for uploaded file

  -- Deadline & lifecycle
  deadline      timestamptz not null,  -- set server-side from SUBMISSION_DEADLINE env var
  submitted_at  timestamptz,           -- updated on every successful upsert
  status        text not null
    check (status in ('DRAFT', 'SUBMITTED', 'JUDGED'))
    default 'DRAFT',

  -- Judging (populated by admin/judge later)
  score         float default 0,
  judged_by     uuid references profiles(id),

  created_at    timestamptz default now()
);
```

> **FSM**: `DRAFT → SUBMITTED → JUDGED`
> See `/docs/submission_rules.md` for full deadline behavior, RLS policies, and migration SQL.
