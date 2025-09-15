"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import type { Post, Category } from '../../../types';
import { useRouter } from 'next/navigation';
import { uploadImageToBucket, DEFAULT_BUCKET } from '../../../lib/upload';

export default function AdminPosts() {
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Post>>({ title: '', excerpt: '', content: '', author: '', date: new Date().toISOString().slice(0,10), image: '', category_id: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [addingCat, setAddingCat] = useState<boolean>(false);
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
      const [{ data: posts, error: e1 }, { data: categories, error: e2 }] = await Promise.all([
        supabase.from('posts').select('*').order('date', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);
      if (e1) setError(e1.message);
      if (e2) setError(e2.message);
      setItems((posts || []) as Post[]);
      setCats((categories || []) as Category[]);
    } catch (err: any) {
      console.error('Failed to load posts/categories', err);
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load();
  }, []);

  async function onImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    try {
  const { publicUrl } = await uploadImageToBucket(DEFAULT_BUCKET, file, userId ?? undefined, 'posts');
      setForm((prev) => ({ ...prev, image: publicUrl }));
    } catch (err: any) {
      setError(err?.message || 'Image upload failed');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  }

  async function addCategory() {
    setError(null);
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }
    const name = newCatName.trim();
    if (!name) return;
    try {
      setAddingCat(true);
      const { data, error } = await supabase
        .from('categories')
        .insert({ name })
        .select()
        .single();
      if (error) throw error;
      const created = data as Category;
      setCats((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setForm((prev) => ({ ...prev, category_id: created.id }));
      setNewCatName('');
    } catch (err: any) {
      setError(err?.message || 'Failed to add category');
    } finally {
      setAddingCat(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!supabase) return;
    try {
      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        date: form.date,
        image: form.image,
        category_id: Number(form.category_id) || null,
      };
      if (editingId) {
        const { error } = await supabase.from('posts').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('posts').insert(payload);
        if (error) throw error;
      }
      setForm({ title: '', excerpt: '', content: '', author: '', date: new Date().toISOString().slice(0,10), image: '', category_id: cats[0]?.id || 0 });
      setPreviewUrl(null);
      setEditingId(null);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function del(id: number) {
    if (!supabase) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
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
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <button
          type="button"
          onClick={goBack}
          className="px-3 py-2 rounded border border-gray-300 text-gray-800 hover:bg-gray-50"
        >
          Back
        </button>
      </div>
      <form onSubmit={save} className="grid gap-4 border rounded-lg p-6 md:p-8 bg-white">
        <input
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
          placeholder="Title"
          value={form.title||''}
          onChange={(e)=>setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
          placeholder="Excerpt"
          value={form.excerpt||''}
          onChange={(e)=>setForm({ ...form, excerpt: e.target.value })}
        />
        <textarea
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
          placeholder="Content"
          value={form.content||''}
          onChange={(e)=>setForm({ ...form, content: e.target.value })}
        />
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
            placeholder="Author"
            value={form.author||''}
            onChange={(e)=>setForm({ ...form, author: e.target.value })}
          />
          <input
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
            type="date"
            value={form.date||''}
            onChange={(e)=>setForm({ ...form, date: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700 flex-1"
              value={form.category_id||0}
              onChange={(e)=>setForm({ ...form, category_id: Number(e.target.value) })}
            >
              <option value={0}>No Category</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
            placeholder="New category name"
            value={newCatName}
            onChange={(e)=>setNewCatName(e.target.value)}
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={addingCat || !newCatName.trim()}
            className="bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white"
          >
            {addingCat ? 'Adding…' : 'Add Category'}
          </button>
        </div>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-start">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">Upload image to Storage</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageSelect}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-900"
            />
            <p className="text-xs text-gray-700">Bucket: {DEFAULT_BUCKET} • Folder: posts. A public URL will be saved with the post.</p>
          </div>
          <div className="justify-self-end">
            {(previewUrl || form.image) && (
              <img src={(previewUrl || form.image) as string} alt="Preview" className="w-28 h-28 object-cover rounded border" />
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-teal-700 hover:bg-teal-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:ring-offset-white" type="submit" disabled={uploading}>{uploading ? 'Uploading…' : (editingId ? 'Update' : 'Create')}</button>
          {editingId && <button type="button" className="rounded-md px-3 py-2 border border-gray-300 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white" onClick={()=>{ setEditingId(null); setForm({ title:'', excerpt:'', content:'', author:'', date:new Date().toISOString().slice(0,10), image:'', category_id: 0}); setPreviewUrl(null); }}>Cancel</button>}
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </form>

      <div className="grid gap-3">
        {loading ? (
          <div className="text-gray-900">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-gray-900">{error ? error : 'No posts yet.'}</div>
        ) : (
          items.map((p) => (
            <div key={p.id} className="border rounded p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <div className="font-semibold text-gray-900">{p.title}</div>
                <div className="text-sm text-gray-900">{p.date} • Cat #{p.category_id || 'None'}</div>
                <p className="text-gray-900 mt-1 max-w-3xl whitespace-pre-line">{p.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded border" onClick={()=>{ setEditingId(p.id); setForm({ ...p }); }}>Edit</button>
                <button className="px-3 py-1.5 rounded border text-red-600" onClick={()=>del(p.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
