'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Banner = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  ctaLabel: string;
  ctaDestination: string | null;
  imageUrl: string;
  enabled: boolean;
  displayOrder: number;
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaDestination, setCtaDestination] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchBanners = async () => {
    const response = await fetch('/api/admin/banners');
    const data = await response.json();
    if (response.ok) {
      setBanners(data.banners);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const sortedBanners = useMemo(() => [...banners].sort((a, b) => a.displayOrder - b.displayOrder), [banners]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    const response = await fetch('/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, subtitle, ctaLabel, ctaDestination, imageUrl, displayOrder, enabled })
    });

    const data = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setError(data.error || 'Unable to create banner');
      return;
    }

    setTitle('');
    setSlug('');
    setSubtitle('');
    setCtaLabel('');
    setCtaDestination('');
    setImageUrl('');
    setDisplayOrder(0);
    setEnabled(true);
    setBanners((current) => [...current, data.banner]);
  };

  const handleToggle = async (banner: Banner) => {
    const response = await fetch(`/api/admin/banners/${banner.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !banner.enabled })
    });
    const data = await response.json();
    if (response.ok) {
      setBanners((current) => current.map((item) => (item.id === data.banner.id ? data.banner : item)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) {
      return;
    }
    const response = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setBanners((current) => current.filter((item) => item.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-ocean-600">Admin banners</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Manage homepage banners</h1>
              <p className="mt-2 text-slate-600">Control promotional banners and hero CTA placements for customers.</p>
            </div>
            <Link href="/admin" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Back to dashboard
            </Link>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_0.8fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Banner list</h2>
                <p className="mt-2 text-sm text-slate-500">Current banners shown in the marketplace homepage carousel.</p>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">{banners.length} banners</div>
            </div>

            <div className="space-y-4">
              {sortedBanners.map((banner) => (
                <div key={banner.id} className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{banner.title}</p>
                    <p className="text-sm text-slate-500">Slug: {banner.slug}</p>
                    <p className="text-sm text-slate-500">Order: {banner.displayOrder}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={() => handleToggle(banner)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
                      {banner.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button type="button" onClick={() => handleDelete(banner.id)} className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-100">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-950">Add new banner</h2>
            <p className="mt-2 text-sm text-slate-500">Create a fresh homepage banner promotion.</p>

            <form className="mt-6 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Title</label>
                <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Slug</label>
                <input value={slug} onChange={(event) => setSlug(event.target.value)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" placeholder="optional" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Subtitle</label>
                <input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" placeholder="optional" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">CTA label</label>
                <input value={ctaLabel} onChange={(event) => setCtaLabel(event.target.value)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">CTA destination</label>
                <input value={ctaDestination} onChange={(event) => setCtaDestination(event.target.value)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" placeholder="optional" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Image URL</label>
                <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-900">Display order</label>
                  <input type="number" value={displayOrder} onChange={(event) => setDisplayOrder(Number(event.target.value))} className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" />
                </div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                    <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
                    Enabled
                  </label>
                </div>
              </div>

              {error ? <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

              <button type="submit" disabled={isSaving} className="btn-primary w-full">
                {isSaving ? 'Saving…' : 'Create banner'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
