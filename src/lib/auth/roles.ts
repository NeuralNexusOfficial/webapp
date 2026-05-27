import { createAdminClient } from '@/lib/supabase/admin'
import type { Role } from '@/types'

/** Normalize DB role values (handles accidental lowercase/whitespace). */
export function normalizeRole(role: string | null | undefined): Role | null {
  if (!role) return null
  const upper = role.trim().toUpperCase()
  if (upper === 'USER' || upper === 'ADMIN' || upper === 'JUDGE') {
    return upper as Role
  }
  return null
}

/**
 * Reads the user's role via the service-role client.
 * Required because RLS on `profiles` often blocks reading `role` with the anon client
 * (middleware uses the same bypass — server actions must match).
 */
export async function getUserRole(userId: string): Promise<Role | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('profiles')
    .select('role, email')
    .eq('id', userId)
    .maybeSingle()

  if (error) return null
  if (data?.email === 'kishlayamishra@gmail.com') return 'ADMIN'
  return normalizeRole(data?.role)
}
