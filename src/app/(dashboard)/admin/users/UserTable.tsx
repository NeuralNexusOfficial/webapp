'use client'

import { useState, useTransition } from 'react'
import { Profile } from '@/types'
import { updateUserRole } from '@/app/actions/admin'

export default function UserTable({ users }: { users: Profile[] }) {
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

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

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`p-4 rounded-xl text-sm border animate-in fade-in slide-in-from-top-2 ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {toast.msg}
        </div>
      )}
      <div className="card-cyber overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-xs tracking-widest uppercase">
              <th className="p-4 font-medium whitespace-nowrap">Name</th>
              <th className="p-4 font-medium whitespace-nowrap">Email</th>
              <th className="p-4 font-medium whitespace-nowrap">Current Role</th>
              <th className="p-4 font-medium whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
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
                <td className="p-4 text-right">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                    disabled={isPending || user.email === 'kishlayamishra@gmail.com'}
                    className={`bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-white/20 transition-all ${
                      user.email === 'kishlayamishra@gmail.com' ? 'opacity-50 cursor-not-allowed text-purple-400 border-purple-500/30' : 'text-white cursor-pointer hover:bg-white/5'
                    }`}
                  >
                    <option value="USER" className="bg-black text-white">User</option>
                    <option value="ADMIN" className="bg-black text-purple-400">Admin</option>
                    <option value="JUDGE" className="bg-black text-amber-400">Judge</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
