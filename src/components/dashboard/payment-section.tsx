'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PayButton from './pay-button';
import { getMyTeamWithMembers, createTeam, goSolo } from '@/app/actions/team';
import { getPaymentStatus } from '@/app/actions/payment';
import { Track } from '@/types';
import { Check, Cloud, Clapperboard, BookOpen, Gamepad2, Bot } from 'lucide-react';

const TRACK_OPTIONS: { value: Track; label: string; icon: React.ReactNode }[] = [
  { value: 'SaaS',         label: 'SaaS',         icon: <Cloud size={14} /> },
  { value: 'Animation',    label: 'Animation',    icon: <Clapperboard size={14} /> },
  { value: 'Storytelling', label: 'Storytelling',  icon: <BookOpen size={14} /> },
  { value: 'Gaming',       label: 'Gaming',        icon: <Gamepad2 size={14} /> },
  { value: 'AI',           label: 'AI',             icon: <Bot size={14} /> },
];

export default function PaymentSection({
  selectedDomain,
  registrationType,
  pendingTeamName,
  onPaymentSuccess,
  pollForSuccess,
}: {
  selectedDomain?: Track | '';
  registrationType?: 'solo' | 'team';
  pendingTeamName?: string | null;
  onPaymentSuccess?: () => void;
  pollForSuccess?: boolean;
}) {
  const [internalDomain, setInternalDomain] = useState<Track | ''>('SaaS');

  // Use prop if provided, otherwise use internal state
  const domain = selectedDomain !== undefined ? selectedDomain : internalDomain;

  const [dbIsTeam, setDbIsTeam] = useState(false);
  const [teamSize, setTeamSize] = useState(0);

  // If registrationType is explicitly passed, use it. Otherwise, fallback to DB state.
  const isTeam = registrationType !== undefined ? registrationType === 'team' : dbIsTeam;
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [processingPendingAction, setProcessingPendingAction] = useState(false);
  const [polling, setPolling] = useState(false);
  const router = useRouter();

  const [userCurrency, setUserCurrency] = useState('USD');
  const [userSymbol, setUserSymbol] = useState('$');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currencyLoading, setCurrencyLoading] = useState(true);

  useEffect(() => {
    async function initCurrency() {
      try {
        let cc = '';
        
        // Try multiple IP APIs
        try {
          const ipRes = await fetch('https://ipwho.is/');
          const ipData = await ipRes.json();
          if (ipData.success !== false) {
             cc = ipData.country_code;
          }
        } catch (e) {
          console.warn('ipwho.is failed', e);
        }

        // Fallback to timezone if IP API fails
        if (!cc) {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz === 'Asia/Calcutta' || tz === 'Asia/Kolkata') {
            cc = 'IN';
          }
        }

        let cCode = 'USD';
        let cSymbol = '$';

        if (cc) {
          try {
            const countryRes = await fetch(`https://restcountries.com/v3.1/alpha/${cc}?fields=currencies`);
            const countryData = await countryRes.json();
            const countryObj = Array.isArray(countryData) ? countryData[0] : countryData;
            
            if (countryObj && countryObj.currencies) {
              const keys = Object.keys(countryObj.currencies);
              if (keys.length > 0) {
                cCode = keys[0];
                cSymbol = countryObj.currencies[cCode].symbol || cCode;
              }
            }
          } catch (e) {
            console.warn('restcountries failed', e);
            if (cc === 'IN') {
              cCode = 'INR';
              cSymbol = '₹';
            }
          }
        }

        let rateData: any = { rates: {} };
        try {
          const rateRes = await fetch('https://api.frankfurter.dev/v1/latest?base=USD');
          rateData = await rateRes.json();
        } catch (e) {
          console.warn('frankfurter failed', e);
        }

        if (cCode === 'USD') {
          setUserCurrency('USD');
          setUserSymbol('$');
          setExchangeRate(1);
        } else if (rateData.rates && rateData.rates[cCode]) {
          setUserCurrency(cCode);
          setUserSymbol(cSymbol);
          setExchangeRate(rateData.rates[cCode]);
        } else if (cCode === 'INR') {
          setUserCurrency('INR');
          setUserSymbol('₹');
          setExchangeRate(rateData.rates?.INR || 83); 
        } else {
          setUserCurrency('USD');
          setUserSymbol('$');
          setExchangeRate(1);
        }
      } catch (err) {
        console.error('Error fetching currency:', err);
        // Absolute fallback to Timezone if completely failed
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz === 'Asia/Calcutta' || tz === 'Asia/Kolkata') {
          setUserCurrency('INR');
          setUserSymbol('₹');
          setExchangeRate(83);
        }
      } finally {
        setCurrencyLoading(false);
      }
    }
    initCurrency();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const pStatus = await getPaymentStatus();
        setPaymentStatus(pStatus.status);

        if (pStatus.status !== 'SUCCESS' && registrationType === undefined) {
          const teamRes = await getMyTeamWithMembers();
          if (teamRes.success && teamRes.data) {
            setDbIsTeam(true);
            setTeamSize(teamRes.data.members.length);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // If this PaymentSection is shown as part of a pending registration
  // (registrationType provided), poll the backend for payment status and
  // automatically perform the pending action when payment succeeds.
  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    async function checkAndMaybeAct() {
      try {
        const p = await getPaymentStatus();
        if (cancelled) return;
        setPaymentStatus(p.status);
        if (p.status === 'SUCCESS') {
          if (registrationType && !processingPendingAction) {
            setProcessingPendingAction(true);
            // Perform server action depending on registration type
            try {
              if (registrationType === 'solo') {
                const res = await goSolo();
                if (res.success) router.push('/dashboard/team');
              } else if (registrationType === 'team') {
                if (!pendingTeamName) {
                  console.warn('[payment-section] missing team name for pending create');
                } else {
                  const res = await createTeam({ name: pendingTeamName });
                  if (res.success) router.push('/dashboard/team');
                }
              }
            } catch (err) {
              console.error('[payment-section] pending action error', err);
            } finally {
              setProcessingPendingAction(false);
            }
          } else if (pollForSuccess && onPaymentSuccess) {
            onPaymentSuccess();
          }
        }
      } catch (err) {
        // ignore
      }
    }

    if (registrationType || pollForSuccess) {
      // start polling every 2.5s until success or unmounted
      setPolling(true);
      intervalId = setInterval(checkAndMaybeAct, 2500);
      // also run once immediately
      checkAndMaybeAct();
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      setPolling(false);
    };
  }, [registrationType, pendingTeamName, processingPendingAction, pollForSuccess, onPaymentSuccess, router]);

  if (loading || paymentStatus === 'loading') {
    return (
      <div className="card-cyber p-6 md:p-8 animate-pulse flex items-center justify-center">
        <p className="text-white/40 text-sm">Checking payment status...</p>
      </div>
    );
  }

  if (paymentStatus === 'SUCCESS') {
    return (
      <div className="card-cyber p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg shrink-0">
          <Check className="w-5 h-5" />
        </div>
        <div>
          <p className="text-emerald-400 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Payment Confirmed
          </p>
          <p className="text-white/40 text-sm mt-1">
            Your spot is locked in. You are fully registered for the hackathon!
          </p>
        </div>
      </div>
    );
  }

  const prices: Record<Track, { ind: number; team?: number }> = {
    'SaaS': { ind: 15, team: 25 },
    'Animation': { ind: 12, team: 18 },
    'Storytelling': { ind: 8 },
    'Gaming': { ind: 18, team: 30 },
    'AI': { ind: 25, team: 35 },
  };

  const currentPriceUSD = domain
    ? (isTeam && prices[domain as Track].team ? prices[domain as Track].team : prices[domain as Track].ind)
    : null;

  const currentLocalPrice = currentPriceUSD ? Number((currentPriceUSD * exchangeRate).toFixed(2)) : 0;

  return (
    <div className="card-cyber p-6 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        <div className="flex-1 w-full">
          {selectedDomain === undefined && (
            <>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                Select Track
              </label>
              <div className="flex flex-wrap gap-2">
                {TRACK_OPTIONS.map((t) => {
                  const selected = internalDomain === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setInternalDomain(t.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selected
                          ? 'bg-white/10 border-white/30 text-white'
                          : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {selectedDomain !== undefined && !selectedDomain && (
            <p className="text-sm text-white/50 mb-2">Please select a track above to calculate your fee.</p>
          )}
          <p className="text-[11px] text-white/30 mt-3">
            {isTeam
              ? (registrationType === 'team' ? "You are paying for a team." : `You are paying for a team of ${teamSize}.`)
              : "You are paying as an individual."}
          </p>
        </div>

        <div className="text-left sm:text-right flex flex-col sm:items-end w-full sm:w-auto">
          {domain ? (
            <>
              <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                {currencyLoading ? (
                  <span className="animate-pulse bg-white/20 h-8 w-24 rounded inline-block"></span>
                ) : (
                  `${userSymbol}${currentLocalPrice}`
                )}
                {userCurrency !== 'USD' && !currencyLoading && (
                  <span className="text-lg text-white/40 font-sans font-normal ml-2">
                    (${currentPriceUSD})
                  </span>
                )}
              </p>
              <p className="text-sm text-white/40 mb-4">
                One-time fee · Includes swag kit, meals, and access
              </p>
              <PayButton 
                amount={currentLocalPrice} 
                currency={userCurrency}
                label={`Pay ${userSymbol}${currentLocalPrice}`} 
                track={domain || undefined} 
                onPaymentVerified={onPaymentSuccess} 
              />
            </>
          ) : (
            <>
              <p className="text-xl font-bold text-white/30 mb-1" style={{ fontFamily: "var(--font-display)" }}>
                $—
              </p>
              <p className="text-sm text-white/40">Select a domain to view price</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
