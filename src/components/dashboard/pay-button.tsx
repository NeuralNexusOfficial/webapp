'use client';

import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type PaymentState = 'idle' | 'pending' | 'success' | 'failed';

interface PayButtonProps {
  /** Registration fee in INR (e.g. 500 for ₹500) */
  amount: number;
  /** Optional label override */
  label?: string;
}

// ── Razorpay global type (checkout.js injects window.Razorpay) ────────────────

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PayButton({ amount, label }: PayButtonProps) {
  const [state, setState] = useState<PaymentState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handlePay() {
    setState('pending');
    setErrorMsg('');

    // 1. Load Razorpay checkout.js
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrorMsg('Could not load payment SDK. Check your connection.');
      setState('failed');
      return;
    }

    // 2. Create order on our backend
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
      const msg = err instanceof Error ? err.message : 'Order creation failed';
      setErrorMsg(msg);
      setState('failed');
      return;
    }

    // 3. Open Razorpay checkout modal
    const razorpay = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: orderData.order_id,
      amount: orderData.amount,   // in paise
      currency: orderData.currency,
      name: 'NeuralNexus Hackathon',
      description: 'Hackathon Registration Fee',
      theme: { color: '#6366f1' },

      // payment.captured webhook is the ground truth; this gives instant UX feedback
      handler: function () {
        setState('success');
      },

      modal: {
        ondismiss: function () {
          // User closed the modal without paying
          setErrorMsg('Payment cancelled. You can try again.');
          setState('failed');
        },
      },
    });

    razorpay.open();
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (state === 'success') {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-6 py-4">
        <span className="text-2xl">✅</span>
        <div>
          <p className="text-emerald-400 font-semibold">Payment Successful!</p>
          <p className="text-zinc-400 text-sm mt-0.5">
            Your registration is being confirmed. You&apos;ll receive an email shortly.
          </p>
        </div>
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-red-500/10 border border-red-500/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="text-red-400 font-semibold">Payment Failed</p>
            {errorMsg && <p className="text-zinc-400 text-sm mt-0.5">{errorMsg}</p>}
          </div>
        </div>
        <button
          onClick={() => { setState('idle'); setErrorMsg(''); }}
          className="self-start text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
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
      className={[
        'inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-semibold text-white transition-all',
        state === 'pending'
          ? 'bg-indigo-700 cursor-not-allowed opacity-70'
          : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-900/40',
      ].join(' ')}
    >
      {state === 'pending' ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Opening payment…
        </>
      ) : (
        <>
          <span>💳</span>
          {label ?? `Pay ₹${amount}`}
        </>
      )}
    </button>
  );
}
