import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, ZoomIn } from "lucide-react";

/**
 * EntityPhotoGallery - A reusable photo gallery component for any entity type
 *
 * @param {Object} props
 * @param {Array} props.photos - Array of photo objects with { url, caption?, alt? } or just URLs
 * @param {string} props.mainPhoto - URL of the main/primary photo
 * @param {string} props.entityName - Name of the entity (for alt text fallback)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.layout - 'grid' | 'carousel' | 'masonry' (default: 'grid')
 * @param {number} props.columns - Number of columns for grid layout (default: 3)
 * @param {boolean} props.showMainPhoto - Whether to show the main photo in the gallery (default: true)
 */
export default function EntityPhotoGallery({
  photos = [],
  mainPhoto,
  entityName = "Photo",
  className = "",
  layout = "grid",
  columns = 3,
  showMainPhoto = true
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize photos to objects
  const normalizedPhotos = photos.map((photo, index) => {
    if (typeof photo === 'string') {
      return { url: photo, caption: '', alt: `${entityName} photo ${index + 1}` };
    }
    return {
      url: photo.url || photo,
      caption: photo.caption || '',
      alt: photo.alt || `${entityName} photo ${index + 1}`
    };
  });

  // Add main photo to the beginning if specified
  const allPhotos = showMainPhoto && mainPhoto
    ? [{ url: mainPhoto, caption: 'Main photo', alt: entityName }, ...normalizedPhotos.filter(p => p.url !== mainPhoto)]
    : normalizedPhotos;

  if (allPhotos.length === 0) {
    return null;
  }

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'Escape') closeLightbox();
  };

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
  }[columns] || 'grid-cols-2 md:grid-cols-3';

  return (
    <>
      {/* Grid Gallery */}
      <div className={`grid ${gridColsClass} gap-2 ${className}`}>
        {allPhotos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            onClick={() => openLightbox(index)}
          >
            <img
              src={photo.url}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-sm truncate">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-5xl w-full h-[90vh] p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <DialogTitle className="sr-only">Photo Gallery</DialogTitle>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation buttons */}
          {allPhotos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 w-12 h-12"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 w-12 h-12"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Main image */}
          <div className="flex items-center justify-center h-full p-8">
            <img
              src={allPhotos[currentIndex]?.url}
              alt={allPhotos[currentIndex]?.alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Caption and counter */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="text-center">
              {allPhotos[currentIndex]?.caption && (
                <p className="text-white text-lg mb-2">{allPhotos[currentIndex].caption}</p>
              )}
              <p className="text-white/70 text-sm">
                {currentIndex + 1} / {allPhotos.length}
              </p>
            </div>
          </div>

          {/* Thumbnail strip */}
          {allPhotos.length > 1 && (
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
              {allPhotos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                    index === currentIndex ? 'border-white' : 'border-transparent opacity-50 hover:opacity-75'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * EntityPhotoCard - A single photo card for listing views
 */
export function EntityPhotoCard({
  photo,
  title,
  subtitle,
  onClick,
  aspectRatio = "video", // 'video' (16:9), 'square', 'portrait'
  className = ""
}) {
  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]'
  }[aspectRatio] || 'aspect-video';

  return (
    <div
      className={`relative ${aspectClass} overflow-hidden rounded-lg bg-gray-100 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {photo ? (
        <img
          src={photo}
          alt={title || 'Photo'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <ImageIcon className="w-12 h-12 text-gray-300" />
        </div>
      )}

      {(title || subtitle) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          {title && <h3 className="text-white font-semibold text-lg">{title}</h3>}
          {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}

/**
 * EntityHeroImage - A hero image component with overlay
 */
export function EntityHeroImage({
  image,
  title,
  subtitle,
  height = "h-64 md:h-80",
  overlay = true,
  className = ""
}) {
  return (
    <div className={`relative ${height} overflow-hidden ${className}`}>
      {image ? (
        <img
          src={image}
          alt={title || 'Hero image'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <ImageIcon className="w-20 h-20 text-gray-400" />
        </div>
      )}

      {overlay && (title || subtitle) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
          <div className="p-6 w-full">
            {title && <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">{title}</h1>}
            {subtitle && <p className="text-white/90 text-lg">{subtitle}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
