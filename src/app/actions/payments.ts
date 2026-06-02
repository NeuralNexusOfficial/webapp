'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserRole } from '@/lib/auth/roles';
import { Payment } from '@/types';
import { razorpay } from '@/lib/razorpay';

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
  // Map to include user_name field and ensure currency has a default
  const payments = (data as any[]).map((p) => ({
    ...p,
    user_name: p.profiles?.full_name ?? null,
    currency: p.currency || 'INR', // Default to INR if missing
  }));
  return { success: true, data: payments as Payment[] };
}

/**
 * Backfills currency information for existing payments by fetching from Razorpay API.
 * Only for admin use - updates payments that don't have currency set.
 */
export async function backfillPaymentCurrency(): Promise<AdminActionResult<{
  updated: number;
  errors: string[];
}>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: 'Not authenticated' };
  
  const role = await getUserRole(user.id);
  if (role !== 'ADMIN') {
    return { success: false, error: 'Access denied' };
  }

  const adminSupabase = createAdminClient();
  const errors: string[] = [];
  let updated = 0;

  // Get all payments without currency set
  const { data: paymentsNoCurrency, error: fetchError } = await adminSupabase
    .from('payments')
    .select('id, razorpay_order_id, currency')
    .or('currency.is.null,currency.eq.""')
    .limit(1000);

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  if (!paymentsNoCurrency || paymentsNoCurrency.length === 0) {
    return { success: true, data: { updated: 0, errors: [] } };
  }

  // For each payment, fetch order details from Razorpay and update currency
  for (const payment of paymentsNoCurrency) {
    try {
      if (!payment.razorpay_order_id) {
        errors.push(`Payment ${payment.id}: No razorpay_order_id`);
        continue;
      }

      // Fetch order from Razorpay API
      const order = await razorpay.orders.fetch(payment.razorpay_order_id);
      const currency = order.currency || 'INR';

      // Update the payment with currency
      const { error: updateError } = await adminSupabase
        .from('payments')
        .update({ currency })
        .eq('id', payment.id);

      if (updateError) {
        errors.push(`Payment ${payment.id}: ${updateError.message}`);
      } else {
        updated++;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      errors.push(`Payment ${payment.id}: ${message}`);
    }
  }

  return { success: true, data: { updated, errors } };
}
