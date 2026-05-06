"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { Post, Category } from "../../../types";
import { useRouter } from "next/navigation";
import { uploadImageToBucket, uploadVideoToBucket, DEFAULT_BUCKET } from "../../../lib/upload";
import { X } from "lucide-react";

interface UploadedImage {
  file?: File;
  previewUrl: string;
  publicUrl?: string;
}

export default function AdminPosts() {
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Partial<Post>>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    date: new Date().toISOString().slice(0, 10),
    image: "",
    images: [],
    video: null,
    category_id: 0,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>("");
  const [addingCat, setAddingCat] = useState<boolean>(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const [videoUploading, setVideoUploading] = useState<boolean>(false);

  async function load() {
    if (!supabase) {
      setError("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.");
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
        supabase.from("posts").select("*").order("date", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (e1) setError(e1.message);
      if (e2) setError(e2.message);

      setItems((posts || []) as Post[]);
      setCats((categories || []) as Category[]);
    } catch (err: any) {
      console.error("Failed to load posts/categories", err);
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      const newImages: UploadedImage[] = [];

      for (const file of Array.from(files)) {
        const localUrl = URL.createObjectURL(file);
        newImages.push({ file, previewUrl: localUrl });
      }

      // Upload all images to Supabase
      const uploadedUrls: string[] = [];
      for (const img of newImages) {
        if (!img.file) continue;

        try {
          const { publicUrl } = await uploadImageToBucket(DEFAULT_BUCKET, img.file, userId ?? undefined, "posts");
          uploadedUrls.push(publicUrl);
        } catch (err: any) {
          console.error("Failed to upload image:", err);
        }
      }

      // Update form with new images
      const allImages = [...(form.images || []), ...uploadedUrls];
      setForm((prev) => ({ ...prev, images: allImages }));

      // If no primary image set, use first one
      if (!form.image && uploadedUrls.length > 0) {
        setPreviewUrl(uploadedUrls[0]);
        setForm((prev) => ({ ...prev, image: uploadedUrls[0] }));
      }

      setUploadedImages((prev) => [...prev, ...newImages]);
    } catch (err: any) {
      setError(err?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    // Remove from uploadedImages array (local previews)
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));

    // Remove from form.images
    const newImages = (form.images || []).filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, images: newImages }));

    // If we removed the primary image, set a new one
    if (form.images?.[index] === form.image && newImages.length > 0) {
      setForm((prev) => ({ ...prev, image: newImages[0] }));
      setPreviewUrl(newImages[0]);
    } else if (newImages.length === 0) {
      setForm((prev) => ({ ...prev, image: "" }));
      setPreviewUrl(null);
    }
  }

  async function onVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setVideoUploading(true);

    try {
      const { publicUrl } = await uploadVideoToBucket(DEFAULT_BUCKET, file, userId ?? undefined, "posts");
      setForm((prev) => ({ ...prev, video: publicUrl }));
    } catch (err: any) {
      setError(err?.message || "Video upload failed");
    } finally {
      setVideoUploading(false);
      // reset input so selecting same file again triggers onChange
      e.currentTarget.value = "";
    }
  }

  function removeVideo() {
    setForm((prev) => ({ ...prev, video: null }));
  }

  async function addCategory() {
    setError(null);
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    const name = newCatName.trim();
    if (!name) return;

    try {
      setAddingCat(true);
      const { data, error } = await supabase.from("categories").insert({ name }).select().single();
      if (error) throw error;

      const created = data as Category;
      setCats((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setForm((prev) => ({ ...prev, category_id: created.id }));
      setNewCatName("");
    } catch (err: any) {
      setError(err?.message || "Failed to add category");
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
        images: form.images,
        video: form.video ?? null,
        category_id: Number(form.category_id) || null,
      };

      if (editingId) {
        const { error } = await supabase.from("posts").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }

      setForm({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        date: new Date().toISOString().slice(0, 10),
        image: "",
        images: [],
        video: null,
        category_id: cats[0]?.id || 0,
      });
      setPreviewUrl(null);
      setUploadedImages([]);
      setEditingId(null);

      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to save post");
    }
  }

  async function del(id: number) {
    if (!supabase) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) setError(error.message);
    await load();
  }

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/admin");
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
          className="px-3 py-2 rounded border border-gray-400 text-gray-900 hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      <form onSubmit={save} className="grid gap-4 border rounded-lg p-6 md:p-8 bg-white">
        <input
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
          placeholder="Title"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
          placeholder="Excerpt"
          value={form.excerpt || ""}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
        <textarea
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
          placeholder="Content"
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <div className="grid sm:grid-cols-3 gap-3">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
            placeholder="Author"
            value={form.author || ""}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          <input
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
            type="date"
            value={form.date || ""}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700 flex-1"
              value={form.category_id || 0}
              onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
            >
              <option value={0}>No Category</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-700"
            placeholder="New category name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={addingCat || !newCatName.trim()}
            className="bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white"
          >
            {addingCat ? "Adding…" : "Add Category"}
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">Upload Video (optional, less than 1MB)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-500 transition-colors">
            <input
              type="file"
              accept="video/*"
              multiple={false}
              onChange={onVideoSelect}
              disabled={videoUploading || uploading}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-900"
            />
            <p className="text-xs text-gray-500 mt-2">
              Select a single video. Videos must be under <span className="font-semibold">less than 1MB</span>.
            </p>

            {form.video && (
              <div className="mt-3 space-y-2">
                <video
                  src={form.video}
                  controls
                  className="w-full max-h-60 object-contain rounded border bg-black/5"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="text-red-700 hover:text-red-800 text-sm font-medium underline underline-offset-2"
                  disabled={videoUploading}
                >
                  Remove video
                </button>
              </div>
            )}

            {videoUploading && <p className="text-sm text-teal-600 mt-2">Uploading video...</p>}
          </div>

          <label className="block text-sm font-medium text-gray-900 mt-4">Upload Images (Multiple)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onImageSelect}
              disabled={uploading}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-900"
            />
            <p className="text-xs text-gray-500 mt-2">
              Select multiple images to upload. First image will be the primary/thumbnail.
            </p>
          </div>

          {(uploadedImages.length > 0 || (form.images && form.images.length > 0)) && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Uploaded Images:</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {uploadedImages.length > 0
                  ? uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.previewUrl}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-teal-600 text-white text-xs px-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))
                  : form.images?.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={url}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-teal-600 text-white text-xs px-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
              </div>
            </div>
          )}

          {uploading && <p className="text-sm text-teal-600">Uploading images...</p>}
        </div>

        <div className="flex gap-2">
          <button
            className="bg-teal-700 hover:bg-teal-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:ring-offset-white"
            type="submit"
            disabled={uploading || videoUploading}
          >
            {uploading || videoUploading ? "Uploading…" : editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button
              type="button"
              className="rounded-md px-3 py-2 border border-gray-300 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white"
              onClick={() => {
                setEditingId(null);
                setForm({
                  title: "",
                  excerpt: "",
                  content: "",
                  author: "",
                  date: new Date().toISOString().slice(0, 10),
                  image: "",
                  images: [],
                  video: null,
                  category_id: 0,
                });
                setPreviewUrl(null);
                setUploadedImages([]);
              }}
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
          <div className="text-gray-900">{error ? error : "No posts yet."}</div>
        ) : (
          items.map((p) => (
            <div
              key={p.id}
              className="border rounded p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
            >
              <div>
                <div className="font-semibold text-gray-900">{p.title}</div>
                <div className="text-sm text-gray-900">
                  {p.date} • Cat #{p.category_id || "None"}
                </div>
                <p className="text-gray-900 mt-1 max-w-3xl whitespace-pre-line">{p.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 rounded border border-gray-400 text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  onClick={() => {
                    setEditingId(p.id);
                    setForm({ ...p });
                    setPreviewUrl(p.image || null);
                    setUploadedImages([]);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1.5 rounded border border-gray-400 text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  onClick={() => del(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
