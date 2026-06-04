import Sidebar from '@/components/dashboard/sidebar';
import AdminNav from './admin-nav';

export default function AdminPageShell({
  title,
  activeTab,
  children,
}: {
  title: string;
  activeTab: 'submissions' | 'judges' | 'users' | 'leaderboard';
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex w-full max-w-[100vw] overflow-x-hidden bg-black">
      <Sidebar />
      <section className="flex-1 min-w-0 max-w-full overflow-x-hidden overflow-y-auto px-6 pt-16 pb-6 sm:px-6 md:px-10 md:pt-10 md:pb-10">
        <div className="mb-8 md:mb-10">
          <p className="text-xs uppercase tracking-widest text-white/30 mb-2">Admin Panel</p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 break-words"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h1>
          <AdminNav active={activeTab} />
        </div>
        {children}
      </section>
    </main>
  );
}
