"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/admin' : undefined,
          shouldCreateUser: false,
        },
      });
      if (error) throw error;
      setMessage('Check your email for the login link.');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Admin Login (Magic Link)</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <button disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded px-3 py-2">{loading? 'Please wait…' : 'Send login link'}</button>
      </form>
      {message && <p className="text-green-700 mt-3">{message}</p>}
      {error && <p className="text-red-700 mt-3">{error}</p>}
      <p className="text-xs text-gray-700 mt-6">Sign-ups are disabled. Only approved accounts can log in.</p>
    </div>
  );
}
