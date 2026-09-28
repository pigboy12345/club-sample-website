
"use client";
import React, { useEffect, useState } from 'react';
import { Bell, Loader2, Pin } from 'lucide-react';
import Link from 'next/link';
import { announcements as staticAnnouncements } from '../data/announcements';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import type { Announcement } from '../../types';

const NotificationBell = ({ tone = "dark" }: { tone?: "dark" | "light" }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const truncate = (str: string, numWords: number) => str.split(" ").slice(0, numWords).join(" ");

  const panelOpen = isHovering || isOpen;

  // Fetch latest announcements when the panel opens
  useEffect(() => {
    if (!panelOpen) return;
    if (items.length > 0 || loading) return; // avoid refetch spam
    async function load() {
      if (!supabase) {
        // fallback to static if supabase not configured
        setItems(staticAnnouncements.slice(0, 10).map(a => ({
          id: a.id,
          title: a.title,
          content: a.content,
          date: a.date,
          time: a.time,
          type: a.type,
          priority: a.priority as any,
          is_pinned: a.isPinned
        })));
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('date', { ascending: false })
          .limit(10);
        if (error) throw error;
        setItems((data || []) as Announcement[]);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [panelOpen, items.length, loading]);

  const sorter = (a: Announcement, b: Announcement) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  };

  // Optional realtime subscription to keep list fresh while open
  useEffect(() => {
    if (!panelOpen || !supabase) return;
    type Payload = {
      eventType: 'INSERT' | 'UPDATE' | 'DELETE';
      new: any;
      old: any;
    };
    const channel = supabase
      .channel('announcements-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, (payload: Payload) => {
        setItems(prev => {
          switch (payload.eventType) {
            case 'INSERT':
              return [payload.new as Announcement, ...prev].sort(sorter).slice(0, 10);
            case 'UPDATE':
              return prev.map(i => i.id === payload.new.id ? (payload.new as Announcement) : i).sort(sorter).slice(0, 10);
            case 'DELETE':
              return prev.filter(i => i.id !== payload.old.id);
            default:
              return prev;
          }
        });
      })
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [panelOpen]);

  if (pathname === '/announcements') {
    return null;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`relative inline-flex items-center justify-center rounded-full p-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
          tone === "light"
            ? "text-white hover:bg-white/10"
            : "text-stone-700 hover:bg-teal-50"
        }`}
        aria-expanded={panelOpen}
        aria-label="Announcements"
      >
        <Bell className="h-5 w-5" />
      </button>
      {panelOpen && (
        <div className="absolute right-0 z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-stone-200 bg-white shadow-xl">
          <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-teal-600" />}
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {error && (
              <div className="p-4 text-sm text-red-600">{error}</div>
            )}
            {!error && !loading && items.length === 0 && (
              <div className="p-4 text-sm text-gray-600">No announcements.</div>
            )}
            {!error && items
              .slice() // shallow copy
              .sort(sorter)
              .slice(0, 5)
              .map(ann => (
                <div key={ann.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-2">
                    {ann.is_pinned && (
                      <Pin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 leading-snug">
                        {truncate(ann.title, 8)}{ann.title.split(' ').length > 8 && '…'}
                      </p>
                      <p className="text-sm text-gray-600 my-1 line-clamp-2">
                        {truncate(ann.content, 14)}{ann.content.split(' ').length > 14 && '…'}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{ann.date}</span>
                        <span>{ann.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="p-2 bg-gray-50 text-center">
            <Link href="/announcements" className="text-sm text-teal-600 hover:text-teal-800 font-semibold">
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
