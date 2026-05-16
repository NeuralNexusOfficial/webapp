# Judge Assignment Model

## Overview
To facilitate organized evaluation of submissions, NeuralNexus uses a manual judge assignment system for its MVP. Admins assign specific Judges to review specific Submissions.

## Entity Relationship
The relationship between a `Judge` (a `Profile` with `role = 'JUDGE'`) and a `Submission` is **Many-to-Many**.
- A single submission can be evaluated by multiple judges to ensure fair grading.
- A single judge can be assigned multiple submissions to evaluate.

This relationship is managed by the `judge_assignments` mapping table.

## The `judge_assignments` Table
```sql
create table judge_assignments (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid references submissions(id) on delete cascade not null,
  judge_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(submission_id, judge_id)
);
```

## Workflow
1. **Assignment (Admin Panel):** An Admin navigates to the `/admin` panel, selects a submission, and clicks "Assign Judge". They select a judge from the list of registered judges.
2. **Evaluation (Judge Panel):** A Judge logs into the `/judge` panel. They only see submissions that have been explicitly assigned to them in the `judge_assignments` table.
3. **Scoring:** The Judge evaluates the submission and submits a score. The score is recorded in the `scores` table with their `judge_id`.

## Future Enhancements (Post-MVP)
- **Auto-Assignment:** Implement an algorithm to automatically distribute submissions evenly among available judges based on track expertise and workload.
- **Conflict of Interest:** Allow judges to recuse themselves from submissions they are affiliated with.
