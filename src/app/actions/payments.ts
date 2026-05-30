'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserRole } from '@/lib/auth/roles';
import { Payment } from '@/types';

export type AdminActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Retrieves all payment records with user full name.
 */
export async function getAllPayments(): Promise<AdminActionResult<Payment[]>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };
  const role = await getUserRole(user.id);
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied' };
  }
  const adminSupabase = createAdminClient();
  // Join profiles to get full_name (user name)
  const { data, error } = await adminSupabase
    .from('payments')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false });
  if (error) return { success: false, error: error.message };
  // Map to include user_name field
  const payments = (data as any[]).map((p) => ({
    ...p,
    user_name: p.profiles?.full_name ?? null,
  }));
  return { success: true, data: payments as Payment[] };
}
