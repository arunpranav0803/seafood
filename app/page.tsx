import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-10 section-card p-10 sm:p-12">
          <div className="space-y-6 max-w-3xl">
            <p className="badge-primary">Fresh Ocean Premium Seafood</p>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">Fresh catch, delivered with coastal care.</h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">Browse premium seafood from our live marketplace and order the freshest catch with trusted delivery to your door.</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/customer" className="btn-primary">
                Explore today&apos;s catch
              </Link>
              <Link href="/auth/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/auth/signup" className="btn-secondary">
                Sign up
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <article className="section-card bg-surface-soft p-6">
              <h2 className="text-xl font-semibold text-slate-950">Today&apos;s fresh catch</h2>
              <p className="mt-3 text-muted">Premium coastal seafood, curated by fresh partners and verified for quality every day.</p>
            </article>
            <article className="section-card bg-accent-soft p-6">
              <h2 className="text-xl font-semibold text-slate-950">Fast, transparent ordering</h2>
              <p className="mt-3 text-muted">Browse live catalog updates, secure checkout, and real-time order progress from dock to door.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto mt-16 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="section-card p-8">
            <h2 className="text-3xl font-semibold text-slate-950">How ordering works</h2>
            <div className="mt-8 space-y-6">
              {[
                { title: 'Browse today’s catch', description: 'Explore premium seafood categories, live pricing, and freshness details.' },
                { title: 'Add to cart', description: 'Choose your quantity and lock in the freshest catch instantly.' },
                { title: 'Track in real time', description: 'Follow your order status and receive updates while it’s on the way.' }
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-surface p-5">
                  <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center rounded-[2rem] bg-primary p-8 text-white shadow-soft">
            <div className="space-y-4 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-accent-soft">Premium seafood</p>
              <h3 className="text-3xl font-semibold">Coastal freshness every day</h3>
              <p className="text-slate-100">Every catch is prepared to order, with daily inventory and transparent sourcing from trusted coastal partners.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
