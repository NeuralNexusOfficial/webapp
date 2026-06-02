'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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

export interface TeamMember {
  id: string
  user_id: string
  role: 'LEADER' | 'MEMBER'
  full_name: string | null
  email: string | null
}

export interface TeamWithMembers extends TeamRow {
  members: TeamMember[]
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

/**
 * Returns the team the current user belongs to WITH a list of all members
 * (joined with profiles for name + email).
 */
export async function getMyTeamWithMembers(): Promise<TeamActionResult<TeamWithMembers | null>> {
  const supabase = await createClient()
  const adminClient = createAdminClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // Get team membership row
  const { data: membership, error: membershipError } = await supabase
    .from('team_members')
    .select('teams(*)')
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError) return { success: false, error: membershipError.message }
  if (!membership?.teams) return { success: true, data: null }

  const team = membership.teams as unknown as TeamRow

  // Fetch all members of this team (just IDs and roles)
  const { data: teamMembersData, error: teamMembersError } = await supabase
    .from('team_members')
    .select('id, user_id, role')
    .eq('team_id', team.id)

  if (teamMembersError) return { success: false, error: teamMembersError.message }

  // Use admin client to fetch full profile data (bypasses RLS)
  const userIds = (teamMembersData ?? []).map(m => m.user_id)
  
  const { data: profilesData, error: profilesError } = await adminClient
    .from('profiles')
    .select('id, full_name, email')
    .in('id', userIds)

  if (profilesError) return { success: false, error: profilesError.message }

  // Map profiles by user_id for quick lookup
  const profilesMap = new Map(
    (profilesData ?? []).map(p => [p.id, p])
  )

  // Combine team members with their profiles
  const members: TeamMember[] = (teamMembersData ?? []).map((m) => {
    const profile = profilesMap.get(m.user_id)
    return {
      id: m.id as string,
      user_id: m.user_id as string,
      role: m.role as 'LEADER' | 'MEMBER',
      full_name: profile?.full_name ?? null,
      email: profile?.email ?? null,
    }
  })

  return {
    success: true,
    data: { ...team, members },
  }
}



/**
 * Creates a 1-person "solo" team for the current user.
 * Equivalent to creating a team with max_members = 1.
 */
