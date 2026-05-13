'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Track = 'AI/ML' | 'Web3' | 'HealthTech' | 'FinTech' | 'OpenInnovation'

export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'JUDGED'

export interface SubmissionRow {
  id: string
  team_id: string
  title: string
  description: string
  track: Track
  repo_url: string | null
  demo_url: string | null
  file_url: string | null
  deadline: string
  submitted_at: string | null
  status: SubmissionStatus
  score: number
  created_at: string
}

export type SubmissionActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; code?: number }

export interface UpsertSubmissionInput {
  title: string
  description: string
  track: Track
  repo_url?: string
  demo_url?: string
  file_url?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDeadline(): Date {
  const raw = process.env.SUBMISSION_DEADLINE
  if (!raw) {
    // Fallback: 30 days from now if env not set (dev convenience)
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d
  }
  return new Date(raw)
}

function isAfterDeadline(): boolean {
  return new Date() > getDeadline()
}

// ─── Get My Submission ────────────────────────────────────────────────────────

/**
 * Fetches the submission for the current user's team, or null if none exists.
 */
export async function getMySubmission(): Promise<SubmissionActionResult<SubmissionRow | null>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // Get the user's team
  const { data: membership, error: memError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (memError) return { success: false, error: memError.message }
  if (!membership) return { success: true, data: null } // no team yet

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('team_id', membership.team_id)
    .maybeSingle()

  if (error) return { success: false, error: error.message }

  return { success: true, data: data as SubmissionRow | null }
}

// ─── Upsert Submission ────────────────────────────────────────────────────────

/**
 * Creates or updates the submission for the current user's team.
 * Enforces:
 *   - User must be authenticated and on a team
 *   - Deadline must not have passed
 *   - One submission per team (DB UNIQUE enforces this; we handle the upsert)
 */
export async function upsertSubmission(
  input: UpsertSubmissionInput,
): Promise<SubmissionActionResult<SubmissionRow>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // ── 1. Deadline check ───────────────────────────────────────────────────────
  if (isAfterDeadline()) {
    return {
      success: false,
      error: `Submission deadline has passed (${getDeadline().toLocaleString()})`,
      code: 403,
    }
  }

  // ── 2. Resolve team ─────────────────────────────────────────────────────────
  const { data: membership, error: memError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (memError) return { success: false, error: memError.message }
  if (!membership) {
    return {
      success: false,
      error: 'You must be on a team before submitting',
      code: 422,
    }
  }

  const teamId = membership.team_id
  const deadline = getDeadline().toISOString()

  // ── 3. Validate required fields ─────────────────────────────────────────────
  if (!input.title?.trim()) return { success: false, error: 'Title is required', code: 400 }
  if (!input.description?.trim()) return { success: false, error: 'Description is required', code: 400 }
  if (!input.track) return { success: false, error: 'Track is required', code: 400 }

  const validTracks: Track[] = ['AI/ML', 'Web3', 'HealthTech', 'FinTech', 'OpenInnovation']
  if (!validTracks.includes(input.track)) {
    return { success: false, error: `Invalid track. Must be one of: ${validTracks.join(', ')}`, code: 400 }
  }

  // ── 4. Upsert (INSERT or UPDATE based on team_id uniqueness) ────────────────
  const payload = {
    team_id: teamId,
    title: input.title.trim(),
    description: input.description.trim(),
    track: input.track,
    repo_url: input.repo_url?.trim() || null,
    demo_url: input.demo_url?.trim() || null,
    file_url: input.file_url?.trim() || null,
    deadline,
    submitted_at: new Date().toISOString(),
    status: 'DRAFT' as SubmissionStatus,
  }

  const { data, error } = await supabase
    .from('submissions')
    .upsert(payload, { onConflict: 'team_id' })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/submit')
  return { success: true, data: data as SubmissionRow }
}
