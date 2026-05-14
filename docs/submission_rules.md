# Submission Rules & Deadline Behavior — NeuralNexus

## Overview

Each **team** submits exactly one project. Submissions are created or updated any number of
times before the deadline; once the deadline passes, the backend rejects all writes.

---

## Submission Schema (MVP)

```sql
create table submissions (
  id            uuid default gen_random_uuid() primary key,

  -- One submission per team (enforced by UNIQUE)
  team_id       uuid references teams(id) on delete cascade unique not null,

  -- Core fields
  title         text not null,
  description   text not null,
  track         text not null
    check (track in ('AI/ML', 'Web3', 'HealthTech', 'FinTech', 'OpenInnovation')),
  repo_url      text,                     -- GitHub / GitLab repo link
  demo_url      text,                     -- live demo or video link
  file_url      text,                     -- optional uploaded file (stored in Supabase Storage)

  -- Deadline & lifecycle
  deadline      timestamptz not null,     -- set server-side; NOT user-supplied
  submitted_at  timestamptz,              -- NULL until first save; updated on every upsert
  status        text not null
    check (status in ('DRAFT', 'SUBMITTED', 'JUDGED'))
    default 'DRAFT',

  -- Judging (populated later)
  score         float  default 0,
  judged_by     uuid   references profiles(id),

  created_at    timestamptz default now()
);
```

> **Migration** — If the `submissions` table already exists from a previous schema,
> run the migration below in the Supabase SQL Editor:
>
> ```sql
> alter table submissions
>   add column if not exists title       text,
>   add column if not exists track       text,
>   add column if not exists repo_url    text,
>   add column if not exists demo_url    text,
>   add column if not exists file_url    text,
>   add column if not exists deadline    timestamptz,
>   add column if not exists submitted_at timestamptz,
>   add column if not exists status      text default 'DRAFT';
>
> -- Rename old columns to new names if applicable
> -- (only if you had project_name / video_link / github_link from schema v1)
> alter table submissions rename column project_name  to title;
> alter table submissions rename column github_link   to repo_url;
> alter table submissions rename column video_link    to demo_url;
>
> -- Re-add constraint
> alter table submissions
>   add constraint submissions_track_check
>     check (track in ('AI/ML','Web3','HealthTech','FinTech','OpenInnovation'));
>
> alter table submissions
>   add constraint submissions_status_check
>     check (status in ('DRAFT','SUBMITTED','JUDGED'));
> ```

---

## Field Reference

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `team_id` | uuid | ✅ | FK → `teams.id`, UNIQUE — one submission per team |
| `title` | text | ✅ | Project display name |
| `description` | text | ✅ | What the project does (max ~1 000 chars recommended) |
| `track` | enum | ✅ | AI/ML · Web3 · HealthTech · FinTech · OpenInnovation |
| `repo_url` | text | ❌ | GitHub/GitLab link |
| `demo_url` | text | ❌ | Live URL or YouTube/Loom demo |
| `file_url` | text | ❌ | Supabase Storage path for any uploaded file |
| `deadline` | timestamptz | server-set | Written once by the backend; never sent from the client |
| `submitted_at` | timestamptz | auto | Updated to `now()` on every successful upsert |
| `status` | enum | auto | `DRAFT → SUBMITTED → JUDGED` |

---

## Submission FSM

```
  (team created)
       │
       ▼
    DRAFT ──── upsert pre-deadline ────▶ DRAFT (updated)
       │
   deadline passed
   OR explicit submit
       │
       ▼
   SUBMITTED ──── judging ────▶ JUDGED
```

- **DRAFT**: Editable. Any number of upserts allowed pre-deadline.
- **SUBMITTED**: Written by the backend at submission time (or auto-transitioned at deadline). Read-only for participants.
- **JUDGED**: Score and `judged_by` fields populated by admin/judge. Final state.

---

## Deadline Behavior

### Server-Side Enforcement

The backend endpoint (`POST /api/submissions`) **always checks the deadline** before writing:

```typescript
const SUBMISSION_DEADLINE = new Date(process.env.SUBMISSION_DEADLINE!);

if (new Date() > SUBMISSION_DEADLINE) {
  return NextResponse.json({ error: 'Submission deadline has passed' }, { status: 403 });
}
```

`SUBMISSION_DEADLINE` is set in `.env.local` (ISO 8601 string). The client never controls this.

### Rules

1. **One submission per team** — enforced by `UNIQUE(team_id)` at the DB level.
   - First write: `INSERT`.
   - Subsequent writes: `UPDATE` (upsert pattern).
2. **Deadline is mandatory** — the endpoint rejects requests after `SUBMISSION_DEADLINE`.
3. **Partial saves are allowed** — only `title`, `description`, `track` are required.
   `repo_url`, `demo_url`, `file_url` are optional and can be filled later pre-deadline.
4. **File Upload Constraints**:
   - **Storage Bucket**: Uploads go to the Supabase Storage bucket `submission-files`.
   - **Allowed Formats**: `.pdf`, `.ppt`, `.pptx`, `.doc`, `.docx`.
   - **Max File Size**: 20 MB.
   - **Field**: The public URL is stored in the `file_url` column of the `submissions` table.
5. **`submitted_at` is updated on every save** — it is the timestamp of the *last* save,
   not the first.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUBMISSION_DEADLINE` | ISO 8601 deadline, e.g. `2026-06-01T18:00:00+05:30` |

Add to `.env.local`:
```env
SUBMISSION_DEADLINE=2026-06-01T18:00:00+05:30
```

---

## Row-Level Security (RLS)

```sql
-- Teams can read their own submission
create policy "team can read own submission"
  on submissions for select
  using (
    team_id in (
      select team_id from team_members where user_id = auth.uid()
    )
  );

-- Team members can upsert their team's submission (pre-deadline enforced in app layer)
create policy "team can upsert submission"
  on submissions for insert
  with check (
    team_id in (
      select team_id from team_members where user_id = auth.uid()
    )
  );

create policy "team can update submission"
  on submissions for update
  using (
    team_id in (
      select team_id from team_members where user_id = auth.uid()
    )
  );

-- Admins and judges can read all submissions
create policy "admin/judge read all"
  on submissions for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('ADMIN', 'JUDGE')
    )
  );
```
