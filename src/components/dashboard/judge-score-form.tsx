'use client';

import { useState } from 'react';
import { scoreSubmission } from '@/app/actions/judging';

export default function JudgeScoreForm({ submissionId, existingScore }: { submissionId: string, existingScore: any }) {
  const [scores, setScores] = useState({
    innovation: existingScore?.innovation_score?.toString() || '',
    technical: existingScore?.technical_score?.toString() || '',
    uiux: existingScore?.ui_ux_score?.toString() || '',
    scalability: existingScore?.scalability_score?.toString() || '',
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

    const innovation = parseInt(scores.innovation) || 0;
    const technical = parseInt(scores.technical) || 0;
    const uiux = parseInt(scores.uiux) || 0;
    const scalability = parseInt(scores.scalability) || 0;

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
        <label>
          <span className="text-xs text-white/40 uppercase mb-1 block">Innovation (0-10)</span>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Innovation Score"
            className="input-nn"
            value={scores.innovation}
            onChange={(e) => handleChange('innovation', e.target.value)}
          />
        </label>

        <label>
          <span className="text-xs text-white/40 uppercase mb-1 block">Technical (0-10)</span>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Technical Score"
            className="input-nn"
            value={scores.technical}
            onChange={(e) => handleChange('technical', e.target.value)}
          />
        </label>

        <label>
          <span className="text-xs text-white/40 uppercase mb-1 block">UI/UX (0-10)</span>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="UI/UX Score"
            className="input-nn"
            value={scores.uiux}
            onChange={(e) => handleChange('uiux', e.target.value)}
          />
        </label>

        <label>
          <span className="text-xs text-white/40 uppercase mb-1 block">Scalability (0-10)</span>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Scalability Score"
            className="input-nn"
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
