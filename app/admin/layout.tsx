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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-900">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
                onClick={async () => {
                  // Only sign out; auth listener will handle navigation to login
                  await supabase?.auth.signOut();
                }}
              >Logout</button>
            ) : (
              <Link href="/admin/login" className="px-3 py-1.5 rounded border hover:bg-gray-50">Login</Link>
            )}
          </div>
        </div>
      </header>
      <main className="pt-16 max-w-6xl mx-auto p-4">{children}</main>
      <Suspense fallback={null}>
        <DebugPanel pathname={pathname} email={email} />
      </Suspense>
    </div>
  );
}
