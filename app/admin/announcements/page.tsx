"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import type { Announcement } from '../../../types';
import { useRouter } from 'next/navigation';

export default function AdminAnnouncements() {
  const router = useRouter();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Announcement>>({ title: '', content: '', date: '', time: '', type: 'event', priority: 'medium', is_pinned: false });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean>(false);

  async function load() {
    if (!supabase) {
      setError('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Warm session to avoid redirecting before Supabase restores the session on refresh
      await supabase.auth.getSession();
      const { data: sessionData } = await supabase.auth.getUser();
      if (!sessionData?.user) {
        setAuthed(false);
        setLoading(false);
        return; // Admin layout will handle redirect if needed
      }
      setAuthed(true);
      const { data, error } = await supabase.from('announcements').select('*').order('is_pinned', { ascending: false }).order('date', { ascending: false });
      if (error) setError(error.message);
      setItems((data || []) as Announcement[]);
    } catch (err: any) {
      console.error('Failed to load announcements', err);
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!supabase) return;
    try {
      if (editingId) {
        const { error } = await supabase.from('announcements').update({
          title: form.title,
          content: form.content,
          date: form.date,
          time: form.time,
          type: form.type,
          priority: form.priority,
          is_pinned: !!form.is_pinned,
        }).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('announcements').insert({
          title: form.title,
          content: form.content,
          date: form.date,
          time: form.time,
          type: form.type,
          priority: form.priority,
          is_pinned: !!form.is_pinned,
        });
        if (error) throw error;
      }
      setForm({ title: '', content: '', date: '', time: '', type: 'event', priority: 'medium', is_pinned: false });
      setEditingId(null);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function del(id: number) {
    if (!supabase) return;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) setError(error.message);
    await load();
  }

  async function togglePin(id: number, current: boolean) {
    if (!supabase) return;
    const { error } = await supabase.from('announcements').update({ is_pinned: !current }).eq('id', id);
    if (error) setError(error.message);
    await load();
  }

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push('/admin');
  }

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-gray-900">Loading…</div>;
  }

  if (!authed) {
    return <div className="min-h-[50vh] flex items-center justify-center text-gray-900">Please log in…</div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <button
          type="button"
          onClick={goBack}
          className="px-3 py-2 rounded border border-gray-400 text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          Back
        </button>
      </div>
      <form onSubmit={save} className="grid gap-4 border border-gray-300 rounded-lg p-6 md:p-8 bg-white">
        <input
          className="border border-gray-400 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          placeholder="Title"
          value={form.title||''}
          onChange={(e)=>setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="border border-gray-400 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          placeholder="Content"
          value={form.content||''}
          onChange={(e)=>setForm({ ...form, content: e.target.value })}
          required
        />
  <div className="grid sm:grid-cols-3 gap-3">
          <input className="border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600" type="date" value={form.date||''} onChange={(e)=>setForm({ ...form, date: e.target.value })} required />
          <input className="border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600" type="time" value={form.time||''} onChange={(e)=>setForm({ ...form, time: e.target.value })} />
          <select className="border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600" value={form.type||'event'} onChange={(e)=>setForm({ ...form, type: e.target.value as any })}>
            <option value="event">Event</option>
            <option value="workshop">Workshop</option>
            <option value="meeting">Meeting</option>
            <option value="sports">Sports</option>
            <option value="service">Service</option>
            <option value="exhibition">Exhibition</option>
          </select>
        </div>
  <div className="grid sm:grid-cols-2 gap-3 items-center">
          <select className="border border-gray-400 rounded px-3 py-2 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600" value={form.priority||'medium'} onChange={(e)=>setForm({ ...form, priority: e.target.value as any })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <label className="inline-flex items-center gap-2 text-gray-900">
            <input
              type="checkbox"
              className="h-4 w-4 border border-gray-400 rounded text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              checked={!!form.is_pinned}
              onChange={(e)=>setForm({ ...form, is_pinned: e.target.checked })}
            />
            Pinned
          </label>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-teal-700 hover:bg-teal-800 text-white rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            type="submit"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              className="rounded-md px-3 py-2 border border-gray-400 text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              onClick={()=>{ setEditingId(null); setForm({ title:'', content:'', date:'', time:'', type:'event', priority:'medium', is_pinned:false}); }}
            >
              Cancel
            </button>
          )}
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </form>

      <div className="grid gap-3">
        {loading ? (
          <div className="text-gray-900">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-gray-900">{error ? error : 'No announcements yet.'}</div>
        ) : (
          items.map((a) => (
            <div key={a.id} className="border border-gray-300 rounded p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <div className="font-semibold text-gray-900">{a.title} {a.is_pinned && <span className="text-xs text-teal-800">(Pinned)</span>}</div>
                <div className="text-sm text-gray-900">{a.date} {a.time} • {a.type} • {a.priority}</div>
                <p className="text-gray-900 mt-1 max-w-3xl whitespace-pre-line">{a.content}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded border border-gray-400 text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600" onClick={()=>{ setEditingId(a.id); setForm({ ...a }); }}>Edit</button>
                <button className="px-3 py-1.5 rounded border border-gray-400 text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600" onClick={()=>togglePin(a.id, a.is_pinned)}>{a.is_pinned ? 'Unpin' : 'Pin'}</button>
                <button className="px-3 py-1.5 rounded border border-gray-400 text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600" onClick={()=>del(a.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
