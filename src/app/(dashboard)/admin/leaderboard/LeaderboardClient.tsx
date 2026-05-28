'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trophy, Medal, Award, TrendingUp, Users, Star, ChevronDown, ChevronUp } from 'lucide-react';
import type { LeaderboardEntry } from '@/app/actions/leaderboard';

type SortKey = 'avg_total' | 'avg_innovation' | 'avg_technical' | 'avg_uiux' | 'avg_scalability' | 'judge_count';

const RANK_STYLES = [
  { bg: 'bg-gradient-to-r from-amber-500/15 to-yellow-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: Trophy },
  { bg: 'bg-gradient-to-r from-slate-300/10 to-slate-400/5', border: 'border-slate-400/25', text: 'text-slate-300', icon: Medal },
  { bg: 'bg-gradient-to-r from-orange-700/10 to-amber-700/5', border: 'border-orange-700/25', text: 'text-orange-400', icon: Award },
];

export default function LeaderboardClient({
  entries,
  initialTrack,
}: {
  entries: LeaderboardEntry[];
  initialTrack?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortKey, setSortKey] = useState<SortKey>('avg_total');
  const [sortAsc, setSortAsc] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'All') {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  const filteredEntries = entries
    .filter((e) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.team_name.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const diff = sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
      return diff;
    });

  const topScore = filteredEntries.length > 0 ? filteredEntries[0]?.avg_total : 0;

  // Stats
  const totalScored = entries.length;
  const avgScore = entries.length > 0
    ? Math.round((entries.reduce((sum, e) => sum + e.avg_total, 0) / entries.length) * 10) / 10
    : 0;
  const highestScore = entries.length > 0
    ? Math.max(...entries.map(e => e.avg_total))
    : 0;

  const SortHeader = ({ label, field, className = '' }: { label: string; field: SortKey; className?: string }) => (
    <th
      className={`p-4 font-medium whitespace-nowrap cursor-pointer select-none hover:text-white/70 transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        {sortKey === field ? (
          sortAsc ? <ChevronUp className="w-3 h-3 text-blue-400" /> : <ChevronDown className="w-3 h-3 text-blue-400" />
        ) : (
          <ChevronDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-cyber p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs uppercase text-white/30 tracking-widest">Scored Projects</p>
              <p className="text-2xl font-bold text-white">{totalScored}</p>
            </div>
          </div>
        </div>
        <div className="card-cyber p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs uppercase text-white/30 tracking-widest">Average Score</p>
              <p className="text-2xl font-bold text-white">{avgScore}<span className="text-sm text-white/30 ml-1">/ 40</span></p>
            </div>
          </div>
        </div>
        <div className="card-cyber p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs uppercase text-white/30 tracking-widest">Highest Score</p>
              <p className="text-2xl font-bold text-white">{highestScore}<span className="text-sm text-white/30 ml-1">/ 40</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-cyber p-6 grid md:grid-cols-2 gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by project or team name..."
          className="input-nn"
          autoComplete="off"
        />
        <select
          value={initialTrack || 'All'}
          onChange={(e) => {
            router.push(`/admin/leaderboard?${createQueryString('track', e.target.value)}`);
          }}
          className="input-nn"
        >
          <option value="All">All Tracks</option>
          <option value="AI/ML">AI/ML</option>
          <option value="Web3">Web3</option>
          <option value="HealthTech">HealthTech</option>
          <option value="FinTech">FinTech</option>
          <option value="OpenInnovation">Open Innovation</option>
        </select>
      </div>

      {/* Leaderboard Table */}
      {filteredEntries.length === 0 ? (
        <div className="card-cyber p-16 flex flex-col items-center justify-center text-center">
          <Trophy className="w-12 h-12 text-white/10 mb-4" />
          <p className="text-white/50 text-lg font-semibold">No scored submissions yet</p>
          <p className="text-white/25 text-sm mt-1">Scores from judges will appear here as a ranked leaderboard.</p>
        </div>
      ) : (
        <div className="card-cyber overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs tracking-widest uppercase">
                <th className="p-4 font-medium whitespace-nowrap w-12">Rank</th>
                <th className="p-4 font-medium whitespace-nowrap">Project</th>
                <th className="p-4 font-medium whitespace-nowrap">Team</th>
                <th className="p-4 font-medium whitespace-nowrap">Track</th>
                <SortHeader label="Innovation" field="avg_innovation" />
                <SortHeader label="Technical" field="avg_technical" />
                <SortHeader label="UI/UX" field="avg_uiux" />
                <SortHeader label="Scalability" field="avg_scalability" />
                <SortHeader label="Total" field="avg_total" className="text-white/60" />
                <SortHeader label="Judges" field="judge_count" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredEntries.map((entry, index) => {
                const rankStyle = index < 3 ? RANK_STYLES[index] : null;
                const RankIcon = rankStyle?.icon;
                const scorePercent = topScore > 0 ? (entry.avg_total / topScore) * 100 : 0;

                return (
                  <tr
                    key={entry.submission_id}
                    className={`transition-colors ${
                      rankStyle
                        ? `${rankStyle.bg} border-l-2 ${rankStyle.border}`
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Rank */}
                    <td className="p-4">
                      {rankStyle && RankIcon ? (
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${rankStyle.text}`}>
                          <RankIcon className="w-5 h-5" />
                        </div>
                      ) : (
                        <span className="text-sm text-white/30 font-mono pl-2">
                          #{index + 1}
                        </span>
                      )}
                    </td>

                    {/* Project */}
                    <td className="p-4">
                      <p className={`text-sm font-semibold ${rankStyle ? rankStyle.text : 'text-white'}`}>
                        {entry.title}
                      </p>
                    </td>

                    {/* Team */}
                    <td className="p-4 text-sm text-white/60">{entry.team_name}</td>

                    {/* Track */}
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-white/40">
                        {entry.track}
                      </span>
                    </td>

                    {/* Score Cells */}
                    <td className="p-4">
                      <ScoreCell value={entry.avg_innovation} max={10} />
                    </td>
                    <td className="p-4">
                      <ScoreCell value={entry.avg_technical} max={10} />
                    </td>
                    <td className="p-4">
                      <ScoreCell value={entry.avg_uiux} max={10} />
                    </td>
                    <td className="p-4">
                      <ScoreCell value={entry.avg_scalability} max={10} />
                    </td>

                    {/* Total */}
                    <td className="p-4">
                      <div className="space-y-1.5">
                        <span className={`text-sm font-bold ${
                          rankStyle ? rankStyle.text : 'text-white'
                        }`}>
                          {entry.avg_total}
                        </span>
                        <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              index === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                              index === 1 ? 'bg-gradient-to-r from-slate-400 to-slate-300' :
                              index === 2 ? 'bg-gradient-to-r from-orange-600 to-amber-500' :
                              'bg-gradient-to-r from-blue-500/60 to-blue-400/40'
                            }`}
                            style={{ width: `${scorePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Judge count */}
                    <td className="p-4">
                      <span className="text-sm text-white/40">{entry.judge_count}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ScoreCell({ value, max }: { value: number; max: number }) {
  const ratio = value / max;
  const color = ratio >= 0.8 ? 'text-emerald-400' : ratio >= 0.6 ? 'text-blue-400' : ratio >= 0.4 ? 'text-amber-400' : 'text-red-400';

  return (
    <span className={`text-sm font-medium ${color}`}>
      {value}
    </span>
  );
}
