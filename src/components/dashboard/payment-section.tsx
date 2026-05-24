'use client';

import { useState, useEffect } from 'react';
import PayButton from './pay-button';
import { getMyTeamWithMembers } from '@/app/actions/team';
import { getPaymentStatus } from '@/app/actions/payment';
import { Track } from '@/types';

export default function PaymentSection({ selectedDomain }: { selectedDomain?: Track | '' }) {
  const [internalDomain, setInternalDomain] = useState<Track | ''>('');
  
  // Use prop if provided, otherwise use internal state
  const domain = selectedDomain !== undefined ? selectedDomain : internalDomain;
  
  const [isTeam, setIsTeam] = useState(false);
  const [teamSize, setTeamSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('loading');

  useEffect(() => {
    async function load() {
      try {
        const pStatus = await getPaymentStatus();
        setPaymentStatus(pStatus.status);

        if (pStatus.status !== 'SUCCESS') {
          const teamRes = await getMyTeamWithMembers();
          if (teamRes.success && teamRes.data) {
            setIsTeam(true);
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
          ✓
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

  // Convert USD to INR (Approx $1 = ₹83) for Razorpay (must be integer rupees)
  const currentPriceINR = currentPriceUSD ? Math.round(currentPriceUSD * 83) : 0;

  return (
    <div className="card-cyber p-6 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        <div className="flex-1 w-full max-w-sm">
          {selectedDomain === undefined && (
            <>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                Select Domain
              </label>
              <select 
                className="input-nn w-full bg-black/50"
                value={internalDomain}
                onChange={(e) => setInternalDomain(e.target.value as Track)}
              >
                <option value="" disabled>Choose your track...</option>
                <option value="SaaS">SaaS Domain</option>
                <option value="Animation">Animation Domain</option>
                <option value="Storytelling">Storytelling Domain</option>
                <option value="Gaming">Gaming Domain</option>
                <option value="AI">AI Domain</option>
              </select>
            </>
          )}
          {selectedDomain !== undefined && !selectedDomain && (
            <p className="text-sm text-white/50 mb-2">Please select a track above to calculate your fee.</p>
          )}
          <p className="text-[11px] text-white/30 mt-2">
            {isTeam 
              ? `You are paying for a team of ${teamSize}.`
              : "You are paying as an individual."}
          </p>
        </div>

        <div className="text-left sm:text-right flex flex-col sm:items-end w-full sm:w-auto">
          {domain ? (
            <>
              <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                ${currentPriceUSD} <span className="text-lg text-white/40 font-sans font-normal">(~₹{currentPriceINR})</span>
              </p>
              <p className="text-sm text-white/40 mb-4">
                One-time fee · Includes swag kit, meals, and access
              </p>
              <PayButton amount={currentPriceINR} label={`Pay $${currentPriceUSD}`} />
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
