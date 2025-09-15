import { supabase } from './supabaseClient';

export const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'media';

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Upload an image file to a Supabase Storage bucket and return its public URL.
 * The file will be stored under `${userId||'public'}/<timestamp>-<rand>-<slug>.<ext>`.
 */
export async function uploadImageToBucket(bucket: string, file: File, userId?: string, folder?: string) {
  if (!supabase) throw new Error('Supabase is not configured');

  const ext = file.name.split('.').pop() || 'bin';
  const base = slugify(file.name.replace(/\.[^/.]+$/, '')) || 'image';
  const stamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const cleanFolder = folder ? folder.replace(/^\/+|\/+$/g, '') + '/' : '';
  const path = `${cleanFolder}${userId || 'public'}/${stamp}-${rand}-${base}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (uploadError) {
    const msg = (uploadError as any)?.message?.toString().toLowerCase() || '';
    if (msg.includes('bucket not found')) {
      throw new Error(`Storage bucket "${bucket}" not found. Create a PUBLIC bucket named "${bucket}" in Supabase Storage (Dashboard → Storage), or update the code to use your existing bucket name.`);
    }
    throw uploadError;
  }

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
  if (!pub?.publicUrl) throw new Error(`Failed to get public URL for uploaded file in bucket "${bucket}" at path "${path}".`);

  return { path, publicUrl: pub.publicUrl };
}
