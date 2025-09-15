"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import type { GalleryItem } from '../../../types';
import { useRouter } from 'next/navigation';

export default function AdminGallery() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<GalleryItem>>({ filename: '', src: '' });
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
      const { data, error } = await supabase.from('gallery').select('*').order('id', { ascending: false });
      if (error) setError(error.message);
      setItems((data || []) as GalleryItem[]);
    } catch (err: any) {
      console.error('Failed to load gallery', err);
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
      const payload = { filename: form.filename, src: form.src };
      if (editingId) {
        const { error } = await supabase.from('gallery').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('gallery').insert(payload);
        if (error) throw error;
      }
      setForm({ filename: '', src: '' });
      setEditingId(null);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function del(id: number) {
    if (!supabase) return;
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) setError(error.message);
    await load();
  }

  return (
    <div className="space-y-6">
  <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
      <form onSubmit={save} className="grid gap-3 border rounded p-4 bg-white">
        <input className="border rounded px-3 py-2" placeholder="Filename (optional)" value={form.filename||''} onChange={(e)=>setForm({ ...form, filename: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Image URL (src)" value={form.src||''} onChange={(e)=>setForm({ ...form, src: e.target.value })} required />
        <div className="flex gap-2">
          <button className="bg-teal-600 text-white rounded px-3 py-2" type="submit">{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" className="rounded px-3 py-2 border" onClick={()=>{ setEditingId(null); setForm({ filename:'', src:''}); }}>Cancel</button>}
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </form>

      <div className="grid gap-3">
  {loading ? (
    <div className="text-gray-900">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-gray-800">{error ? error : 'No images yet.'}</div>
        ) : (
          items.map((g) => (
            <div key={g.id} className="border rounded p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <img src={g.src} alt={g.filename || ''} className="w-20 h-20 object-cover rounded" />
                <div>
      <div className="font-semibold text-gray-900">{g.filename || 'Untitled'}</div>
      <div className="text-xs text-gray-800 max-w-xl truncate">{g.src}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded border" onClick={()=>{ setEditingId(g.id); setForm({ ...g }); }}>Edit</button>
                <button className="px-3 py-1.5 rounded border text-red-600" onClick={()=>del(g.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
