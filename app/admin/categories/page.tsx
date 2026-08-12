'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  enabled: boolean;
  displayOrder: number;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    const response = await fetch('/api/admin/categories');
    const data = await response.json();
    if (response.ok) {
      setCategories(data.categories);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.displayOrder - b.displayOrder),
    [categories]
  );

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, imageUrl, displayOrder, enabled })
    });

    const data = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setError(data.error || 'Unable to create category');
      return;
    }

    setName('');
    setSlug('');
    setImageUrl('');
    setDisplayOrder(0);
    setEnabled(true);
    setCategories((current) => [...current, data.category]);
  };

  const handleToggle = async (category: Category) => {
    const response = await fetch(`/api/admin/categories/${category.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !category.enabled })
    });
    const data = await response.json();
    if (response.ok) {
      setCategories((current) => current.map((item) => (item.id === data.category.id ? data.category : item)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) {
      return;
    }
    const response = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setCategories((current) => current.filter((item) => item.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-ocean-600">Admin categories</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Manage category catalog</h1>
              <p className="mt-2 text-slate-600">Create, enable, or archive product categories for your seafood marketplace.</p>
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
                <h2 className="text-xl font-semibold text-slate-950">Category list</h2>
                <p className="mt-2 text-sm text-slate-500">Current categories available for customers.</p>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">{categories.length} categories</div>
            </div>

            <div className="space-y-4">
              {sortedCategories.map((category) => (
                <div key={category.id} className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{category.name}</p>
                    <p className="text-sm text-slate-500">Slug: {category.slug}</p>
                    <p className="text-sm text-slate-500">Order: {category.displayOrder}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={() => handleToggle(category)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
                      {category.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button type="button" onClick={() => handleDelete(category.id)} className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-100">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-950">Add new category</h2>
            <p className="mt-2 text-sm text-slate-500">Create a fresh category for your product catalog.</p>

            <form className="mt-6 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Name</label>
                <input value={name} onChange={(event) => setName(event.target.value)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Slug</label>
                <input value={slug} onChange={(event) => setSlug(event.target.value)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" placeholder="optional" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Image URL</label>
                <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft" placeholder="https://..." />
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
                {isSaving ? 'Saving…' : 'Create category'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
