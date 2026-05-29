'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserRole } from '@/lib/auth/roles'
import { trackFromDb } from '@/lib/tracks'

export type LeaderboardEntry = {
  submission_id: string
  title: string
  team_name: string
  track: string
  status: string
  avg_innovation: number
  avg_technical: number
  avg_uiux: number
  avg_scalability: number
  avg_total: number
  judge_count: number
}

export type LeaderboardResult =
  | { success: true; data: LeaderboardEntry[] }
  | { success: false; error: string }

/**
 * Fetches a leaderboard of all scored submissions ranked by average total score.
 * Optionally filtered by track.
 */
export async function getLeaderboard(trackFilter?: string): Promise<LeaderboardResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const role = await getUserRole(user.id)
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied. Admin role required.' }
  }

  const adminSupabase = createAdminClient()

  // Get all scores with submission + team info
  let query = adminSupabase
    .from('scores')
    .select('submission_id, innovation_score, technical_score, ui_ux_score, scalability_score, total_score, submissions(id, title, track, status, teams(name))')

  const { data: scores, error } = await query

  if (error) return { success: false, error: error.message }
  if (!scores || scores.length === 0) return { success: true, data: [] }

  // Aggregate scores by submission
  const aggregated = new Map<string, {
    submission_id: string
    title: string
    team_name: string
    track: string
    status: string
    innovation_sum: number
    technical_sum: number
    uiux_sum: number
    scalability_sum: number
    total_sum: number
    count: number
  }>()

  for (const score of scores) {
    const sub = score.submissions as any
    if (!sub) continue

    const submissionId = score.submission_id
    const track = trackFromDb(sub.track || 'Unknown')

    // Apply track filter if specified (UI track names)
    if (trackFilter && trackFilter !== 'All' && track !== trackFilter) continue

    const existing = aggregated.get(submissionId)
    if (existing) {
      existing.innovation_sum += score.innovation_score || 0
      existing.technical_sum += score.technical_score || 0
      existing.uiux_sum += score.ui_ux_score || 0
      existing.scalability_sum += score.scalability_score || 0
      existing.total_sum += score.total_score || 0
      existing.count += 1
    } else {
      aggregated.set(submissionId, {
        submission_id: submissionId,
        title: sub.title || 'Untitled',
        team_name: sub.teams?.name || 'Unknown Team',
        track,
        status: sub.status || 'UNKNOWN',
        innovation_sum: score.innovation_score || 0,
        technical_sum: score.technical_score || 0,
        uiux_sum: score.ui_ux_score || 0,
        scalability_sum: score.scalability_score || 0,
        total_sum: score.total_score || 0,
        count: 1,
      })
    }
  }

  // Convert to leaderboard entries with averages
  const leaderboard: LeaderboardEntry[] = Array.from(aggregated.values()).map(entry => ({
    submission_id: entry.submission_id,
    title: entry.title,
    team_name: entry.team_name,
    track: entry.track,
    status: entry.status,
    avg_innovation: Math.round((entry.innovation_sum / entry.count) * 10) / 10,
    avg_technical: Math.round((entry.technical_sum / entry.count) * 10) / 10,
    avg_uiux: Math.round((entry.uiux_sum / entry.count) * 10) / 10,
    avg_scalability: Math.round((entry.scalability_sum / entry.count) * 10) / 10,
    avg_total: Math.round((entry.total_sum / entry.count) * 10) / 10,
    judge_count: entry.count,
  }))

  // Sort by avg_total descending
  leaderboard.sort((a, b) => b.avg_total - a.avg_total)

  return { success: true, data: leaderboard }
}
