import TeamActions from "@/components/dashboard/team-actions";
import { getMyTeam } from "@/app/actions/team";

export default async function TeamPage() {
  const teamRes = await getMyTeam();
  const team = teamRes.success ? teamRes.data : null;

  return (
    <div className="p-8 text-white min-h-screen">
      {team ? (
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="tag-label">My Team</div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {team.name}
            </h1>
          </div>
          <div className="card-cyber p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-widest text-white/30 mb-2">Invite Code</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <span className="font-mono text-xl tracking-wider text-emerald-400">{team.invite_code}</span>
                <span className="text-xs text-white/40">Share this with your members</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-white/40 uppercase mb-1">Status</p>
                <p className="font-semibold text-white">{team.status}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-white/40 uppercase mb-1">Capacity</p>
                <p className="font-semibold text-white">Up to {team.max_members} members</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <TeamActions />
      )}
    </div>
  );
}
