"use client";

import { useState, useTransition } from "react";
import { createTeam, joinTeam } from "@/app/actions/team";

export default function TeamActions() {
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  function handleCreate() {
    if (!teamName.trim()) return showToast("Enter a team name", false);
    startTransition(async () => {
      const res = await createTeam({ name: teamName.trim() });
      if (res.success) {
        showToast(`Team "${res.data.name}" created! Invite code: ${res.data.invite_code}`, true);
        setTeamName("");
      } else {
        showToast(res.error, false);
      }
    });
  }

  function handleJoin() {
    if (!inviteCode.trim()) return showToast("Enter an invite code", false);
    startTransition(async () => {
      const res = await joinTeam({ invite_code: inviteCode.trim() });
      if (res.success) {
        showToast(`Joined team "${res.data.team_name}"!`, true);
        setInviteCode("");
      } else {
        showToast(res.error, false);
      }
    });
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="tag-label">Team</div>
        <h2
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Team Setup
        </h2>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-6 px-5 py-4 rounded-xl text-sm font-medium border ${
            toast.ok
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">

        {/* Solo */}
        <div className="card-cyber p-7 flex flex-col gap-4">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Option A</p>
            <h3
              className="text-xl font-semibold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Go Solo
            </h3>
            <p className="text-sm text-white/40 mt-2 leading-relaxed">
              Compete individually. No team required.
            </p>
          </div>
          <button
            disabled={isPending}
            className="btn-pill btn-outline text-sm py-2.5 w-full justify-center mt-auto"
          >
            Continue Solo
          </button>
        </div>

        {/* Create */}
        <div className="card-cyber p-7 flex flex-col gap-4">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Option B</p>
            <h3
              className="text-xl font-semibold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Create Team
            </h3>
            <p className="text-sm text-white/40 mt-2 leading-relaxed">
              Start a team and share your invite code.
            </p>
          </div>
          <input
            id="team-name-input"
            type="text"
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="input-nn"
          />
          <button
            id="create-team-btn"
            onClick={handleCreate}
            disabled={isPending}
            className="btn-pill btn-primary text-sm py-2.5 w-full justify-center"
          >
            {isPending ? "Creating…" : "Create Team →"}
          </button>
        </div>

        {/* Join */}
        <div className="card-cyber p-7 flex flex-col gap-4">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Option C</p>
            <h3
              className="text-xl font-semibold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Join Team
            </h3>
            <p className="text-sm text-white/40 mt-2 leading-relaxed">
              Have an invite code? Join your teammates.
            </p>
          </div>
          <input
            id="invite-code-input"
            type="text"
            placeholder="8-char invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            className="input-nn"
          />
          <button
            id="join-team-btn"
            onClick={handleJoin}
            disabled={isPending}
            className="btn-pill btn-outline text-sm py-2.5 w-full justify-center"
          >
            {isPending ? "Joining…" : "Join Team →"}
          </button>
        </div>

      </div>
    </div>
  );
}