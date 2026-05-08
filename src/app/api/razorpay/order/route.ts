import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise (e.g., ₹100 = 10000 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Optionally: Store the order in your Supabase 'payments' table as 'PENDING'
    await supabase.from('payments').insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount: amount,
      status: 'PENDING',
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
