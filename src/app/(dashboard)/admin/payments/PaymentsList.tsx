'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign } from 'lucide-react';
import { Payment } from '@/types';
import { formatCurrency, isValidCurrency } from '@/lib/currency';

// Extend payment with optional fields from server join
type PaymentItem = Payment & {
  user_name?: string | null;
  team_name?: string;
  registration_type?: 'Solo' | 'Team';
};

/**
 * Client component that displays a searchable and filterable list of payments.
 * Shows the paid user's full name (if available) and allows filtering by status.
 * Clicking a payment opens a detail modal.
 */
export default function PaymentsList({ payments }: { payments: PaymentItem[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' means all
  const [selected, setSelected] = useState<PaymentItem | null>(null);

  // Date-based filtering state
  const [dateFilter, setDateFilter] = useState<'7days' | '30days' | 'custom' | 'entire'>('entire');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // 1. Filter payments by query, status, and date
  const filtered = payments.filter((p) => {
    // Search query matching
    const query = search.trim().toLowerCase();
    const matchesSearch = !query ||
      p.id.toLowerCase().includes(query) ||
      (p.user_id?.toLowerCase().includes(query) ?? false) ||
      (p.user_name?.toLowerCase().includes(query) ?? false) ||
      (p.razorpay_order_id?.toLowerCase().includes(query) ?? false);

    // Status matching (treat INITIATED as PENDING for filtering convenience)
    const matchesStatus = !statusFilter ||
      (statusFilter === 'PENDING'
        ? (p.status === 'PENDING' || p.status === 'INITIATED')
        : p.status === statusFilter);

    // Date range matching
    const paymentDate = new Date(p.created_at);
    let matchesDate = true;
    const now = new Date();

    if (dateFilter === '7days') {
      const limit = new Date();
      limit.setDate(now.getDate() - 7);
      limit.setHours(0, 0, 0, 0);
      matchesDate = paymentDate >= limit;
    } else if (dateFilter === '30days') {
      const limit = new Date();
      limit.setDate(now.getDate() - 30);
      limit.setHours(0, 0, 0, 0);
      matchesDate = paymentDate >= limit;
    } else if (dateFilter === 'custom') {
      if (customStartDate) {
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && paymentDate >= start;
      }
      if (customEndDate) {
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && paymentDate <= end;
      }
    } else if (dateFilter === 'entire') {
      // Entire timeline includes all payments
      matchesDate = true;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // 2. Calculate dynamic statistics based on current filtered set
  const stats = filtered.reduce(
    (acc, p) => {
      // Total received counts only SUCCESS payments (properly parsed as number)
      if (p.status === 'SUCCESS') {
        const currency = (p.currency || 'INR').toUpperCase();
        const amt = Number(p.amount) || 0;
        acc.totalReceived[currency] = (acc.totalReceived[currency] || 0) + amt;
      }

      // Count by status (collapse INITIATED into PENDING for display metrics)
      const statusKey = p.status === 'INITIATED' ? 'PENDING' : p.status;
      acc.statusCounts[statusKey] = (acc.statusCounts[statusKey] || 0) + 1;

      // Count by track
      const track = p.track || 'Unassigned';
      acc.trackCounts[track] = (acc.trackCounts[track] || 0) + 1;

      return acc;
    },
    {
      totalReceived: {} as Record<string, number>,
      statusCounts: { SUCCESS: 0, PENDING: 0, FAILED: 0 } as Record<string, number>,
      trackCounts: {} as Record<string, number>,
    }
  );

  return (
    <div className="w-full space-y-6">
      {/* ── Top Metric and Filter controls side-by-side ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
        {/* Total Payments Received Card */}
        <div className="card-cyber p-6 flex items-center gap-4 border-green-500/25 bg-black/60 backdrop-blur-md w-full lg:w-96 shrink-0 h-auto">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-0.5">Total Payments Received</p>
            {Object.keys(stats.totalReceived).length === 0 ? (
              <h3 className="text-3xl font-extrabold text-green-400 leading-tight font-display" style={{ fontFamily: 'var(--font-display)' }}>
                $0.00
              </h3>
            ) : (
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                {Object.entries(stats.totalReceived).map(([currency, total]) => (
                  <h3 key={currency} className="text-3xl font-extrabold text-green-400 leading-tight font-display" style={{ fontFamily: 'var(--font-display)' }}>
                    {formatCurrency(total, currency)}
                  </h3>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-zinc-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-5 flex-1 min-w-0 w-full h-auto flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Filters</h4>
            {(statusFilter || dateFilter !== 'entire') && (
              <button
                onClick={() => {
                  setStatusFilter('');
                  setDateFilter('entire');
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 font-semibold transition duration-150 animate-in fade-in"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full items-stretch sm:items-end">
            {/* Status Filter Dropdown */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="statusFilter" className="text-white/30 text-[10px] font-semibold uppercase tracking-wider">Status</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-nn text-xs w-full py-2 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            {/* Timeline Filter Dropdown */}
            <div className="flex flex-col gap-1.5 shrink-0 sm:w-1/2">
              <label htmlFor="dateFilter" className="text-white/30 text-[10px] font-semibold uppercase tracking-wider">Timeline</label>
              <select
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="input-nn text-xs w-full py-2 cursor-pointer"
              >
                <option value="entire">Entire Timeline</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Custom Date Pickers */}
          <AnimatePresence>
            {dateFilter === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden w-full flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/5"
              >
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="startDate" className="text-[10px] text-white/40 font-medium">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="input-nn bg-black/60 border-white/10 text-white text-xs py-1.5 w-full"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="endDate" className="text-[10px] text-white/40 font-medium">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="input-nn bg-black/60 border-white/10 text-white text-xs py-1.5 w-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Search Input (Full Width Bar) ── */}
      <div className="relative group w-full">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition duration-300 pointer-events-none" />
        <div className="relative flex items-center">
          <input
            id="search-bar"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments by ID, user, name..."
            className="input-nn pl-5 pr-12 w-full transition-all duration-200 text-sm py-3 bg-black/60"
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

      {/* ── Payments Grid List ── */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-cyber p-8 text-center col-span-full"
            >
              <p className="text-white/70 text-lg font-bold">No payments found</p>
              {(search || statusFilter || dateFilter !== 'entire') && (
                <p className="text-white/30 text-sm mt-1">No results match your active filters</p>
              )}
            </motion.div>
          ) : (
            filtered.map((p) => {
              const hasCurrency = isValidCurrency(p.currency);
              const isInvalidCurrency = p.currency && !hasCurrency;

              const isSuccess = p.status === 'SUCCESS';
              const isPending = p.status === 'PENDING' || p.status === 'INITIATED';
              const isFailed = p.status === 'FAILED';

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-black/70 backdrop-blur-md border rounded-xl p-6 cursor-pointer overflow-hidden transition-all duration-200 ${
                    selected?.id === p.id
                      ? 'border-green-500/70 shadow-xl ring-2 ring-green-500/50'
                      : isSuccess
                        ? 'border-green-500/30 ring-1 ring-green-500/20'
                        : isPending
                          ? 'border-yellow-500/30 ring-1 ring-yellow-500/20'
                          : 'border-red-500/30 ring-1 ring-red-500/20'
                  }`}
                  onClick={() => setSelected(p)}
                  title={isInvalidCurrency ? `Unknown currency: ${p.currency}` : ''}
                >
                  {/* Amount - prominent at top with dynamic currency */}
                  <div className="mb-4">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Amount</p>
                    <div className="flex items-center gap-2">
                      <h2 className="text-3xl font-extrabold text-green-400" style={{ fontFamily: 'var(--font-display)' }}>
                        {formatCurrency(p.amount, p.currency)}
                      </h2>
                      {isInvalidCurrency && (
                        <span
                          className="text-xs px-2 py-1 rounded bg-yellow-600/30 text-yellow-200"
                          title={`Invalid currency: ${p.currency}`}
                        >
                          ⚠️
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment ID */}
                  <div className="mb-3">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Payment ID</p>
                    <p className="text-sm font-mono text-white/80 truncate">{p.id}</p>
                  </div>

                  {/* Paid By */}
                  <div className="mb-4">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Paid By</p>
                    <p className="text-base font-semibold text-white truncate" style={{ fontFamily: 'var(--font-display)' }}>
                      {p.user_name ?? p.user_id}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.registration_type === 'Team' ? 'bg-purple-600/30 text-purple-200' : 'bg-amber-600/30 text-amber-200'}`}>
                      {p.registration_type ?? 'Solo'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-600/30 text-blue-200 text-xs font-medium">
                      {p.razorpay_order_id
                        ? p.razorpay_order_id.toLowerCase().includes('upi')
                          ? 'UPI'
                          : 'Debit Card'
                        : 'Manual'}
                    </span>
                    <span className={
                      isSuccess ? 'px-2.5 py-1 rounded-full bg-green-600/30 text-green-200 text-xs font-medium' :
                      isPending ? 'px-2.5 py-1 rounded-full bg-yellow-600/30 text-yellow-200 text-xs font-medium' :
                      'px-2.5 py-1 rounded-full bg-red-600/30 text-red-200 text-xs font-medium'
                    }>
                      {p.status === 'INITIATED' ? 'PENDING' : p.status}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/70 backdrop-blur-md border border-green-500/30 rounded-xl p-4 md:p-8 w-full max-w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>Payment Details</h2>
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div>
                  <p className="font-medium text-white/70">ID</p>
                  <p className="font-bold text-white break-all">{selected.id}</p>
                </div>
                <div>
                  <p className="font-medium text-white/70">User</p>
                  <p className="font-bold text-white break-all">{selected.user_name ?? selected.user_id}</p>
                </div>
                <div>
                  <p className="font-medium text-white/70">Registration Type</p>
                  <p className="font-bold text-white">{selected.registration_type ?? 'Solo'}</p>
                </div>
                <div>
                  <p className="font-medium text-white/70">Team Name</p>
                  <p className="font-bold text-white">{selected.team_name ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-white/70">Amount</p>
                  <p className="font-bold text-white">{formatCurrency(selected.amount, selected.currency)}</p>
                </div>
                <div>
                  <p className="font-medium text-white/70">Currency</p>
                  <p className="font-bold text-white">{selected.currency || 'Not set'}</p>
                </div>
                <div>
                  <p className="font-medium text-white/70">Mode</p>
                  <p className="text-white/70 font-medium">{selected.razorpay_order_id ? 'Razorpay' : 'Manual'}</p>
                </div>
                <div>
                  <p className="font-medium text-white/70">Status</p>
                  <p className="text-white/70 font-medium">
                    {selected.status === 'INITIATED' ? 'PENDING' : selected.status}
                  </p>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
