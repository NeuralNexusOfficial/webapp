'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Payment } from '@/types';

// Extend payment with optional user_name from server join
type PaymentItem = Payment & { user_name?: string | null };

/**
 * Client component that displays a searchable and filterable list of payments.
 * Shows the paid user's full name (if available) and allows filtering by status.
 * Clicking a payment opens a detail modal.
 */
export default function PaymentsList({ payments }: { payments: PaymentItem[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' means all
  const [selected, setSelected] = useState<PaymentItem | null>(null);

  const filtered = payments.filter((p) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query ||
      p.id.toLowerCase().includes(query) ||
      (p.user_id?.toLowerCase().includes(query) ?? false) ||
      (p.user_name?.toLowerCase().includes(query) ?? false) ||
      (p.razorpay_order_id?.toLowerCase().includes(query) ?? false);
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Controls: Search + Status Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative group flex-1">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition duration-300 pointer-events-none" />
          <div className="relative flex items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, user, name..."
              className="input-nn pl-4 pr-12 w-full transition-all duration-200"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch('')}
                  className="absolute right-4 text-white/40 hover:text-white transition duration-200"
                  type="button"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="text-white/70 text-sm">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-nn text-sm"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4 mt-6">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-cyber p-8 text-center"
            >
              <p className="text-white/70 text-lg font-bold">No payments found</p>
              {search && (
                <p className="text-white/30 text-sm mt-1">No results match "{search}"</p>
              )}
            </motion.div>
          ) : (
            filtered.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-black/70 backdrop-blur-md border border-green-500/30 rounded-xl p-6 transition cursor-pointer ring-1 ring-green-500/20 ${selected?.id === p.id ? 'border-2 border-green-500/70 bg-black/80 shadow-xl ring-2 ring-green-500/50' : ''}`}
                onClick={() => setSelected(p)}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-white/30 text-sm mb-1">Payment ID</p>
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{p.id}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-white/30 text-sm mb-1">Amount</p>
                    <h3 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{'$'}{p.amount}</h3>
                  </div>
                </div>

                {/* Username displayed prominently */}
                <div className="mt-2">
                  <p className="text-white/30 text-sm mb-1">Paid By</p>
                  <h3 className="text-3xl font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>{p.user_name ?? p.user_id}</h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 items-center text-sm">
                  {/* Mode badge */}
                  <span className="px-2 py-1 rounded-full bg-blue-600/30 text-blue-200 font-medium">
                    {p.razorpay_order_id
                      ? p.razorpay_order_id.toLowerCase().includes('upi')
                        ? 'UPI'
                        : 'Debit Card'
                      : 'Manual'}
                  </span>
                  {/* Status badge with color coding */}
                  <span className={
                    p.status === 'SUCCESS' ? 'px-2 py-1 rounded-full bg-green-600/30 text-green-200 font-medium' :
                    p.status === 'PENDING' ? 'px-2 py-1 rounded-full bg-yellow-600/30 text-yellow-200 font-medium' :
                    'px-2 py-1 rounded-full bg-red-600/30 text-red-200 font-medium'
                  }>
                    {p.status}
                  </span>
                  <span className="text-white/50">Created: {new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/70 backdrop-blur-md border border-green-500/30 rounded-xl p-8 w-full max-w-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
  <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>Payment Details</h2>
  <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white transition">
    <X className="w-6 h-6" />
  </button>
</div>
  <div className="bg-black/70 backdrop-blur-md rounded-xl p-6 border border-white/20 text-white">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div>
      <p className="font-medium text-white/70">ID</p>
      <p className="font-bold text-white">{selected.id}</p>
    </div>
    <div>
      <p className="font-medium text-white/70">User</p>
      <p className="font-bold text-white">{selected.user_name ?? selected.user_id}</p>
    </div>
    <div>
      <p className="font-medium text-white/70">Amount</p>
      <p><strong>Amount:</strong> {'$'}{selected.amount}</p>
    </div>
    <div>
      <p className="font-medium text-white/70">Mode</p>
      <span className="text-white/70 font-medium">{selected.razorpay_order_id ? 'Razorpay' : 'Manual'}</span>
    </div>
    <div>
      <p className="font-medium text-white/70">Status</p>
      <span className="text-white/70 font-medium">{selected.status}</span>
    </div>
    {selected.razorpay_order_id && (
      <div className="col-span-2">
        <p className="font-medium text-white/70">Razorpay Order ID</p>
        <p className="font-mono text-sm break-all text-white/70">{selected.razorpay_order_id}</p>
      </div>
    )}
    <div className="col-span-2">
      <p className="font-medium text-white/70">Created</p>
      <p className="text-sm text-white/60">{new Date(selected.created_at).toLocaleString()}</p>
    </div>
  </div>
</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
