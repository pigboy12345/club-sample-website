"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PostImageCarouselProps {
  images: string[];
  title: string;
}

export default function PostImageCarousel({ images, title }: PostImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const allImages = images.length > 0 ? images : [];
  const hasMultipleImages = allImages.length > 1;

  const goToNext = useCallback(() => {
    if (isTransitioning || !hasMultipleImages) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [isTransitioning, hasMultipleImages, allImages.length]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || !hasMultipleImages) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [isTransitioning, hasMultipleImages, allImages.length]);

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, [isTransitioning, currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  if (allImages.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Main Image Display */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
        <div
          className="absolute inset-0 flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {allImages.map((src, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0"
            >
              <img
                src={src}
                alt={`${title} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
          {currentIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Dot Indicators */}
      {hasMultipleImages && (
        <div className="flex justify-center gap-2 mt-4">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentIndex === index
                  ? 'bg-teal-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Gallery */}
      {hasMultipleImages && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {allImages.map((src, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                currentIndex === index
                  ? 'border-teal-600 ring-2 ring-teal-200'
                  : 'border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
