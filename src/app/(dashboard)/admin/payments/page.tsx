'use server';

import { getAllPayments } from '@/app/actions/payments';
import { Payment } from '@/types';
import PaymentsList from '@/app/(dashboard)/admin/payments/PaymentsList';
import Sidebar from '@/components/dashboard/sidebar';

/**
 * Admin Payments Page - server component that fetches payments and renders client list.
 */
export default async function PaymentsPage() {
  const result = await getAllPayments();
  const payments: Payment[] = result.success ? (result.data as Payment[]) : [];

  return (
    <main className="min-h-screen flex w-full max-w-[100vw] overflow-x-hidden bg-black">
      <Sidebar />
      <section className="flex-1 min-w-0 max-w-full overflow-x-hidden overflow-y-auto px-4 pt-16 pb-6 sm:px-6 md:px-10 md:pt-10 md:pb-10">
        <div className="py-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>Payments</h1>
          <PaymentsList payments={payments} />
        </div>
      </section>
    </main>
  );
}
