'use client';

import { useState } from 'react';
import { scoreSubmission } from '@/app/actions/judging';

export default function JudgeScoreForm({ submissionId, existingScore }: { submissionId: string, existingScore: any }) {
  const [scores, setScores] = useState({
    innovation: existingScore?.innovation_score?.toString() || '0',
    technical: existingScore?.technical_score?.toString() || '0',
    uiux: existingScore?.ui_ux_score?.toString() || '0',
    scalability: existingScore?.scalability_score?.toString() || '0',
    comments: existingScore?.comments || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function handleChange(key: string, value: string) {
    setScores((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSave() {
    setLoading(true);
    setToast(null);

    const innovation = parseInt(scores.innovation) ?? 5;
    const technical = parseInt(scores.technical) ?? 5;
    const uiux = parseInt(scores.uiux) ?? 5;
    const scalability = parseInt(scores.scalability) ?? 5;

    const res = await scoreSubmission(
      submissionId,
      innovation,
      technical,
      uiux,
      scalability,
      scores.comments
    );

    if (res.success) {
      setToast({ msg: 'Scores saved successfully!', ok: true });
      setTimeout(() => {
        setToast(null);
      }, 3000);
    } else {
      setToast({ msg: res.error || 'Failed to save scores', ok: false });
    }
    
    setLoading(false);
  }

  return (
    <div className="card-cyber p-4 sm:p-6">
      <h2 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-6">
        Judge Scoring
      </h2>

      {toast && (
        <div className={`p-4 mb-6 rounded-lg border ${toast.ok ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <label className="block">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-white/40 uppercase tracking-wider">Innovation</span>
            <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
              {scores.innovation}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
            value={scores.innovation}
            onChange={(e) => handleChange('innovation', e.target.value)}
          />
        </label>

        <label className="block">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-white/40 uppercase tracking-wider">Technical</span>
            <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
              {scores.technical}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
            value={scores.technical}
            onChange={(e) => handleChange('technical', e.target.value)}
          />
        </label>

        <label className="block">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-white/40 uppercase tracking-wider">UI/UX</span>
            <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
              {scores.uiux}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
            value={scores.uiux}
            onChange={(e) => handleChange('uiux', e.target.value)}
          />
        </label>

        <label className="block">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-white/40 uppercase tracking-wider">Scalability</span>
            <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded min-w-[2rem] text-center border border-white/10">
              {scores.scalability}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white block my-3 focus:outline-none"
            value={scores.scalability}
            onChange={(e) => handleChange('scalability', e.target.value)}
          />
        </label>
      </div>

      <label className="block mt-4 sm:mt-5">
        <span className="text-xs text-white/40 uppercase mb-1 block">Comments (Optional)</span>
        <textarea
          placeholder="Judge comments..."
          className="input-nn min-h-[120px] sm:min-h-[140px] w-full"
          value={scores.comments}
          onChange={(e) => handleChange('comments', e.target.value)}
        />
      </label>

      <button
        onClick={handleSave}
        disabled={loading}
        className={`btn-pill btn-primary mt-5 sm:mt-6 w-full sm:w-auto ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Saving...' : 'Save Scores →'}
      </button>
    </div>
  );
}
