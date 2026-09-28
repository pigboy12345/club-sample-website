"use client";
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function AdminHome() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-stone-900 sm:text-4xl">Admin dashboard</h1>
      <p className="text-stone-600">Manage posts, announcements, and gallery.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/posts" className="rounded-3xl bg-white p-6 text-stone-900 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="font-display text-2xl">Posts</span>
          <p className="mt-2 text-sm text-stone-600">Write and update club stories.</p>
        </Link>
        <Link href="/admin/announcements" className="rounded-3xl bg-white p-6 text-stone-900 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="font-display text-2xl">Announcements</span>
          <p className="mt-2 text-sm text-stone-600">Pin notices and upcoming events.</p>
        </Link>
        <Link href="/admin/gallery" className="rounded-3xl bg-white p-6 text-stone-900 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="font-display text-2xl">Gallery</span>
          <p className="mt-2 text-sm text-stone-600">Add photographs from club life.</p>
        </Link>
      </div>
      <div>
        <button
          className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded border text-gray-900 hover:bg-gray-50"
          onClick={async () => {
            // Only sign out; admin layout will redirect via auth listener
            await supabase?.auth.signOut();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
