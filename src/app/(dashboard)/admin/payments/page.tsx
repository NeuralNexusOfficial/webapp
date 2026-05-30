'use server';

import { getAllPayments } from '@/app/actions/payments';
import { Payment } from '@/types';
import PaymentsList from '@/app/(dashboard)/admin/payments/PaymentsList';

/**
 * Admin Payments Page - server component that fetches payments and renders client list.
 */
export default async function PaymentsPage() {
  const result = await getAllPayments();
  const payments: Payment[] = result.success ? (result.data as Payment[]) : [];

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>Payments</h1>
      <PaymentsList payments={payments} />
    </div>
  );
}
