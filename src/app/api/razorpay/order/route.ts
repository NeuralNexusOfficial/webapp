import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';
import { REGISTRATION_FEES, CURRENCY } from '@/lib/pricing';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const amount = Number(body.amount);
    const track = body.track ?? null;

    // Server-side price validation: only allow known registration fees
    const validAmounts: number[] = [REGISTRATION_FEES.solo, REGISTRATION_FEES.team];
    if (!amount || !validAmounts.includes(amount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const receipt = `nn_${user.id.slice(0, 8)}_${Date.now()}`;

    // Create order in Razorpay (amount in paise: ₹500 = 50000 paise)
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: CURRENCY,
      receipt,
    });

    // Record in Supabase with FSM initial state INITIATED
    const insertPayload: Record<string, unknown> = {
      user_id: user.id,
      razorpay_order_id: order.id,
      amount,
      currency: CURRENCY,
      receipt,
      status: 'INITIATED',
    };
    if (track) {
      insertPayload.track = track;
    }

    const { error: dbError } = await supabase.from('payments').insert(insertPayload);

    if (dbError) {
      console.error('DB insert error:', dbError);
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
    }

    // Return only what the front-end checkout needs
    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,      // in paise
      currency: order.currency,
      receipt,
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
