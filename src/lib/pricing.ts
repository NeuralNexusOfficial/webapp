/**
 * Centralized pricing configuration for the AOT Hackathon.
 * India-only event — all prices in INR (₹).
 *
 * Single source of truth consumed by:
 *  - payment-section.tsx (dashboard)
 *  - submit/page.tsx     (dashboard)
 *  - tracks.tsx          (landing)
 */

import { Track } from '@/types'

// ── Registration Fees ────────────────────────────────────────────────────────
export const REGISTRATION_FEES = {
  solo: 500,   // ₹500
  team: 1200,  // ₹1,200
} as const

export const CURRENCY = 'INR' as const
export const CURRENCY_SYMBOL = '₹'

/**
 * Returns the registration fee for a given track and registration type.
 * Storytelling is Solo-only and returns the solo fee regardless.
 */
export function getRegistrationFee(
  track: Track,
  isTeam: boolean
): number {
  if (track === 'Storytelling') return REGISTRATION_FEES.solo
  return isTeam ? REGISTRATION_FEES.team : REGISTRATION_FEES.solo
}

// ── Domain Prize Distribution (Solo & Team split) ────────────────────────────
export interface DomainPrize {
  totalPool: number
  first: number
  second: number
  third: number
}

export const DOMAIN_PRIZES: Record<
  Exclude<Track, 'Storytelling'>,
  { solo: DomainPrize; team: DomainPrize }
> = {
  AI: {
    solo: { totalPool: 125000, first: 75000, second: 30000, third: 20000 },
    team: { totalPool: 125000, first: 75000, second: 30000, third: 20000 },
  },
  Gaming: {
    solo: { totalPool: 125000, first: 70000, second: 30000, third: 25000 },
    team: { totalPool: 125000, first: 70000, second: 30000, third: 25000 },
  },
  Animation: {
    solo: { totalPool: 100000, first: 60000, second: 25000, third: 15000 },
    team: { totalPool: 100000, first: 60000, second: 25000, third: 15000 },
  },
  SaaS: {
    solo: { totalPool: 50000, first: 30000, second: 12500, third: 7500 },
    team: { totalPool: 50000, first: 30000, second: 12500, third: 7500 },
  },
}

// ── Standardized Career Perks (AI, Gaming, Animation, SaaS) ─────────────────
export const CAREER_PERKS = {
  first: 'Cash Prize + Rewards + Full-Time Role',
  second: 'Cash Prize + Full-Time Role',
  third: 'Cash Prize + Internship + PPO with Stipend',
  fourthToTenth: 'Internship',
  allOthers: 'Certificate of Participation',
} as const

// ── Overall Event Awards ─────────────────────────────────────────────────────
export const OVERALL_AWARDS = {
  grandPrize: 250000,          // ₹2,50,000
  specialAwardsTotal: 150000,  // ₹1,50,000 (6 × ₹25,000)
  specialAwardsEach: 25000,
  specialAwardsCount: 6,
  specialAwardsCategories: [
    'Student',
    'Women-Led',
    'Rookie',
    'Impact',
    'Design/Storytelling',
    'Campus/Community Champion',
  ],
} as const

// ── Total Prize Pool ─────────────────────────────────────────────────────────
// AI (2,50,000) + Gaming (2,50,000) + Animation (2,00,000) + SaaS (1,00,000)
// + Grand Prize (2,50,000) + Special Awards (1,50,000) = ₹12,00,000
export const TOTAL_PRIZE_POOL = 1200000

/**
 * Format an INR amount in Indian numbering (e.g. 125000 → "1,25,000")
 */
export function formatINR(amount: number): string {
  const str = amount.toString()
  // Indian grouping: last 3 digits, then groups of 2
  const lastThree = str.slice(-3)
  const rest = str.slice(0, -3)
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return formatted ? `${formatted},${lastThree}` : lastThree
}
