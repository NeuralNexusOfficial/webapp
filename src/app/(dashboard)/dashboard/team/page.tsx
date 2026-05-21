import TeamActions from "@/components/dashboard/team-actions";
import { getMyTeamWithMembers } from "@/app/actions/team";
import { Crown, User } from "lucide-react";

export default async function TeamPage() {
  const teamRes = await getMyTeamWithMembers();
  const team = teamRes.success ? teamRes.data : null;

  return (
    <div className="p-8 text-white min-h-screen">
      {team ? (
        <div className="max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="tag-label">My Team</div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {team.name}
            </h1>
          </div>

          <div className="space-y-4">
            {/* Invite Code + Stats */}
            <div className="card-cyber p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-sm uppercase tracking-widest text-white/30 mb-2">
                  Invite Code
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-mono text-xl tracking-wider text-emerald-400">
                    {team.invite_code}
                  </span>
                  <span className="text-xs text-white/40">
                    Share this with your members
                  </span>
                </div>
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

            {/* Members List */}
            <div className="card-cyber p-6 md:p-8">
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
                        {member.full_name ? (
                          <span className="text-sm font-bold text-white/70">
                            {member.full_name.trim()[0].toUpperCase()}
                          </span>
                        ) : (
                          <User size={16} className="text-white/40" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/90 truncate">
                          {member.full_name ?? "Hacker"}
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
          </div>
        </div>
      ) : (
        <TeamActions />
      )}
    </div>
  );
}
