"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import type { GalleryItem } from '../../../types';
import { useRouter } from 'next/navigation';
import { uploadImageToBucket, DEFAULT_BUCKET } from '../../../lib/upload';

export default function AdminGallery() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<GalleryItem>>({ filename: '', src: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

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
  setUserId(sessionData.user.id);
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

  async function onImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    try {
  const { publicUrl } = await uploadImageToBucket(DEFAULT_BUCKET, file, userId ?? undefined, 'gallery');
      setForm((prev) => ({ ...prev, src: publicUrl, filename: prev.filename || file.name }));
    } catch (err: any) {
      setError(err?.message || 'Image upload failed');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!supabase) return;
    try {
      if (!form.src) {
        setError('Please upload an image before saving.');
        return;
      }
      const payload = { filename: form.filename, src: form.src };
      if (editingId) {
        const { error } = await supabase.from('gallery').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('gallery').insert(payload);
        if (error) throw error;
      }
      setForm({ filename: '', src: '' });
      setPreviewUrl(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        <button type="button" onClick={goBack} className="px-3 py-2 rounded border border-gray-300 text-gray-800 hover:bg-gray-50">Back</button>
      </div>
      <form onSubmit={save} className="grid gap-4 border rounded-lg p-6 md:p-8 bg-white">
        <input className="border rounded px-3 py-2" placeholder="Filename (optional)" value={form.filename||''} onChange={(e)=>setForm({ ...form, filename: e.target.value })} />
        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-start">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">Upload image to Storage</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageSelect}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-900"
            />
            <p className="text-xs text-gray-700">Bucket: {DEFAULT_BUCKET} • Folder: gallery. A public URL will be saved with the image.</p>
          </div>
          <div className="justify-self-end">
            {(previewUrl || form.src) && (
              <img src={(previewUrl || form.src) as string} alt="Preview" className="w-28 h-28 object-cover rounded border" />
            )}
          </div>
        </div>
  {/* Removed manual URL input: image is chosen via file upload above and its public URL is saved automatically. */}
        <div className="flex gap-2">
          <button className="bg-teal-600 text-white rounded px-3 py-2 disabled:opacity-60" type="submit" disabled={uploading}>{uploading ? 'Uploading…' : (editingId ? 'Update' : 'Add')}</button>
          {editingId && <button type="button" className="rounded px-3 py-2 border" onClick={()=>{ setEditingId(null); setForm({ filename:'', src:''}); setPreviewUrl(null); }}>Cancel</button>}
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
