# Admin Panel MVP & Scoring System — NeuralNexus

## Overview

The Admin Panel MVP provides a centralized interface for hackathon organizers (Admins) and evaluators (Judges) to review project submissions, apply filters, read details, and assign scores based on standardized criteria.

---

## 1. Admin Panel MVP Features

### A. List View & Filters
The main dashboard for admins/judges will display a table or grid of all project submissions.
- **Track Filter:** Filter submissions by track (`AI/ML`, `Web3`, `HealthTech`, `FinTech`, `OpenInnovation`, or `All`).
- **Status Filter:** Filter by submission state (`DRAFT`, `SUBMITTED`, `JUDGED`, or `All`).
- **Data Displayed:** Team Name/ID, Project Title, Track, Status, and Aggregate Score (if any).

### B. Submission Details View
Clicking on a submission in the list opens a detailed view showing:
- **Project Title & Description**
- **Track**
- **Links:** Repository URL and Demo URL (clickable)
- **Uploaded File:** Download/view link for the uploaded presentation/doc (`.pdf`, `.ppt`, etc.)
- **Status & Timestamps:** Submitted at, Deadline status.

### C. Enter Scores
Judges and Admins will have a "Score Card" section on the Submission Details view to input scores across predefined criteria and leave optional feedback.

---

## 2. Scoring Criteria

Each submission is evaluated on a **1 to 10 scale** across five distinct criteria, resulting in a maximum total score of **50 points per judge**.

1. **Innovation & Originality (1-10)**
   - *Is the idea unique? Does it approach the problem from a novel perspective or combine technologies in a fresh way?*
2. **Technical Execution (1-10)**
   - *How complex is the underlying technology? Is the code well-structured, functional, and largely bug-free?*
3. **Design & UX (1-10)**
   - *Is the interface intuitive and aesthetically pleasing? Does it provide a smooth and logical user journey?*
4. **Business / Social Impact (1-10)**
   - *Does the project solve a real-world problem? What is the viability of the project and its potential reach?*
5. **Presentation & Demo (1-10)**
   - *How clear was the explanation? Does the demo effectively showcase the core features? Is the documentation comprehensive?*

---

## 3. Data Model for Scores

To support multiple judges scoring the same submission, a new `scores` table will be created. This replaces or supplements the single `score` column previously found in the `submissions` table, allowing for a 1-to-many relationship (one submission, multiple judge scores).

### Schema Definition

```sql
create table scores (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid references submissions(id) on delete cascade not null,
  judge_id uuid references profiles(id) on delete cascade not null,

  -- Individual criteria scores (1-10 scale)
  innovation_score int not null check (innovation_score between 1 and 10),
  technical_score int not null check (technical_score between 1 and 10),
  design_score int not null check (design_score between 1 and 10),
  impact_score int not null check (impact_score between 1 and 10),
  presentation_score int not null check (presentation_score between 1 and 10),

  -- Total score can be a calculated column or computed on the fly
  total_score int generated always as (
    innovation_score + technical_score + design_score + impact_score + presentation_score
  ) stored,

  -- Qualitative feedback
  feedback text,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Ensure a judge can only score a specific submission once
  unique(submission_id, judge_id)
);
```

### Row-Level Security (RLS) for Scores
- **Judges/Admins** can insert or update their own scores (`auth.uid() = judge_id`).
- **Judges/Admins** can read all scores (to see aggregate averages).
- **Participants** should *not* be able to read scores (or can only read aggregate scores if the hackathon is completely over, based on business logic).
