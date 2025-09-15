"use client";
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function AdminHome() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-800">Manage posts, announcements, and gallery.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/admin/posts" className="rounded-lg border p-4 hover:shadow text-gray-900">Posts</Link>
        <Link href="/admin/announcements" className="rounded-lg border p-4 hover:shadow text-gray-900">Announcements</Link>
        <Link href="/admin/gallery" className="rounded-lg border p-4 hover:shadow text-gray-900">Gallery</Link>
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
