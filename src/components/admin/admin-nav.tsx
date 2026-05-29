import Link from 'next/link';

type TabKey = 'submissions' | 'judges' | 'users' | 'leaderboard';

const tabs: { key: TabKey; href: string; label: string }[] = [
  { key: 'submissions', href: '/admin', label: 'Submissions' },
  { key: 'judges', href: '/admin/judges', label: 'Judges' },
  { key: 'users', href: '/admin/users', label: 'Users' },
  { key: 'leaderboard', href: '/admin/leaderboard', label: 'Leaderboard' },
];

export default function AdminNav({ active }: { active: TabKey }) {
  return (
    <nav
      className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Admin sections"
    >
      <div className="flex flex-nowrap gap-4 sm:gap-6 border-b border-white/10 pb-4 w-max max-w-full sm:w-auto sm:flex-wrap sm:max-w-none">
        {tabs.map((tab) =>
          active === tab.key ? (
            <span
              key={tab.key}
              className="text-white font-bold border-b-2 border-white pb-4 -mb-[18px] shrink-0 text-sm sm:text-base"
            >
              {tab.label}
            </span>
          ) : (
            <Link
              key={tab.key}
              href={tab.href}
              className="text-white/50 hover:text-white transition font-medium shrink-0 text-sm sm:text-base"
            >
              {tab.label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}
