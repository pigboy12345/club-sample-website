"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const allowed = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  useEffect(() => {
    let active = true;
    async function check() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      // Ensure we exchange the code from magic-link redirects
      try {
        await supabase.auth.getSession();
      } catch {}
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      const user = data?.user || null;
      const userEmail = user?.email?.toLowerCase() ?? null;
      setEmail(userEmail);
      // If not logged in, go to login
      if (!user && pathname !== '/admin/login') {
        router.replace('/admin/login');
        setLoading(false);
        return;
      }
      // If logged in but not allowed, sign out and block
      if (userEmail && allowed.length > 0 && !allowed.includes(userEmail)) {
        await supabase.auth.signOut();
        router.replace('/admin/login');
        setLoading(false);
        return;
      }
      // Clean magic-link params after exchange
      try {
        if (typeof window !== 'undefined') {
          const sp = new URLSearchParams(window.location.search);
          if (sp.has('code') || sp.has('type')) {
            router.replace(pathname);
          }
        }
      } catch {}
      setLoading(false);
    }
    check();
    const { data: sub } = supabase?.auth.onAuthStateChange(() => check()) || { data: null };
    return () => {
      active = false;
      sub?.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-900">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 inset-x-0 h-14 bg-white border-b z-20">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4">
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin" className={`hover:text-teal-700 ${pathname === '/admin' ? 'text-teal-800 font-semibold' : 'text-gray-800'}`}>Dashboard</Link>
            <Link href="/admin/posts" className={`hover:text-teal-700 ${pathname?.startsWith('/admin/posts') ? 'text-teal-800 font-semibold' : 'text-gray-800'}`}>Posts</Link>
            <Link href="/admin/announcements" className={`hover:text-teal-700 ${pathname?.startsWith('/admin/announcements') ? 'text-teal-800 font-semibold' : 'text-gray-800'}`}>Announcements</Link>
            <Link href="/admin/gallery" className={`hover:text-teal-700 ${pathname?.startsWith('/admin/gallery') ? 'text-teal-800 font-semibold' : 'text-gray-800'}`}>Gallery</Link>
          </nav>
          <div className="flex items-center gap-3 text-sm text-gray-800">
            {email ? <span className="text-gray-900">{email}</span> : <span>Guest</span>}
            {email ? (
              <button
                className="px-3 py-1.5 rounded border hover:bg-gray-50"
                onClick={async () => { await supabase?.auth.signOut(); router.replace('/admin/login'); }}
              >Logout</button>
            ) : (
              <Link href="/admin/login" className="px-3 py-1.5 rounded border hover:bg-gray-50">Login</Link>
            )}
          </div>
        </div>
      </header>
      <main className="pt-16 max-w-6xl mx-auto p-4">{children}</main>
      {process.env.NODE_ENV !== 'production' && search?.get('debug') === '1' && (
        <div className="fixed bottom-2 right-2 text-xs bg-white/90 border rounded p-2 shadow">
          <div><b>Debug</b></div>
          <div>path: {pathname}</div>
          <div>email: {email || 'none'}</div>
          <div>allowlist: {(process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toString()}</div>
          <div>supabase: {supabase ? 'ok' : 'missing'}</div>
        </div>
      )}
    </div>
  );
}
