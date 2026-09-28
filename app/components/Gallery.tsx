"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import PostImageCarousel from './PostImageCarousel';
import { supabase } from '../../lib/supabaseClient';
import type { Post } from '../../types';
import { images as fallbackGalleryImages } from '../data/gallery';
import { posts as fallbackPosts } from '../data/posts';
import Reveal, { Stagger } from './Reveal';
import SectionHeading from './SectionHeading';
import SlideText from './SlideText';

interface GalleryItem {
  id: number;
  src: string;
  type: 'gallery' | 'post';
  postId?: number;
}

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const router = useRouter();
  const galleryLengthRef = React.useRef(0);

  const galleryItems = allGalleryItems.filter(item => item.type === 'gallery');
  const galleryImages = galleryItems.map(item => item.src);

  const openModal = useCallback((index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const goToPrev = useCallback(() => {
    if (selectedIndex === null || galleryLengthRef.current === 0) return;
    setSelectedIndex((prev) => 
      prev === null ? null : (prev - 1 + galleryLengthRef.current) % galleryLengthRef.current
    );
  }, [selectedIndex]);

  const goToNext = useCallback(() => {
    if (selectedIndex === null || galleryLengthRef.current === 0) return;
    setSelectedIndex((prev) => 
      prev === null ? null : (prev + 1) % galleryLengthRef.current
    );
  }, [selectedIndex]);

  useEffect(() => {
    galleryLengthRef.current = galleryItems.length;
  }, [galleryItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, goToPrev, goToNext]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      setLoadingGallery(true);
      const buildFallback = () => {
        const galleryItemsLocal: GalleryItem[] = fallbackGalleryImages.map((src, index) => ({
          id: index + 1,
          src,
          type: 'gallery' as const,
        }));
        const postItemsLocal: GalleryItem[] = fallbackPosts.map((post) => ({
          id: post.id + 1000,
          src: post.image,
          type: 'post' as const,
          postId: post.id,
        }));
        return [...galleryItemsLocal, ...postItemsLocal];
      };

      if (!supabase) {
        setAllGalleryItems(buildFallback());
        setLoadingGallery(false);
        return;
      }

      try {
        const [ { data: galleryData }, { data: postsData } ] = await Promise.all([
          supabase.from('gallery').select('*').order('created_at', { ascending: false }),
          supabase.from('posts').select('id, image, images, created_at').order('created_at', { ascending: false }),
        ]);

        const galleryItemsLocal: GalleryItem[] = (galleryData || []).map((item: any) => ({
          ...item,
          type: 'gallery' as const,
        }));

        const postItemsLocal: GalleryItem[] = (postsData || [])
          .map((p: any) => {
            const postImages: string[] = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
            const hasSingleImage = typeof p.image === 'string' && p.image.length > 0;

            // Requirement: if BOTH `image` and `images` are null/empty, don't show this post
            if (!hasSingleImage && postImages.length === 0) return null;

            const src = hasSingleImage ? p.image : postImages[0];

            return {
              id: p.id + 1000,
              src,
              type: 'post' as const,
              postId: p.id,
            } as GalleryItem;
          })
          .filter((x: GalleryItem | null): x is GalleryItem => x !== null);

        setAllGalleryItems([...galleryItemsLocal, ...postItemsLocal]);
      } catch (err: any) {
        console.error('Gallery fetch error:', err);
        setAllGalleryItems(buildFallback());
      } finally {
        setLoadingGallery(false);
      }
    };
    fetchGalleryItems();
  }, []);

  const handleThumbnailClick = useCallback((item: GalleryItem) => {
    if (item.type === 'post' && item.postId) {
      router.push(`/posts/${item.postId}`);
    } else {
      const index = galleryItems.findIndex(g => g.id === item.id);
      if (index >= 0) openModal(index);
    }
  }, [router, galleryItems, openModal]);

  return (
    <>
      <section id="gallery" className="bg-[#f6f3ee] py-16 sm:py-24">
        <div data-scroll-y="70" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Moments"
              title="Gallery"
              subtitle="Photographs from club life. Post images open the full story."
            />
          </Reveal>
        {loadingGallery ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {Array.from({length: 8}).map((_, i) => (
              <div 
                key={`skel-${i}`}
                className="h-40 animate-pulse rounded-2xl bg-stone-200 sm:h-52 md:h-64"
              />
            ))}
          </div>
        ) : allGalleryItems.length === 0 ? (
          <SlideText>
            <p className="text-center text-stone-600">Gallery photos will appear here soon.</p>
          </SlideText>
        ) : (
          <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {allGalleryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleThumbnailClick(item)}
                className="group relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5"
              >
                <img
                  src={item.src}
                  alt={`Gallery image ${item.id}`}
                  className="h-40 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-52 md:h-64"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                {item.type === 'post' && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-800">
                    Post
                  </span>
                )}
              </button>
            ))}
          </Stagger>
        )}
        </div>
      </section>

      {selectedIndex !== null && galleryItems.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>

            <PostImageCarousel 
              key={selectedIndex}
              images={galleryImages}
              startIndex={selectedIndex}
              title={`Gallery - Image ${selectedIndex + 1} of ${galleryItems.length}`}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-10">
              {selectedIndex !== null ? `${selectedIndex + 1} / ${galleryItems.length}` : ''}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
