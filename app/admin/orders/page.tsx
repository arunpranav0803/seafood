import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true }
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-ocean-600">Admin orders</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Order management</h1>
              <p className="mt-2 text-slate-600">Review current orders and monitor customer demand.</p>
            </div>
            <Link href="/admin/products" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              View products
            </Link>
          </div>
        </div>

        <section className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Recent orders</h2>
              <p className="mt-2 text-sm text-slate-500">Latest customer orders and status overview.</p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">{orders.length} orders</div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-medium text-slate-600">Order</th>
                  <th className="px-6 py-4 font-medium text-slate-600">Customer</th>
                  <th className="px-6 py-4 font-medium text-slate-600">Total</th>
                  <th className="px-6 py-4 font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-slate-500">{order.customer?.userId ?? 'Unknown'}</td>
                    <td className="px-6 py-4 text-slate-500">₹{order.totalAmount}</td>
                    <td className="px-6 py-4 text-slate-500">{order.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
