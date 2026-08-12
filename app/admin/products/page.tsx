import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-ocean-600">Admin catalog</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Manage seafood products</h1>
              <p className="mt-2 text-slate-600">Review inventory, product status, and update listings for customers.</p>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              View orders
            </Link>
          </div>
        </div>

        <section className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Product inventory</h2>
              <p className="mt-2 text-sm text-slate-500">Latest products published in the catalog.</p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">{products.length} items</div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-medium text-slate-600">Name</th>
                  <th className="px-6 py-4 font-medium text-slate-600">Category</th>
                  <th className="px-6 py-4 font-medium text-slate-600">Price/kg</th>
                  <th className="px-6 py-4 font-medium text-slate-600">Stock</th>
                  <th className="px-6 py-4 font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 text-slate-500">{product.category.name}</td>
                    <td className="px-6 py-4 text-slate-500">₹{product.pricePerKg}</td>
                    <td className="px-6 py-4 text-slate-500">{product.stockKg} kg</td>
                    <td className="px-6 py-4 text-slate-500">{product.status}</td>
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
