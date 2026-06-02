import TeamActions from "@/components/dashboard/team-actions";
import Sidebar from "@/components/dashboard/sidebar";
import TeamManage from "@/components/dashboard/team-manage";
import { getMyTeamWithMembers } from "@/app/actions/team";
import { getPaymentStatus } from "@/app/actions/payment";
import { createClient } from "@/lib/supabase/server";
import { Crown, Check, CreditCard } from "lucide-react";
import Link from "next/link";
import InviteCodeCopy from "@/components/dashboard/invite-code-copy";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const teamRes = await getMyTeamWithMembers();
  const team = teamRes.success ? teamRes.data : null;
  const paymentRes = await getPaymentStatus();
  const isPaid = paymentRes.status === 'SUCCESS';

  // Determine the current user's role in the team
  const currentMember = team?.members.find(m => m.user_id === user?.id);
  const userRole = currentMember?.role ?? 'MEMBER';
  const isSolo = team ? team.max_members === 1 : false;

  return (
    <main className="min-h-screen flex bg-black text-white">
      <Sidebar />
      <section className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="border-b border-white/[0.06] px-6 md:px-10 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="pl-10 md:pl-0">
            <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Team Space
            </h1>
            <p className="text-xs md:text-sm text-white/30 mt-0.5">AOT Hackathon 2026</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40 pl-10 sm:pl-0">
            <span className={`w-1.5 h-1.5 rounded-full inline-block animate-pulse ${team ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            Status: {team ? 'Active Team' : 'Setup Required'}
          </div>
        </div>

        {team ? (
          <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="tag-label">My Team</div>
              <h2
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {team.name}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Invite Code + Stats (Hidden for Solo) */}
              {!isSolo && (
                <div className="card-cyber p-4 sm:p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-widest text-white/30 mb-2">
                      Invite Code
                    </h3>
                    <InviteCodeCopy code={team.invite_code} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl">
                      <p className="text-xs text-white/40 uppercase mb-1">Status</p>
                      <p className="font-semibold text-white">{team.status}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <p className="text-xs text-white/40 uppercase mb-1">Capacity</p>
                      <p className="font-semibold text-white">
                        {team.members.length} / {team.max_members} members
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Status */}
              <div className={`card-cyber p-4 sm:p-6 md:p-8 ${isPaid ? 'border-emerald-500/20' : 'border-amber-500/20'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${isPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {isPaid ? <Check className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
                      {isPaid ? 'Payment Confirmed' : 'Continue to Project Submission'}
                    </p>
                    <p className="text-white/40 text-sm mt-1">
                      {isPaid
                        ? `Your team is fully registered${paymentRes.track ? ` for the ${paymentRes.track} track` : ''}. You can now submit your project.`
                        : 'You must submit your project details and complete payment on the submission page to finalize your registration.'}
                    </p>
                    {!isPaid && (
                      <Link
                        href="/dashboard/submit"
                        className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        Continue to Submit Page →
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="card-cyber p-4 sm:p-6 md:p-8">
                <h3 className="text-sm uppercase tracking-widest text-white/30 mb-4">
                  Team Members
                </h3>

                {team.members.length === 0 ? (
                  <p className="text-white/30 text-sm italic">No members yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {team.members.map((member) => (
                      <li
                        key={member.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                          {member.full_name && (
                            <span className="text-sm font-bold text-white/70">
                              {member.full_name.trim()[0].toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white/90 truncate">
                            {member.full_name}
                          </p>
                          {member.email && (
                            <p className="text-xs text-white/30 truncate">
                              {member.email}
                            </p>
                          )}
                        </div>

                        {/* Role badge */}
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            member.role === "LEADER"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                              : "bg-white/[0.04] border-white/10 text-white/40"
                          }`}
                        >
                          {member.role === "LEADER" && (
                            <Crown size={11} className="text-amber-400" />
                          )}
                          {member.role}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Leave / Disband */}
              <TeamManage
                role={userRole as 'LEADER' | 'MEMBER'}
                isPaid={isPaid}
                isSolo={isSolo}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-10">
            <TeamActions />
          </div>
        )}
      </section>
    </main>
  );
}
