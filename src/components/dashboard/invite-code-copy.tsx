'use client';

import { Copy } from 'lucide-react';

export default function InviteCodeCopy({ code }: { code: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group">
      <span className="font-mono text-xl tracking-wider text-emerald-400">
        {code}
      </span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          alert('Invite code copied to clipboard!');
        }}
        className="text-xs text-white/40 hover:text-white flex items-center gap-1.5 transition-colors"
        title="Copy invite code"
      >
        <Copy size={14} />
        <span className="hidden sm:inline">Copy</span>
      </button>
    </div>
  );
}
