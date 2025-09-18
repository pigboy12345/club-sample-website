import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { images as staticImages } from '../data/gallery';

interface GalleryItem { id: number; src: string; filename?: string | null }

// Render dynamically to fetch latest images on each request
export const dynamic = 'force-dynamic';

async function getGallery(): Promise<GalleryItem[]> {
    if (!supabase) {
        return staticImages.map((src, idx) => ({ id: idx + 1, src }));
    }
    const { data, error } = await supabase
        .from('gallery')
        .select('id, src, filename')
        .order('id', { ascending: false })
        .limit(30);
    // console.log(data)
    if (error) {
        // eslint-disable-next-line no-console
            console.error('Supabase gallery error', error.code, error.message);
            // 42P01 = undefined_table in Postgres
            if (error.code === '42P01') {
                return staticImages.map((src, idx) => ({ id: idx + 1, src, filename: null }));
            }
            return [];
    }
    return (data || []) as GalleryItem[];
}

const Gallery = async () => {
    const gallery = await getGallery();

    return (
        <section id='gallery' className="p-8 md:p-16 bg-white">
            <h2 className="text-3xl font-bold text-teal-600 text-center mb-10">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.map((item) => (
                    <img
                        key={item.id}
                        src={item.src}
                        alt={item.filename || `Gallery image ${item.id}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                ))}
            </div>
        </section>
    );
};

export default Gallery;
