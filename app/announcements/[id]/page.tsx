"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bell, Calendar, Clock, Pin } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { announcements as staticAnnouncements } from '../../data/announcements';
import type { Announcement } from '../../../types';

function getStaticAnnouncement(id: number): Announcement | null {
  const announcement = staticAnnouncements.find((item) => item.id === id);
  if (!announcement) return null;

  return {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    date: announcement.date,
    time: announcement.time,
    type: announcement.type,
    priority: announcement.priority as Announcement['priority'],
    is_pinned: announcement.isPinned,
  };
}

async function getAnnouncement(id: number): Promise<{ item: Announcement | null; failed: boolean }> {
  if (!supabase) return { item: getStaticAnnouncement(id), failed: false };

  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) return { item: data as Announcement, failed: false };
    if (error?.message.toLowerCase().includes('fetch failed')) {
      const item = getStaticAnnouncement(id);
      return { item, failed: !item };
    }
    return { item: getStaticAnnouncement(id), failed: false };
  } catch {
    const item = getStaticAnnouncement(id);
    return { item, failed: !item };
  }
}

export default function AnnouncementPage() {
  const { id } = useParams<{ id: string }>();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const announcementId = Number.parseInt(id, 10);

    if (!Number.isFinite(announcementId)) {
      setAnnouncement(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAnnouncement(announcementId)
      .then(({ item, failed }) => {
        if (!active) return;
        setAnnouncement(item);
        setLoadFailed(failed);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <main className="min-h-screen bg-[#f6f3ee] pt-32 text-center text-stone-700">Loading announcement…</main>;
  }

  if (!announcement) {
    return (
      <main className="min-h-screen bg-[#f6f3ee] px-4 pt-32 text-center text-stone-700">
        <p>{loadFailed ? 'This announcement could not be loaded. Check your connection and try again.' : 'Announcement not found.'}</p>
        <Link href="/announcements" className="mt-4 inline-flex items-center font-semibold text-teal-800 hover:text-teal-950">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to announcements
        </Link>
      </main>
    );
  }

  const formattedDate = new Date(announcement.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-4 pb-16 pt-28 sm:pt-32">
      <article className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/80 sm:p-10">
        <Link href="/announcements" className="mb-8 inline-flex items-center text-sm font-semibold text-teal-800 hover:text-teal-950">
          <ArrowLeft className="mr-2 h-5 w-5" />
          All announcements
        </Link>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase text-teal-900">
            <Bell className="h-4 w-4" />
            {announcement.type}
          </span>
          {announcement.is_pinned && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-800">
              <Pin className="h-4 w-4" />
              Pinned
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
          {announcement.title}
        </h1>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {announcement.time}
          </span>
        </div>

        <div className="my-7 border-t border-stone-200" />
        <p className="whitespace-pre-line text-base leading-relaxed text-stone-700 sm:text-lg">
          {announcement.content}
        </p>
      </article>
    </main>
  );
}