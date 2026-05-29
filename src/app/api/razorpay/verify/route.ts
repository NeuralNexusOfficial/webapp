import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    // Verify signature: HMAC_SHA256(order_id + "|" + payment_id, secret)
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(expectedSig, 'utf8'), Buffer.from(razorpay_signature, 'utf8'))) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Update payment status to SUCCESS in DB
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'SUCCESS',
        razorpay_payment_id,
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('status', 'INITIATED');

    if (error) {
      console.error('[razorpay-verify] DB update error:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[razorpay-verify] Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
