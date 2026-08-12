'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error || 'Unable to login');
      return;
    }

    router.push(data.user.role === 'ADMIN' ? '/admin' : '/customer');
  };

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-3xl section-card p-10">
        <div className="mb-8">
          <p className="badge-primary">Welcome back</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Login to your account</h1>
          <p className="mt-3 text-muted">Use your email and password to sign in as a customer or admin.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-900">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-surface px-5 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
              required
            />
          </div>

          {error ? <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 rounded-[1.75rem] bg-surface-soft p-6 text-sm text-muted">
          <p>
            First time here? <Link href="/auth/signup" className="font-semibold text-primary hover:text-primary-dark">Create a customer account</Link>.
          </p>
          <p className="mt-3 text-muted">Admin users can log in with their admin credentials and will be redirected to the admin dashboard.</p>
        </div>
      </div>
    </main>
  );
}
