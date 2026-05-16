'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

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
        <option value="AI/ML">AI/ML</option>
        <option value="Web3">Web3</option>
        <option value="HealthTech">HealthTech</option>
        <option value="FinTech">FinTech</option>
        <option value="OpenInnovation">Open Innovation</option>
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
