/**
 * App-facing hackathon tracks (UI, payments, submit form).
 * Supabase `submissions_track_check` may still allow legacy values — use trackToDb / trackFromDb.
 */

export const TRACK_VALUES = [
  'SaaS',
  'Animation',
  'Storytelling',
  'Gaming',
  'AI',
] as const

export type Track = (typeof TRACK_VALUES)[number]

/** Values allowed by the default Supabase schema constraint */
export const DB_TRACK_VALUES = [
  'AI/ML',
  'Web3',
  'HealthTech',
  'FinTech',
  'OpenInnovation',
] as const

export type DbTrack = (typeof DB_TRACK_VALUES)[number]

const TRACK_TO_DB: Record<Track, DbTrack> = {
  SaaS: 'FinTech',
  Animation: 'OpenInnovation',
  Storytelling: 'HealthTech',
  Gaming: 'Web3',
  AI: 'AI/ML',
}

const DB_TO_TRACK: Record<DbTrack, Track> = {
  'AI/ML': 'AI',
  Web3: 'Gaming',
  HealthTech: 'Storytelling',
  FinTech: 'SaaS',
  OpenInnovation: 'Animation',
}

export function isValidTrack(value: string): value is Track {
  return (TRACK_VALUES as readonly string[]).includes(value)
}

/** Convert UI track → value stored in Postgres (legacy constraint). */
export function trackToDb(track: Track): DbTrack {
  return TRACK_TO_DB[track]
}

/** Convert Postgres track → UI track (supports both legacy and new values). */
export function trackFromDb(value: string): Track {
  if (isValidTrack(value)) return value
  return DB_TO_TRACK[value as DbTrack] ?? 'SaaS'
}

/** Map filter from admin UI to DB column value */
export function trackFilterToDb(filter: string): string {
  if (filter === 'All' || !filter) return filter
  return isValidTrack(filter) ? trackToDb(filter) : filter
}

export const TRACK_OPTIONS: { value: Track; label: string }[] = [
  { value: 'SaaS', label: 'SaaS' },
  { value: 'Animation', label: 'Animation' },
  { value: 'Storytelling', label: 'Storytelling' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'AI', label: 'AI' },
]
