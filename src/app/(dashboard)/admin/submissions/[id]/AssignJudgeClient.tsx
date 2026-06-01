'use client';

import { useState } from 'react';
import { assignJudge, unassignJudge } from '@/app/actions/judging';

export default function AssignJudgeClient({
  submissionId,
  judges,
  assignedJudges,
}: {
  submissionId: string;
  judges: { id: string; full_name: string | null; email: string | null }[];
  assignedJudges: { judge_id: string; profiles: { full_name: string | null; email: string | null } }[];
}) {
  const [selectedJudge, setSelectedJudge] = useState('');
  const [loading, setLoading] = useState(false);
  const [unassigningId, setUnassigningId] = useState<string | null>(null);
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

  const handleUnassign = async (judgeId: string) => {
    setUnassigningId(judgeId);
    setError('');
    setSuccess('');

    const res = await unassignJudge(submissionId, judgeId);
    if (!res.success) {
      setError(res.error);
    } else {
      setSuccess('Judge unassigned successfully!');
    }
    setUnassigningId(null);
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="card-cyber p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Assign Judge</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedJudge}
            onChange={(e) => setSelectedJudge(e.target.value)}
            className="input-nn text-sm flex-1 w-full min-w-0 bg-[#0d0d0d] text-white"
            disabled={loading || !!unassigningId}
          >
            <option value="" className="bg-[#0d0d0d] text-white">Select a Judge...</option>
            {judges
              ?.filter((j) => !assignedJudges.some((aj) => aj.judge_id === j.id))
              ?.map((j) => (
                <option key={j.id} value={j.id} className="bg-[#0d0d0d] text-white">
                  {j.full_name || j.email}
                </option>
              ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={!selectedJudge || loading || !!unassigningId}
            className="btn-nn w-full sm:w-auto shrink-0"
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        {success && <p className="text-green-500 mt-2 text-sm">{success}</p>}
      </div>

      <div className="card-cyber p-6">
        <h3 className="text-xl font-bold text-white mb-4">Assigned Judges ({assignedJudges.length})</h3>
        {assignedJudges.length === 0 ? (
          <p className="text-white/40 text-sm">No judges assigned to this submission yet.</p>
        ) : (
          <div className="space-y-3">
            {assignedJudges.map((aj) => (
              <div
                key={aj.judge_id}
                className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {aj.profiles?.full_name || 'Unnamed Judge'}
                  </p>
                  <p className="text-xs text-white/40 truncate">{aj.profiles?.email}</p>
                </div>
                <button
                  onClick={() => handleUnassign(aj.judge_id)}
                  disabled={loading || unassigningId === aj.judge_id}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-200 disabled:opacity-50 shrink-0"
                >
                  {unassigningId === aj.judge_id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
