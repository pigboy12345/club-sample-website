"use client";
import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

function DebugPanel({ pathname, email }: { pathname: string | null; email: string | null }) {
  // This hook requires being inside a Suspense boundary in React 19/Next 15
  const search = useSearchParams();
  if (process.env.NODE_ENV !== 'production' && search?.get('debug') === '1') {
    return (
      <div className="fixed bottom-2 right-2 text-xs bg-white/90 border rounded p-2 shadow">
        <div><b>Debug</b></div>
        <div>path: {pathname ?? ''}</div>
        <div>email: {email || 'none'}</div>
        <div>allowlist: {(process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toString()}</div>
        <div>supabase: {supabase ? 'ok' : 'missing'}</div>
      </div>
    );
  }
  return null;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const allowed = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  useEffect(() => {
    let active = true;
    async function getReadyUser(retries = 3, delayMs = 150) {
      for (let i = 0; i < retries; i++) {
        await supabase.auth.getSession();
        const { data } = await supabase.auth.getUser();
        const user = data?.user || null;
        if (user) return user;
        if (i < retries - 1) await new Promise((r) => setTimeout(r, delayMs));
      }
      const { data } = await supabase.auth.getUser();
      return data?.user || null;
    }
    async function check() {
      if (!supabase) {
        setLoading(false);
        return;
      }
  // Warm session and retry briefly to avoid false negatives on refresh
  const user = await getReadyUser();
  if (!active) return;
      const userEmail = user?.email?.toLowerCase() ?? null;
      setEmail(userEmail);
      // If not logged in, go to login
      if (!user && pathname !== '/admin/login') {
        router.replace('/admin/login');
        setLoading(false);
        return;
      }
      // If logged in and trying to view the login page, send to posts
      if (user && pathname === '/admin/login') {
        router.replace('/admin/');
        setLoading(false);
        return;
      }
      // If logged in but not allowed, sign out and block
      if (userEmail && allowed.length > 0 && !allowed.includes(userEmail)) {
        await supabase.auth.signOut();
        // onAuthStateChange handler below will handle redirect after sign-out
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    check();
    // Respond immediately to auth changes to avoid redirect races
    const { data: sub } =
      supabase?.auth.onAuthStateChange(async (event: string) => {
        if (event === 'SIGNED_OUT') {
          setEmail(null);
          // Ensure we land on login page after logout
          if (pathname !== '/admin/login') {
            router.replace('/admin/login');
          } else {
            // If already on login, just refresh state
            router.refresh();
          }
          return;
        }
        if (event === 'SIGNED_IN') {
          // After successful sign in, avoid staying on login page
          if (pathname === '/admin/login') {
            router.replace('/admin/');
            return;
          }
        }
        // Fallback to guard check on other events (TOKEN_REFRESHED, USER_UPDATED, etc.)
        check();
      }) || { data: null };
    return () => {
      active = false;
      sub?.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee] text-stone-900">Loading…</div>;

  const linkClass = (active: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 transition ${active ? 'bg-teal-800 text-white' : 'text-stone-700 hover:bg-teal-50'}`;

  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-14 items-center justify-between gap-3">
            <p className="font-display text-lg text-stone-900">Bappuji admin</p>
            <div className="flex shrink-0 items-center gap-2 text-sm text-stone-800">
              {email ? <span className="hidden max-w-[12rem] truncate sm:inline">{email}</span> : <span className="text-stone-500">Guest</span>}
              {email ? (
                <button
                  className="rounded-full border border-stone-300 px-3 py-1.5 hover:bg-stone-50"
                  onClick={async () => {
                    await supabase?.auth.signOut();
                  }}
                >Logout</button>
              ) : (
                <Link href="/admin/login" className="rounded-full border border-stone-300 px-3 py-1.5 hover:bg-stone-50">Login</Link>
              )}
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-3 text-sm scrollbar-hide">
            <Link href="/admin" className={linkClass(pathname === '/admin')}>Dashboard</Link>
            <Link href="/admin/posts" className={linkClass(!!pathname?.startsWith('/admin/posts'))}>Posts</Link>
            <Link href="/admin/announcements" className={linkClass(!!pathname?.startsWith('/admin/announcements'))}>Announcements</Link>
            <Link href="/admin/gallery" className={linkClass(!!pathname?.startsWith('/admin/gallery'))}>Gallery</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-32">{children}</main>
      <Suspense fallback={null}>
        <DebugPanel pathname={pathname} email={email} />
      </Suspense>
    </div>
  );
}
