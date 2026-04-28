'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/app/providers';

export default function AuthPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, login, register, logout } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    riskPreference: 'Moderate',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
        setMessage('Signed in successfully.');
      } else {
        await register({
          username: form.username,
          email: form.email,
          password: form.password,
          riskPreference: form.riskPreference,
        });
        setMessage('Account created and signed in.');
      }
      router.push('/');
    } catch (error) {
      console.error(error);
      setMessage('Authentication failed. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <section className="rounded-[2rem] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 md:p-10 shadow-2xl shadow-cyan-950/20">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                <ShieldCheck size={14} />
                Secure Session Access
              </div>
              <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl">
                Login to your crypto command center.
              </h1>
              <p className="mt-4 max-w-xl text-slate-300">
                Your session unlocks live portfolio ownership, strategy tuning, and user-specific risk intelligence.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['Portfolio ownership', 'User-specific holdings and P/L'],
                  ['Risk profile', 'Conservative, moderate, or aggressive'],
                  ['Real-time data', 'Live prices, sentiment, and alerts'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-xs text-slate-400">{desc}</p>
                  </div>
                ))}
              </div>

              {isAuthenticated && user ? (
                <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-emerald-100">
                  <p className="font-semibold">You are currently signed in as {user.username}.</p>
                  <p className="mt-1 text-sm text-emerald-100/80">Risk preference: {user.riskPreference || 'Moderate'}</p>
                  <button
                    onClick={() => {
                      logout();
                      setMessage('Signed out.');
                    }}
                    className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-50 hover:bg-emerald-400/20"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </section>

            <section className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 p-1">
                <button
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${mode === 'login' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  onClick={() => setMode('login')}
                >
                  <span className="inline-flex items-center gap-2"><LogIn size={14} /> Login</span>
                </button>
                <button
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${mode === 'register' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  onClick={() => setMode('register')}
                >
                  <span className="inline-flex items-center gap-2"><UserPlus size={14} /> Register</span>
                </button>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Username</span>
                    <input
                      value={form.username}
                      onChange={(event) => setForm({ ...form, username: event.target.value })}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                      placeholder="Your display name"
                    />
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                    placeholder="••••••••"
                  />
                </label>

                {mode === 'register' && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Risk Preference</span>
                    <select
                      value={form.riskPreference}
                      onChange={(event) => setForm({ ...form, riskPreference: event.target.value })}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                    >
                      <option>Conservative</option>
                      <option>Moderate</option>
                      <option>Aggressive</option>
                    </select>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-900/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>

              {message && (
                <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-slate-200">
                  {message}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}