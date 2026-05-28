'use client'

import { useState, useTransition } from 'react'
import { Profile } from '@/types'
import { updateUserRole, deleteUser } from '@/app/actions/admin'
import { Trash2, X, AlertTriangle } from 'lucide-react'

export default function UserTable({ users }: { users: Profile[] }) {
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [query, setQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null)

  function handleRoleChange(userId: string, newRole: 'USER' | 'ADMIN' | 'JUDGE') {
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole)
      if (res.success) {
        setToast({ msg: 'Role updated successfully', type: 'success' })
      } else {
        setToast({ msg: res.error, type: 'error' })
      }
      setTimeout(() => setToast(null), 3000)
    })
  }

  function handleDelete() {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = await deleteUser(deleteTarget.id)
      if (res.success) {
        setToast({ msg: `${deleteTarget.full_name || deleteTarget.email || 'User'} has been deleted.`, type: 'success' })
      } else {
        setToast({ msg: res.error, type: 'error' })
      }
      setDeleteTarget(null)
      setTimeout(() => setToast(null), 4000)
    })
  }

  const normalizedQuery = query.trim().toLowerCase()
  const filteredUsers = users.filter((user) => {
    if (!normalizedQuery) return true
    const name = (user.full_name ?? '').toLowerCase()
    const email = (user.email ?? '').toLowerCase()
    return name.includes(normalizedQuery) || email.includes(normalizedQuery)
  })

  const isSuperAdmin = (email: string | null) => email === 'kishlayamishra@gmail.com'

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`p-4 rounded-xl text-sm border animate-in fade-in slide-in-from-top-2 ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {toast.msg}
        </div>
      )}
      <div className="max-w-md">
        <label htmlFor="user-search" className="text-xs uppercase tracking-widest text-white/30 mb-2 block">
          Search Users
        </label>
        <input
          id="user-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by user name or email"
          className="input-nn"
          autoComplete="off"
        />
      </div>
      <div className="card-cyber overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-xs tracking-widest uppercase">
              <th className="p-4 font-medium whitespace-nowrap">Name</th>
              <th className="p-4 font-medium whitespace-nowrap">Email</th>
              <th className="p-4 font-medium whitespace-nowrap">Current Role</th>
              <th className="p-4 font-medium whitespace-nowrap">Change Role</th>
              <th className="p-4 font-medium whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4 text-sm font-medium text-white">{user.full_name || '—'}</td>
                <td className="p-4 text-sm text-white/60">{user.email || '—'}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                    user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' :
                    user.role === 'JUDGE' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                    disabled={isPending || isSuperAdmin(user.email)}
                    className={`bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-white/20 transition-all ${
                      isSuperAdmin(user.email) ? 'opacity-50 cursor-not-allowed text-purple-400 border-purple-500/30' : 'text-white cursor-pointer hover:bg-white/5'
                    }`}
                  >
                    <option value="USER" className="bg-black text-white">User</option>
                    <option value="ADMIN" className="bg-black text-purple-400">Admin</option>
                    <option value="JUDGE" className="bg-black text-amber-400">Judge</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setDeleteTarget(user)}
                    disabled={isPending || isSuperAdmin(user.email)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isSuperAdmin(user.email)
                        ? 'opacity-30 cursor-not-allowed text-white/30'
                        : 'text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20'
                    }`}
                    title={isSuperAdmin(user.email) ? 'Super Admin cannot be deleted' : `Delete ${user.full_name || user.email}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-sm text-white/40 text-center">
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="card-cyber w-full max-w-md p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Confirm Deletion</h2>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-white/70 leading-relaxed">
                Are you sure you want to permanently delete this user? This action <span className="text-red-400 font-semibold">cannot be undone</span>.
              </p>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30 uppercase tracking-widest">Name</span>
                  <span className="text-sm text-white font-medium">{deleteTarget.full_name || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30 uppercase tracking-widest">Email</span>
                  <span className="text-sm text-white/70">{deleteTarget.email || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30 uppercase tracking-widest">Role</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                    deleteTarget.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' :
                    deleteTarget.role === 'JUDGE' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {deleteTarget.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete User'}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 text-sm font-semibold hover:bg-white/[0.06] hover:text-white transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
