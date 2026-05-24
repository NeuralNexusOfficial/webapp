'use client';

import { useState } from 'react';
import { assignJudge, unassignJudge } from '@/app/actions/judging';

export default function AssignSubmissionClient({ 
  judgeId, 
  allSubmissions, 
  assignedSubmissions 
}: { 
  judgeId: string, 
  allSubmissions: any[], 
  assignedSubmissions: any[] 
}) {
  const [selectedSubId, setSelectedSubId] = useState('');
  const [loading, setLoading] = useState(false);

  const availableSubmissions = allSubmissions.filter(
    sub => !assignedSubmissions.some(assigned => assigned.id === sub.id)
  );

  async function handleAssign() {
    if (!selectedSubId) return;
    setLoading(true);
    const res = await assignJudge(selectedSubId, judgeId);
    if (!res.success) {
      alert(res.error);
    }
    setSelectedSubId('');
    setLoading(false);
  }

  async function handleUnassign(submissionId: string) {
    if (!confirm('Are you sure you want to unassign this submission?')) return;
    setLoading(true);
    const res = await unassignJudge(submissionId, judgeId);
    if (!res.success) {
      alert(res.error);
    }
    setLoading(false);
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <div className="flex gap-2">
        <select 
          className="input-nn text-sm flex-1 p-2"
          value={selectedSubId}
          onChange={(e) => setSelectedSubId(e.target.value)}
          disabled={loading || availableSubmissions.length === 0}
        >
          <option value="">Assign project...</option>
          {availableSubmissions.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.title} ({sub.track})</option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          disabled={!selectedSubId || loading}
          className="btn-pill btn-primary py-2 px-4 text-sm disabled:opacity-50"
        >
          {loading ? '...' : 'Add'}
        </button>
      </div>

      {assignedSubmissions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-widest text-red-400/70 mb-2">Danger Zone</p>
          <div className="space-y-2">
            {assignedSubmissions.map(sub => (
              <div key={sub.id} className="flex justify-between items-center text-xs border border-white/5 rounded p-2 bg-black/30">
                <span className="truncate flex-1 pr-2 text-white/70">{sub.title}</span>
                <button 
                  onClick={() => handleUnassign(sub.id)}
                  disabled={loading}
                  className="text-red-400 hover:text-red-300 font-bold px-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
