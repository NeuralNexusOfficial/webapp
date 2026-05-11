"use client";

import { useState } from "react";

export default function TeamActions() {
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleSolo = async () => {
    alert("Participating solo");
  };

  const handleCreateTeam = async () => {
    alert(`Creating team: ${teamName}`);
  };

  const handleJoinTeam = async () => {
    alert(`Joining with code: ${inviteCode}`);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* SOLO */}

      <div className="bg-[#181830] border border-zinc-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold text-white">
          Participate Solo
        </h2>

        <p className="text-zinc-400 mt-2">
          Join the hackathon individually.
        </p>

        <button
          onClick={handleSolo}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl"
        >
          Continue Solo
        </button>
      </div>

      {/* CREATE TEAM */}

      <div className="bg-[#181830] border border-zinc-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold text-white">
          Create Team
        </h2>

        <p className="text-zinc-400 mt-2">
          Build a team and invite members.
        </p>

        <input
          type="text"
          placeholder="Team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="mt-6 w-full bg-[#0d0d1f] border border-zinc-700 rounded-xl px-4 py-3 text-white"
        />

        <button
          onClick={handleCreateTeam}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl"
        >
          Create Team
        </button>
      </div>

      {/* JOIN TEAM */}

      <div className="bg-[#181830] border border-zinc-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold text-white">
          Join Team
        </h2>

        <p className="text-zinc-400 mt-2">
          Enter invite code to join.
        </p>

        <input
          type="text"
          placeholder="Invite code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="mt-6 w-full bg-[#0d0d1f] border border-zinc-700 rounded-xl px-4 py-3 text-white"
        />

        <button
          onClick={handleJoinTeam}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl"
        >
          Join Team
        </button>
      </div>
    </div>
  );
}