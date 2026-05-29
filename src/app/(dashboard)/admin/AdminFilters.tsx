'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { TRACK_OPTIONS } from '@/lib/tracks';

export default function AdminFilters({
  initialTrack,
  initialStatus,
}: {
  initialTrack?: string;
  initialStatus?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'All') {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="card-cyber p-6 grid md:grid-cols-2 gap-4">
      <select
        value={initialTrack || 'All'}
        onChange={(e) => {
          router.push(`/admin?${createQueryString('track', e.target.value)}`);
        }}
        className="input-nn"
      >
        <option value="All">All Tracks</option>
        {TRACK_OPTIONS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <select
        value={initialStatus || 'All'}
        onChange={(e) => {
          router.push(`/admin?${createQueryString('status', e.target.value)}`);
        }}
        className="input-nn"
      >
        <option value="All">All Status</option>
        <option value="DRAFT">Draft</option>
        <option value="SUBMITTED">Submitted</option>
        <option value="JUDGED">Judged</option>
      </select>
    </div>
  );
}
