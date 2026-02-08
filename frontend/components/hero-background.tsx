'use client';

import { useState, useEffect } from 'react';

interface HeroBackgroundProps {
  imageUrl: string;
  children: React.ReactNode;
  className?: string;
  fallbackColor?: string;
}

export function HeroBackground({
  imageUrl,
  children,
  className = '',
  fallbackColor = 'bg-brand-700',
}: HeroBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;

    if (img.complete) {
      setIsLoaded(true);
    } else {
      img.onload = () => setIsLoaded(true);
    }

    return () => {
      img.onload = null;
    };
  }, [imageUrl]);

  return (
    <section className={`relative isolate ${className}`}>
      {/* Fallback background */}
      <div className={`absolute inset-0 -z-20 overflow-hidden ${fallbackColor}`} />

      {/* Image background with fade-in */}
      <div
        className={`absolute inset-0 -z-10 overflow-hidden bg-cover bg-center transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />

      {/* Content - no positioning so absolute children position relative to section */}
      {children}
    </section>
  );
}
