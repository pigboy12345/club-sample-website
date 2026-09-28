import React from 'react';
import { Bell, Calendar, Clock, Pin, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { announcements as staticAnnouncements } from '../data/announcements';
import type { Announcement } from '../../types';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';

// Ensure this page is rendered dynamically on Vercel so new data appears immediately
export const dynamic = 'force-dynamic';

async function getAnnouncements(): Promise<Announcement[]> {
  if (!supabase) return staticAnnouncements.map(a => ({
    id: a.id,
    title: a.title,
    content: a.content,
    date: a.date,
    time: a.time,
    type: a.type,
    priority: a.priority as any,
    is_pinned: a.isPinned
  }));
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('date', { ascending: false })
    .limit(50);
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Supabase announcements error', error.message);
    return [];
  }
  return data as Announcement[];
}

const Announcements = async () => {
  const announcements = await getAnnouncements();

  const getTypeColor = (type: string) => {
    const colors = {
      event: 'bg-purple-100 text-purple-800',
      workshop: 'bg-blue-100 text-blue-800',
      meeting: 'bg-gray-100 text-gray-800',
      sports: 'bg-green-100 text-green-800',
      service: 'bg-orange-100 text-orange-800',
      exhibition: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <AlertCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const pinnedAnnouncements = announcements.filter(ann => ann.is_pinned);
  const regularAnnouncements = announcements.filter(ann => !ann.is_pinned);

  return (
    <main className="bg-[#f6f3ee] pt-[4.5rem] sm:pt-20">
      <PageBanner
        eyebrow="Updates"
        title="Announcements"
        subtitle="News, events, and notices from the Bappuji community."
        icon={<Bell className="h-7 w-7" />}
        image="/images/announcements-gathering.png"
      />
      <div className="min-h-[40vh]">
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Pinned Announcements */}
            {pinnedAnnouncements.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Pin className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">Pinned Announcements</h2>
                </div>
                <div className="space-y-5">
                  {pinnedAnnouncements.map((announcement, index) => (
                    <Reveal key={announcement.id} delay={index * 0.05}>
                    <div
                      className="rounded-3xl border-l-4 border-teal-600 bg-white p-5 shadow-sm ring-1 ring-stone-200/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(announcement.type)}`}>
                            {announcement.type.toUpperCase()}
                          </span>
                          {getPriorityIcon(announcement.priority)}
                          <Pin className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {announcement.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(announcement.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                            {announcement.time}
                        </div>
                      </div>
                    </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Announcements */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Announcements</h2>
              <div className="space-y-5">
                {regularAnnouncements.length === 0 && pinnedAnnouncements.length === 0 && (
                  <p className="rounded-3xl bg-white px-6 py-16 text-center text-stone-600 ring-1 ring-stone-200">
                    No announcements yet.
                  </p>
                )}
                {regularAnnouncements.map((announcement, index) => (
                  <Reveal key={announcement.id} delay={index * 0.05}>
                  <div
                    className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(announcement.type)}`}>
                          {announcement.type.toUpperCase()}
                        </span>
                        {getPriorityIcon(announcement.priority)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {announcement.content}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(announcement.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {announcement.time}
                      </div>
                    </div>
                  </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Announcements;
