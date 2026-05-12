import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

// Razorpay sends the raw body as-is; we must NOT parse it with req.json()
// before computing the HMAC — it must be verified against the exact raw bytes.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  // ── 1. Verify HMAC-SHA256 signature ────────────────────────────────────────
  const expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSig, 'utf8'),
    )
  ) {
    console.warn('[razorpay-webhook] Invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ── 2. Parse event ──────────────────────────────────────────────────────────
  let event: { event: string; payload: { payment: { entity: { order_id: string; id: string } } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  const orderId: string = event?.payload?.payment?.entity?.order_id;
  const paymentId: string = event?.payload?.payment?.entity?.id;

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order_id in payload' }, { status: 400 });
  }

  const supabase = await createClient();

  // ── 3. FSM transition ───────────────────────────────────────────────────────
  // INITIATED → SUCCESS  (payment.captured)
  // INITIATED → FAILED   (payment.failed)
  const eventName = event.event;

  if (eventName === 'payment.captured') {
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'SUCCESS',
        razorpay_payment_id: paymentId,
      })
      .eq('razorpay_order_id', orderId)
      .eq('status', 'INITIATED'); // guard: only advance if still INITIATED

    if (error) {
      console.error('[razorpay-webhook] DB update error (captured):', error);
      // Still return 200 so Razorpay doesn't retry indefinitely
    }
  } else if (eventName === 'payment.failed') {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'FAILED' })
      .eq('razorpay_order_id', orderId)
      .eq('status', 'INITIATED');

    if (error) {
      console.error('[razorpay-webhook] DB update error (failed):', error);
    }
  }
  // Silently acknowledge any other event types we don't handle yet

  // ── 4. Acknowledge ──────────────────────────────────────────────────────────
  // Razorpay retries on non-2xx. Always return 200 after signature passes.
  return NextResponse.json({ received: true });
}
