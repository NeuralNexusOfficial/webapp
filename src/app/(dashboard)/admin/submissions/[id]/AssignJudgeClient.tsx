'use client';

import { useState } from 'react';
import { assignJudge } from '@/app/actions/judging';

export default function AssignJudgeClient({
  submissionId,
  judges,
}: {
  submissionId: string;
  judges: { id: string; full_name: string | null; email: string | null }[];
}) {
  const [selectedJudge, setSelectedJudge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAssign = async () => {
    if (!selectedJudge) return;
    setLoading(true);
    setError('');
    setSuccess('');

    const res = await assignJudge(submissionId, selectedJudge);
    if (!res.success) {
      setError(res.error);
    } else {
      setSuccess('Judge assigned successfully!');
      setSelectedJudge('');
    }
    setLoading(false);
  };

  return (
    <div className="card-cyber p-6 mt-6">
      <h3 className="text-xl font-bold text-white mb-4">Assign Judge</h3>
      <div className="flex items-center gap-4">
        <select
          value={selectedJudge}
          onChange={(e) => setSelectedJudge(e.target.value)}
          className="input-nn flex-1"
          disabled={loading}
        >
          <option value="">Select a Judge...</option>
          {judges?.map((j) => (
            <option key={j.id} value={j.id}>
              {j.full_name || j.email}
            </option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          disabled={!selectedJudge || loading}
          className="btn-nn"
        >
          {loading ? 'Assigning...' : 'Assign'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {success && <p className="text-green-500 mt-2 text-sm">{success}</p>}
    </div>
  );
}
