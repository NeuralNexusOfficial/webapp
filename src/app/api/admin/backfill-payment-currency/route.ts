import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/auth/roles';
import { backfillPaymentCurrency } from '@/app/actions/payments';

/**
 * Admin-only endpoint to backfill currency for existing payments from Razorpay API
 * GET /api/admin/backfill-payment-currency
 */
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = await getUserRole(user.id);
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Call the server action to backfill currency
    const result = await backfillPaymentCurrency();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      updated: result.data.updated,
      errors: result.data.errors,
      message: `Updated ${result.data.updated} payments with currency from Razorpay. ${result.data.errors.length} errors occurred.`,
    });
  } catch (error) {
    console.error('[backfill-payment-currency] Error:', error);
    return NextResponse.json(
      { error: 'Failed to backfill payment currency' },
      { status: 500 }
    );
  }
}
