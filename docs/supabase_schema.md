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
  role text check (role in ('USER', 'ADMIN', 'JUDGE')) default 'USER',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 2. Teams
Stores hackathon teams.
```sql
create table teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  invite_code text unique default substr(md5(random()::text), 0, 8),
  created_at timestamp with time zone default now()
);
```

### 3. Team Members
Links users to teams with specific roles.
```sql
create table team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references teams(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text check (role in ('LEADER', 'MEMBER')) default 'MEMBER',
  unique(team_id, user_id)
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
