'use client';

import { useState } from 'react';

type PaymentState = 'idle' | 'pending' | 'success' | 'failed';

interface PayButtonProps {
  amount: number;
  label?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function PayButton({ amount, label }: PayButtonProps) {
  const [state, setState] = useState<PaymentState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handlePay() {
    setState('pending');
    setErrorMsg('');

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrorMsg('Could not load payment SDK. Check your connection.');
      setState('failed');
      return;
    }

    let orderData: { order_id: string; amount: number; currency: string };
    try {
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Order creation failed');
      }
      orderData = await res.json();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Order creation failed');
      setState('failed');
      return;
    }

    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: orderData.order_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'NeuralNexus Hackathon',
      description: 'Hackathon Registration Fee',
      theme: { color: '#ffffff', backdrop_color: '#000000' },
      handler: () => setState('success'),
      modal: {
        ondismiss: () => {
          setErrorMsg('Payment cancelled. You can try again.');
          setState('failed');
        },
      },
    });
    rzp.open();
  }

  if (state === 'success') {
    return (
      <div className="card-cyber p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg flex-shrink-0">
          ✓
        </div>
        <div>
          <p className="text-emerald-400 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Payment Confirmed
          </p>
          <p className="text-white/40 text-sm mt-1">
            Your spot is locked in. Check your email for confirmation.
          </p>
        </div>
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className="card-cyber p-6 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 text-lg flex-shrink-0">
            ✕
          </div>
          <div>
            <p className="text-red-400 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              Payment Failed
            </p>
            {errorMsg && <p className="text-white/40 text-sm mt-1">{errorMsg}</p>}
          </div>
        </div>
        <button
          onClick={() => { setState('idle'); setErrorMsg(''); }}
          className="self-start text-sm text-white/50 underline underline-offset-2 hover:text-white transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <button
      id="pay-registration-fee"
      onClick={handlePay}
      disabled={state === 'pending'}
      className={`btn-pill ${state === 'pending' ? 'btn-outline opacity-60 cursor-not-allowed' : 'btn-primary'}`}
    >
      {state === 'pending' ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Opening payment…
        </>
      ) : (
        `${label ?? `Pay ₹${amount}`} →`
      )}
    </button>
  );
}
