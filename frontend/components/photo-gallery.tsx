'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import Image from 'next/image';

interface GalleryImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function PhotoGallery({ images, className = '', columns = 3 }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setZoom(1);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoom(1);
    document.body.style.overflow = '';
  };

  const goToPrevious = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    setZoom(1);
  }, [lightboxIndex, images.length]);

  const goToNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
    setZoom(1);
  }, [lightboxIndex, images.length]);

  const toggleZoom = () => {
    setZoom(zoom === 1 ? 2 : 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, goToPrevious, goToNext]);

  if (!images || images.length === 0) return null;

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid ${gridCols[columns]} gap-2 ${className}`}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="relative aspect-square overflow-hidden rounded-lg group focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <Image
              src={image.url}
              alt={image.alt || `Image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full px-4 py-2 z-10">
            <span className="text-white/70 text-sm">
              {lightboxIndex + 1} / {images.length}
            </span>
            <div className="w-px h-4 bg-white/30" />
            <button
              onClick={toggleZoom}
              className="p-1.5 text-white/70 hover:text-white transition-colors"
              aria-label={zoom > 1 ? 'Zoom out' : 'Zoom in'}
            >
              {zoom > 1 ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </button>
            <a
              href={images[lightboxIndex].url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-white/70 hover:text-white transition-colors"
              aria-label="Download"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image container */}
          <div
            className="relative w-full h-full flex items-center justify-center p-16 overflow-auto"
            onClick={(e) => e.target === e.currentTarget && closeLightbox()}
          >
            <div
              className="relative transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              <img
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].alt || `Image ${lightboxIndex + 1}`}
                className="max-h-[80vh] max-w-[90vw] object-contain"
                onClick={toggleZoom}
              />
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg overflow-x-auto max-w-[90vw]">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setLightboxIndex(index);
                    setZoom(1);
                  }}
                  className={`relative w-16 h-16 rounded overflow-hidden flex-shrink-0 transition-all ${
                    index === lightboxIndex
                      ? 'ring-2 ring-white'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
