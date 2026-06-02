'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function InviteCodeCopy({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-2 group">
      <span className="font-mono text-xl tracking-wider text-emerald-400">
        {code}
      </span>
      <button
        onClick={handleCopy}
        className="text-xs text-white/40 hover:text-white flex items-center gap-1.5 transition-colors"
        title="Copy invite code"
      >
        {copied ? (
          <>
            <Check size={14} className="text-emerald-400" />
            <span className="text-emerald-400">Copied</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span className="hidden sm:inline">Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
