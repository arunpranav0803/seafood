'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error || 'Unable to sign up');
      return;
    }

    setSuccess('Account created successfully. Redirecting…');
    setTimeout(() => router.push('/customer'), 900);
  };

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-3xl section-card p-10">
        <div className="mb-8">
          <p className="badge-primary">Create account</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Sign up as a customer</h1>
          <p className="mt-3 text-muted">Register with your email and password to start ordering fresh seafood.</p>
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
          {success ? <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="mt-8 rounded-[1.75rem] bg-surface-soft p-6 text-sm text-muted">
          <p>
            Already have an account? <Link href="/auth/login" className="font-semibold text-primary hover:text-primary-dark">Sign in</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
