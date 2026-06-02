import Sidebar from '@/components/dashboard/sidebar';
import { getPaymentDetailsForSubmission } from '@/app/actions/admin';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CreditCard, ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSubmissionPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const res = await getPaymentDetailsForSubmission(resolvedParams.id);

  if (!res.success) {
    return notFound();
  }

  const { submission, payments } = res.data;

  // Compute stats
  const successfulPayments = payments.filter(p => p.status === 'SUCCESS');
  const isPaid = successfulPayments.length > 0;

  return (
    <main className="min-h-screen flex w-full max-w-[100vw] overflow-x-hidden bg-black">
      <Sidebar />
      <section className="flex-1 min-w-0 max-w-full overflow-x-hidden overflow-y-auto px-4 pt-16 pb-6 sm:px-6 md:px-10 md:pt-10 md:pb-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href={`/admin/submissions/${submission.id}`} 
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/40 hover:text-white transition duration-200"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Submission
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/30 mb-2">
                Team: {submission.team_name}
              </p>
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 break-words"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Payment Ledger
              </h1>
              <p className="text-sm text-white/50 max-w-2xl">
                Transactions and Razorpay order history for team members of project <span className="text-white font-semibold italic">"{submission.title}"</span>.
              </p>
            </div>

            {/* Overall Registration Status Badge */}
            <div className="shrink-0">
              {isPaid ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 animate-pulse" /> Fully Registered
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-sm font-semibold">
                  <Clock className="w-4 h-4 animate-pulse" /> Payment Pending
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-cyber p-5 flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest text-white/30">Total Attempts</span>
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                {payments.length}
              </span>
            </div>
            
            <div className="card-cyber p-5 flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest text-white/30">Successful Payments</span>
              <span className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-display)' }}>
                {successfulPayments.length}
              </span>
            </div>

            <div className="card-cyber p-5 flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest text-white/30">Selected Track</span>
              <span className="text-2xl font-bold text-white uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                {submission.track}
              </span>
            </div>

            <div className="card-cyber p-5 flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest text-white/30">Total Value (USD)</span>
              <span className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'var(--font-display)' }}>
                ${successfulPayments.reduce((acc, curr) => acc + curr.amount, 0)}
              </span>
            </div>
          </div>

          {/* Payments Table */}
          <div className="card-cyber p-6 overflow-hidden">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <CreditCard className="w-5 h-5 text-white/40" />
              <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Transaction History
              </h2>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No payment records found for this team.</p>
                <p className="text-white/20 text-xs mt-1">If members pay via Dashboard, their transactions will populate here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full -mx-6 px-6">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                      <th className="py-4 font-semibold">User</th>
                      <th className="py-4 font-semibold">Amount</th>
                      <th className="py-4 font-semibold">Razorpay Order ID</th>
                      <th className="py-4 font-semibold">Razorpay Payment ID</th>
                      <th className="py-4 font-semibold">Status</th>
                      <th className="py-4 font-semibold">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {payments.map((p) => {
                      return (
                        <tr key={p.id} className="hover:bg-white/[0.01] transition-colors duration-150">
                          {/* User Payer */}
                          <td className="py-4 pr-4">
                            <div className="font-medium text-white">
                              {p.user.full_name || 'Unnamed Member'}
                            </div>
                            <div className="text-xs text-white/40 font-sans mt-0.5">
                              {p.user.email}
                            </div>
                          </td>

                          {/* Amount (USD Only) */}
                          <td className="py-4 font-mono font-semibold text-white">
                            ${p.amount}
                          </td>

                          {/* Order ID */}
                          <td className="py-4 font-mono text-xs text-white/50 select-all pr-4">
                            {p.razorpay_order_id}
                          </td>

                          {/* Payment ID */}
                          <td className="py-4 font-mono text-xs text-white/50 select-all pr-4">
                            {p.razorpay_payment_id || <span className="text-white/20 font-sans">-</span>}
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 pr-4">
                            {p.status === 'SUCCESS' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
                              </span>
                            )}
                            {p.status === 'FAILED' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400">
                                <XCircle className="w-3.5 h-3.5" /> FAILED
                              </span>
                            )}
                            {p.status === 'INITIATED' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                <Clock className="w-3.5 h-3.5" /> INITIATED
                              </span>
                            )}
                          </td>

                          {/* Date/Time */}
                          <td className="py-4 text-white/40 text-xs whitespace-nowrap">
                            {new Date(p.created_at).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </section>
    </main>
  );
}
