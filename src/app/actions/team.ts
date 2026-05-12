'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'

// ─── Types ───────────────────────────────────────────────────────────────────

export type TeamActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; code?: number }

export interface TeamRow {
  id: string
  name: string
  invite_code: string
  team_owner_id: string
  max_members: number
  status: 'FORMING' | 'LOCKED' | 'SUBMITTED' | 'JUDGED'
  created_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generates a cryptographically random 8-char hex invite code. */
function generateInviteCode(): string {
  return randomBytes(4).toString('hex')
}

/**
 * Returns the team the current user belongs to, or null.
 * Uses the UNIQUE(user_id) constraint on team_members.
 */
export async function getMyTeam(): Promise<TeamActionResult<TeamRow | null>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  const { data, error } = await supabase
    .from('team_members')
    .select('teams(*)')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return { success: false, error: error.message }

  return {
    success: true,
    data: (data?.teams as unknown as TeamRow) ?? null,
  }
}

// ─── Create Team ──────────────────────────────────────────────────────────────

export interface CreateTeamInput {
  name: string
  max_members?: number
}

export async function createTeam(
  input: CreateTeamInput,
): Promise<TeamActionResult<TeamRow>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // Validate max_members
  const maxMembers = input.max_members ?? 4
  if (maxMembers < 2 || maxMembers > 5) {
    return {
      success: false,
      error: 'max_members must be between 2 and 5',
      code: 400,
    }
  }

  // Check if user already belongs to a team (UNIQUE(user_id) will also catch this)
  const existingCheck = await supabase
    .from('team_members')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingCheck.data) {
    return {
      success: false,
      error: 'You already belong to an active team. Leave it before creating a new one.',
      code: 409,
    }
  }

  const inviteCode = generateInviteCode()

  // Insert team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      name: input.name.trim(),
      invite_code: inviteCode,
      team_owner_id: user.id,
      max_members: maxMembers,
    })
    .select()
    .single()

  if (teamError) return { success: false, error: teamError.message }

  // Insert owner as LEADER in team_members
  const { error: memberError } = await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: user.id,
    role: 'LEADER',
  })

  if (memberError) {
    // Roll back team creation to keep DB clean
    await supabase.from('teams').delete().eq('id', team.id)
    return { success: false, error: memberError.message }
  }

  revalidatePath('/dashboard/team')
  return { success: true, data: team as TeamRow }
}

// ─── Join Team ────────────────────────────────────────────────────────────────

export interface JoinTeamInput {
  invite_code: string
}

export async function joinTeam(
  input: JoinTeamInput,
): Promise<TeamActionResult<{ team_id: string; team_name: string; role: string }>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // Resolve invite code → team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('id, name, max_members, status')
    .eq('invite_code', input.invite_code.trim().toLowerCase())
    .maybeSingle()

  if (teamError) return { success: false, error: teamError.message }
  if (!team) return { success: false, error: 'Invalid invite code', code: 404 }

  // Guard: team must be FORMING
  if (team.status !== 'FORMING') {
    return {
      success: false,
      error: 'This team is no longer accepting new members',
      code: 403,
    }
  }

  // Count current members
  const { count, error: countError } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', team.id)

  if (countError) return { success: false, error: countError.message }

  if ((count ?? 0) >= team.max_members) {
    return { success: false, error: 'Team is full', code: 422 }
  }

  // Insert member — UNIQUE(user_id) will reject if they're already on a team
  const { error: memberError } = await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: user.id,
    role: 'MEMBER',
  })

  if (memberError) {
    // Postgres unique violation code
    if (memberError.code === '23505') {
      return {
        success: false,
        error: 'You already belong to an active team',
        code: 409,
      }
    }
    return { success: false, error: memberError.message }
  }

  revalidatePath('/dashboard/team')
  return {
    success: true,
    data: { team_id: team.id, team_name: team.name, role: 'MEMBER' },
  }
}

// ─── Regenerate Invite Code ───────────────────────────────────────────────────

/**
 * Lets the team LEADER regenerate the invite code (invalidates old one).
 */
export async function regenerateInviteCode(
  teamId: string,
): Promise<TeamActionResult<{ invite_code: string }>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // Verify ownership
  const { data: team } = await supabase
    .from('teams')
    .select('team_owner_id')
    .eq('id', teamId)
    .single()

  if (!team || team.team_owner_id !== user.id) {
    return { success: false, error: 'Only the team owner can regenerate the invite code', code: 403 }
  }

  const newCode = generateInviteCode()

  const { error } = await supabase
    .from('teams')
    .update({ invite_code: newCode })
    .eq('id', teamId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/team')
  return { success: true, data: { invite_code: newCode } }
}
