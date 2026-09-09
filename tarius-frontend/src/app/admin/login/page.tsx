// Filename: src/app/admin/login/page.tsx

'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tarius-graphite)] flex items-center justify-center relative overflow-hidden font-body selection:bg-[var(--tarius-champagne)] selection:text-[var(--tarius-graphite)]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--tarius-champagne)]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--tarius-champagne)] mb-4 block">
            Admin Portal
          </span>
          <h1 className="font-display text-4xl text-white tracking-widest">
            TARIUS
          </h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <div className="relative group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-white text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors peer placeholder-transparent"
              placeholder="Email Address"
            />
            <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-champagne)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
              Email Address
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <div className="relative group">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-white text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors peer placeholder-transparent"
                placeholder="Password"
              />
              <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-champagne)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
                Password
              </label>
            </div>
            <div className="text-right">
              <Link href="/admin/forgot-password" className="text-[10px] tracking-widest text-stone-500 hover:text-[var(--tarius-champagne)] transition-colors">
                Forgot Passphrase?
              </Link>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-950/30 border border-red-500/30 p-4 text-center">
              <p className="text-xs text-red-400 tracking-wide">{errorMsg}</p>
            </div>
          )}

          <div className="flex flex-col gap-5 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full border border-[var(--tarius-champagne)] text-[var(--tarius-champagne)] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[var(--tarius-champagne)] hover:text-[var(--tarius-graphite)] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="text-center">
              <Link href="/admin/forgot-password" className="text-[10px] tracking-widest uppercase text-stone-400 hover:text-white transition-colors border-b border-stone-600 hover:border-white pb-1">
                Forgot Passphrase?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}