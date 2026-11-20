"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace('/admin/');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Bappuji</p>
      <h1 className="mb-6 mt-2 font-display text-3xl text-stone-900">Admin login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
        <button disabled={loading} className="w-full rounded-full bg-teal-800 px-3 py-2.5 font-semibold text-white hover:bg-teal-900 disabled:opacity-60">{loading? 'Signing in…' : 'Sign in'}</button>
      </form>
      {error && <p className="text-red-700 mt-3">{error}</p>}
      <p className="text-xs text-gray-700 mt-6">Use an email/password user created in Supabase Auth.</p>
    </div>
  );
}
