import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto max-w-5xl section-card p-10">
        <div className="mb-8">
          <p className="badge-primary">Admin dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Welcome, Admin</h1>
          <p className="mt-3 text-muted">Manage products, orders, and customer fulfillment from one place.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <Link href="/admin/products" className="rounded-[1.75rem] border border-slate-200 bg-surface p-6 text-left transition hover:border-primary">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Products</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">Manage catalogue</h2>
            <p className="mt-2 text-muted">Create, update, and publish fresh seafood offerings for customers.</p>
          </Link>
          <Link href="/admin/categories" className="rounded-[1.75rem] border border-slate-200 bg-surface p-6 text-left transition hover:border-primary">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Categories</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">Manage categories</h2>
            <p className="mt-2 text-muted">Add, reorder, and enable category collections for customer browsing.</p>
          </Link>
          <Link href="/admin/banners" className="rounded-[1.75rem] border border-slate-200 bg-surface p-6 text-left transition hover:border-primary">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Banners</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">Manage banners</h2>
            <p className="mt-2 text-muted">Update hero banners, promotions, and CTA placements on the home page.</p>
          </Link>
          <Link href="/admin/orders" className="rounded-[1.75rem] border border-slate-200 bg-surface p-6 text-left transition hover:border-primary">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Orders</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">Track orders</h2>
            <p className="mt-2 text-muted">Review and update order status from preparation through delivery.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