export async function goSolo(): Promise<TeamActionResult<TeamRow>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // Check if user already belongs to a team
  const { data: existingMember } = await supabase
    .from('team_members')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingMember) {
    return {
      success: false,
      error: 'You already belong to a team. Leave it before going solo.',
      code: 409,
    }
  }

  const inviteCode = generateInviteCode()
  const soloName = `Solo – ${user.email?.split('@')[0] ?? user.id.slice(0, 8)}`

  // Insert solo team — use min allowed max_members (2) and LOCK immediately
  // so no one can join via the invite code
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      name: soloName,
      invite_code: inviteCode,
      team_owner_id: user.id,
      max_members: 2,
      status: 'LOCKED',
    })
    .select()
    .single()

  if (teamError) return { success: false, error: teamError.message }

  // Insert user as sole LEADER
  const { error: memberError } = await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: user.id,
    role: 'LEADER',
  })

  if (memberError) {
    // Roll back team creation
    await supabase.from('teams').delete().eq('id', team.id)
    if (memberError.code === '23505') {
      return {
        success: false,
        error: 'You already belong to a team.',
        code: 409,
      }
    }
    return { success: false, error: memberError.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/team')
  return { success: true, data: team as TeamRow }
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

    if (teamError) {
      // If the team name already exists (unique constraint violation), provide a friendly message.
      if (teamError.code === '23505' && teamError.message?.toLowerCase()?.includes('name')) {
        return { success: false, error: 'Team name already exists. Please choose a different team name.', code: 409 }
      }
      return { success: false, error: teamError.message }
    }

  // Insert owner as LEADER in team_members
  const { error: memberError } = await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: user.id,
    role: 'LEADER',
  })

  if (memberError) {
    // Roll back team creation to keep DB clean
    await supabase.from('teams').delete().eq('id', team.id)
    // Handle unique violation: user already belongs to a team
    if (memberError.code === '23505') {
      return {
        success: false,
        error: 'You already belong to an active team. Leave it before creating a new one.',
        code: 409,
      }
    }
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

  // Check if user already belongs to a team before doing anything else
  const { data: existingMember } = await supabase
    .from('team_members')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingMember) {
    return {
      success: false,
      error: 'You already belong to an active team',
      code: 409,
    }
  }

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

  // Count current members (pre-check)
  const { count, error: countError } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', team.id)

  if (countError) return { success: false, error: countError.message }

  if ((count ?? 0) >= team.max_members) {
    return { success: false, error: 'Team is full', code: 422 }
  }

  // Insert member — UNIQUE(user_id) will reject if they're already on a team
  const { data: insertedMember, error: memberError } = await supabase
    .from('team_members')
    .insert({
      team_id: team.id,
      user_id: user.id,
      role: 'MEMBER',
    })
    .select('id')
    .single()

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

  // ── Post-insert race-condition guard ─────────────────────────────────────
  // Re-count members AFTER the insert. If a concurrent request also inserted
  // between our pre-check and our insert, the team may now exceed max_members.
  // In that case, roll back our insert.
  const { count: postCount, error: postCountError } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', team.id)

  if (postCountError) {
    // If we can't verify, roll back to be safe
    await supabase.from('team_members').delete().eq('id', insertedMember.id)
    return { success: false, error: 'Failed to verify team capacity' }
  }

  if ((postCount ?? 0) > team.max_members) {
    // Over capacity due to race — roll back our insert
    await supabase.from('team_members').delete().eq('id', insertedMember.id)
    return { success: false, error: 'Team is full', code: 422 }
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

// ─── Leave Team ───────────────────────────────────────────────────────────────

/**
 * Lets a MEMBER leave their current team.
 * Blocked if any team member has a successful payment.
 */
export async function leaveTeam(): Promise<TeamActionResult<undefined>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // Find user's membership
  const { data: membership, error: membershipError } = await supabase
    .from('team_members')
    .select('id, team_id, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError) return { success: false, error: membershipError.message }
  if (!membership) return { success: false, error: 'You are not on a team', code: 404 }

  if (membership.role === 'LEADER') {
    return {
      success: false,
      error: 'Team leaders cannot leave. Use "Disband Team" instead.',
      code: 403,
    }
  }

  // Check if any team member has paid
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', membership.team_id)

  if (teamMembers && teamMembers.length > 0) {
    const userIds = teamMembers.map(m => m.user_id)
    const { data: paidPayment } = await supabase
      .from('payments')
      .select('id')
      .in('user_id', userIds)
      .eq('status', 'SUCCESS')
      .limit(1)
      .maybeSingle()

    if (paidPayment) {
      return {
        success: false,
        error: 'Cannot leave — your team has already completed payment.',
        code: 403,
      }
    }
  }

  // Remove user from team
  const { error: deleteError } = await supabase
    .from('team_members')
    .delete()
    .eq('id', membership.id)

  if (deleteError) return { success: false, error: deleteError.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/team')
  return { success: true, data: undefined }
}

// ─── Disband Team ─────────────────────────────────────────────────────────────

/**
 * Lets the LEADER disband (delete) their team entirely.
 * Removes all team_members rows and then deletes the team.
 * Blocked if any member has a successful payment.
 */
export async function disbandTeam(): Promise<TeamActionResult<undefined>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated', code: 401 }

  // Find user's membership — must be LEADER
  const { data: membership, error: membershipError } = await supabase
    .from('team_members')
    .select('id, team_id, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (membershipError) return { success: false, error: membershipError.message }
  if (!membership) return { success: false, error: 'You are not on a team', code: 404 }

  if (membership.role !== 'LEADER') {
    return {
      success: false,
      error: 'Only the team leader can disband the team.',
      code: 403,
    }
  }

  // Check if any team member has paid
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', membership.team_id)

  if (teamMembers && teamMembers.length > 0) {
    const userIds = teamMembers.map(m => m.user_id)
    const { data: paidPayment } = await supabase
      .from('payments')
      .select('id')
      .in('user_id', userIds)
      .eq('status', 'SUCCESS')
      .limit(1)
      .maybeSingle()

    if (paidPayment) {
      return {
        success: false,
        error: 'Cannot disband — your team has already completed payment.',
        code: 403,
      }
    }
  }

  // Delete all team members first (foreign key constraint)
  const { error: membersDeleteError } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', membership.team_id)

  if (membersDeleteError) return { success: false, error: membersDeleteError.message }

  // Delete the team itself
  const { error: teamDeleteError } = await supabase
    .from('teams')
    .delete()
    .eq('id', membership.team_id)

  if (teamDeleteError) return { success: false, error: teamDeleteError.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/team')
  return { success: true, data: undefined }
}
