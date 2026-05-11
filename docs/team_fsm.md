# Team FSM & Design Doc

## Overview

Each hackathon team is owned by a single user (the team leader). A user can belong to **at most one active team** at any time — either as owner or member.

---

## Core Constraints

| Rule | Enforcement |
|---|---|
| One active team per user | `UNIQUE(user_id)` on `team_members` |
| Every team has an owner | `team_owner_id uuid NOT NULL` references `profiles(id)` |
| Team size limit | `max_members int NOT NULL DEFAULT 4` |
| Invite code is unique & 8-char | `UNIQUE`, generated server-side via `crypto.randomBytes` |

---

## Team States (FSM)

```
         ┌─────────────┐
         │   FORMING   │  ← team created, invite code active, slots open
         └──────┬──────┘
                │  all slots filled OR owner locks team
                ▼
         ┌─────────────┐
         │    LOCKED   │  ← no new members can join; submission phase
         └──────┬──────┘
                │  submission made
                ▼
         ┌─────────────┐
         │  SUBMITTED  │  ← project submitted, under review
         └──────┬──────┘
                │  judging complete
                ▼
         ┌─────────────┐
         │   JUDGED    │  ← final state; score assigned
         └─────────────┘
```

### State field
`status text CHECK (status IN ('FORMING','LOCKED','SUBMITTED','JUDGED')) DEFAULT 'FORMING'`

---

## API Contract

### POST `/api/teams/create`
Creates a new team. Caller becomes the owner and first member.

**Request body:**
```json
{
  "name": "Team Nexus",
  "max_members": 4
}
```

**Response (201):**
```json
{
  "id": "<uuid>",
  "name": "Team Nexus",
  "invite_code": "ab3f91c2",
  "team_owner_id": "<user-uuid>",
  "max_members": 4,
  "status": "FORMING"
}
```

**Errors:**
- `409` – User already belongs to an active team.
- `400` – `max_members` out of range (must be 2–5).
- `401` – Not authenticated.

---

### POST `/api/teams/join`
Join an existing team via invite code.

**Request body:**
```json
{
  "invite_code": "ab3f91c2"
}
```

**Response (200):**
```json
{
  "team_id": "<uuid>",
  "team_name": "Team Nexus",
  "role": "MEMBER"
}
```

**Errors:**
- `404` – Invite code not found.
- `409` – User already belongs to a team.
- `422` – Team is full (`current_members >= max_members`).
- `403` – Team is not in `FORMING` state.
- `401` – Not authenticated.

---

## DB Notes

- `invite_code` is regenerated server-side (not a DB default) using `crypto.randomBytes(4).toString('hex')` — 8 hex chars, collision-safe at hackathon scale.
- The `UNIQUE(user_id)` constraint on `team_members` is the **sole enforcement** of "one team per user" — no application-layer check needed beyond catching the 23505 Postgres error code.
- `team_owner_id` is denormalized on the `teams` table for fast ownership checks without a join.
