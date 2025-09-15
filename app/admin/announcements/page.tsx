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
      const { data: sessionData } = await supabase.auth.getUser();
      if (!sessionData?.user) {
        setAuthed(false);
        setLoading(false);
        router.replace('/admin/login');
        return;
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

  return (
    <div className="space-y-6">
  <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
      <form onSubmit={save} className="grid gap-3 border rounded p-4 bg-white">
        <input className="border rounded px-3 py-2" placeholder="Title" value={form.title||''} onChange={(e)=>setForm({ ...form, title: e.target.value })} required />
        <textarea className="border rounded px-3 py-2" placeholder="Content" value={form.content||''} onChange={(e)=>setForm({ ...form, content: e.target.value })} required />
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="border rounded px-3 py-2" type="date" value={form.date||''} onChange={(e)=>setForm({ ...form, date: e.target.value })} required />
          <input className="border rounded px-3 py-2" type="time" value={form.time||''} onChange={(e)=>setForm({ ...form, time: e.target.value })} />
          <select className="border rounded px-3 py-2" value={form.type||'event'} onChange={(e)=>setForm({ ...form, type: e.target.value as any })}>
            <option value="event">Event</option>
            <option value="workshop">Workshop</option>
            <option value="meeting">Meeting</option>
            <option value="sports">Sports</option>
            <option value="service">Service</option>
            <option value="exhibition">Exhibition</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 items-center">
          <select className="border rounded px-3 py-2" value={form.priority||'medium'} onChange={(e)=>setForm({ ...form, priority: e.target.value as any })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!form.is_pinned} onChange={(e)=>setForm({ ...form, is_pinned: e.target.checked })} /> Pinned</label>
        </div>
        <div className="flex gap-2">
          <button className="bg-teal-600 text-white rounded px-3 py-2" type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" className="rounded px-3 py-2 border" onClick={()=>{ setEditingId(null); setForm({ title:'', content:'', date:'', time:'', type:'event', priority:'medium', is_pinned:false}); }}>Cancel</button>}
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </form>

      <div className="grid gap-3">
        {loading ? (
          <div className="text-gray-900">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-gray-800">{error ? error : 'No announcements yet.'}</div>
        ) : (
          items.map((a) => (
            <div key={a.id} className="border rounded p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <div className="font-semibold text-gray-900">{a.title} {a.is_pinned && <span className="text-xs text-teal-800">(Pinned)</span>}</div>
                <div className="text-sm text-gray-800">{a.date} {a.time} • {a.type} • {a.priority}</div>
                <p className="text-gray-900 mt-1 max-w-3xl whitespace-pre-line">{a.content}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded border" onClick={()=>{ setEditingId(a.id); setForm({ ...a }); }}>Edit</button>
                <button className="px-3 py-1.5 rounded border" onClick={()=>togglePin(a.id, a.is_pinned)}>{a.is_pinned ? 'Unpin' : 'Pin'}</button>
                <button className="px-3 py-1.5 rounded border text-red-600" onClick={()=>del(a.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
