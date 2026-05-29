import AdminPageShell from '@/components/admin/admin-page-shell';
import { getAllUsers } from '@/app/actions/admin';
import UserTable from './UserTable';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const res = await getAllUsers();
  const users = res.success ? res.data : [];
  const error = !res.success ? res.error : null;

  return (
    <AdminPageShell title="User Management" activeTab="users">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          All Registered Users
        </h2>
        <p className="text-sm text-white/40 mt-1">
          View and manage roles for {users.length} total users.
        </p>
      </div>

      <UserTable users={users} />
    </AdminPageShell>
  );
}
