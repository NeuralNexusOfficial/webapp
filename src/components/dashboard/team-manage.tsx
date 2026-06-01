'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { leaveTeam, disbandTeam } from '@/app/actions/team';
import { LogOut, Trash2, AlertTriangle } from 'lucide-react';

interface TeamManageProps {
  role: 'LEADER' | 'MEMBER';
  isPaid: boolean;
  isSolo: boolean;
}

export default function TeamManage({ role, isPaid, isSolo }: TeamManageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 5000);
  }

  const isLeader = role === 'LEADER';

  // Leader disbands, member leaves
  const actionLabel = isLeader
    ? isSolo
      ? 'Cancel Solo Registration'
      : 'Disband Team'
    : 'Leave Team';

  const actionDescription = isLeader
    ? isSolo
      ? 'This will remove your solo registration. You can then choose a different option (create a team or join one).'
      : 'This will permanently delete the team and remove all members. Everyone will need to re-register.'
    : 'You will be removed from this team. You can then create your own team, join another, or go solo.';

  function handleAction() {
    setConfirmOpen(false);
    startTransition(async () => {
      const res = isLeader ? await disbandTeam() : await leaveTeam();
      if (res.success) {
        showToast(
          isLeader
            ? isSolo
              ? 'Solo registration cancelled.'
              : 'Team disbanded successfully.'
            : 'You have left the team.',
          true,
        );
        router.refresh();
      } else {
        showToast(res.error, false);
      }
    });
  }

  // If paid, show a locked message instead of the action button
  if (isPaid) {
    return null; // Don't render anything — the payment confirmed card already shows
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`px-5 py-4 rounded-xl text-sm font-medium border ${
            toast.ok
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Confirmation dialog overlay */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-cyber p-6 md:p-8 max-w-md w-full border-red-500/30 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p
                  className="text-white font-semibold text-lg"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {actionLabel}?
                </p>
                <p className="text-white/50 text-sm mt-1">{actionDescription}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                className="btn-pill btn-outline text-sm py-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={isPending}
                className="btn-pill text-sm py-2 px-4 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                {isPending ? 'Processing…' : `Yes, ${actionLabel}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="card-cyber p-4 sm:p-6 md:p-8 border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/50">
              {isLeader
                ? isSolo
                  ? 'Want to switch to a team instead?'
                  : 'Want to start fresh?'
                : 'Want to switch teams?'}
            </p>
            <p className="text-xs text-white/25 mt-1">
              {isLeader
                ? isSolo
                  ? 'Cancel your solo registration to explore other options.'
                  : 'Disband this team to create a new one or go solo.'
                : 'Leave this team to join another or go solo.'}
            </p>
          </div>
          <button
            id="team-manage-action-btn"
            onClick={() => setConfirmOpen(true)}
            disabled={isPending}
            className="btn-pill text-sm py-2 px-4 border border-red-500/30 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors shrink-0 flex items-center justify-center w-full sm:w-auto gap-2"
          >
            {isLeader ? (
              <Trash2 className="w-3.5 h-3.5" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            {actionLabel}
          </button>
        </div>
      </div>
    </>
  );
}
