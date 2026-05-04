"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import PostImageCarousel from './PostImageCarousel';
import { supabase } from '../../lib/supabaseClient';
import type { Post } from '../../types';
import { images as fallbackGalleryImages } from '../data/gallery';
import { posts as fallbackPosts } from '../data/posts';

interface GalleryItem {
  id: number;
  src: string;
  type: 'gallery' | 'post';
  postId?: number;
}

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
    if (isTransitioning || selectedIndex === null) return;
    setIsTransitioning(true);
    setSelectedIndex((prev) => 
      prev === null ? null : (prev - 1 + galleryLengthRef.current) % galleryLengthRef.current
    );
  }, [isTransitioning, selectedIndex]);

  const goToNext = useCallback(() => {
    if (isTransitioning || selectedIndex === null) return;
    setIsTransitioning(true);
    setSelectedIndex((prev) => 
      prev === null ? null : (prev + 1) % galleryLengthRef.current
    );
  }, [isTransitioning, selectedIndex]);

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
          supabase.from('posts').select('id, image, created_at').order('created_at', { ascending: false }),
        ]);
        const galleryItemsLocal: GalleryItem[] = (galleryData || []).map((item: any) => ({
          ...item,
          type: 'gallery' as const,
        }));
        const postItemsLocal: GalleryItem[] = (postsData || []).map((p: any) => ({
          id: p.id + 1000,
          src: p.image,
          type: 'post' as const,
          postId: p.id,
        }));
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
      <section id='gallery' className="p-8 md:p-16 bg-white">
        <h2 className="text-3xl font-bold text-teal-600 text-center mb-10">Gallery</h2>
        {loadingGallery ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({length: 16}).map((_, i) => (
              <div 
                key={`skel-${i}`}
                className="relative overflow-hidden rounded-xl shadow-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse h-64 md:h-72 lg:h-80 w-full"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {allGalleryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleThumbnailClick(item)}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <img
                  src={item.src}
                  alt={`Gallery image ${item.id}`}
                  className="w-full h-64 md:h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {item.type === 'post' && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    Post
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
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
              images={galleryImages} 
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
