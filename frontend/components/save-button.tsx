'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export type SaveableItemType =
  | 'product'
  | 'service'
  | 'guide'
  | 'restaurant'
  | 'church'
  | 'school'
  | 'event'
  | 'local-business';

interface SaveButtonProps {
  itemType: SaveableItemType;
  itemId: string;
  itemName: string;
  itemImage?: string | null;
  itemUrl?: string;
  variant?: 'card' | 'button' | 'icon';
  className?: string;
}

export function SaveButton({
  itemType,
  itemId,
  itemName,
  itemImage,
  itemUrl,
  variant = 'card',
  className = '',
}: SaveButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocumentId, setSavedDocumentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const userId = (session?.user as any)?.strapiUserId;
  const token = (session?.user as any)?.strapiToken;

  // Check if item is already saved
  useEffect(() => {
    if (status === 'loading') return;

    if (!userId) {
      setIsChecking(false);
      return;
    }

    checkIfSaved();
  }, [userId, status, itemType, itemId]);

  const checkIfSaved = async () => {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/wishlist-items?filters[user][id][$eq]=${userId}&filters[itemType][$eq]=${itemType}&filters[itemId][$eq]=${itemId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await res.json();

      if (data.data && data.data.length > 0) {
        setIsSaved(true);
        setSavedDocumentId(data.data[0].documentId);
      } else {
        setIsSaved(false);
        setSavedDocumentId(null);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
    setIsChecking(false);
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If not authenticated, redirect to login
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved && savedDocumentId) {
        // Remove from saved
        const res = await fetch(`${STRAPI_URL}/api/wishlist-items/${savedDocumentId}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          setIsSaved(false);
          setSavedDocumentId(null);
        }
      } else {
        // Add to saved
        const res = await fetch(`${STRAPI_URL}/api/wishlist-items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            data: {
              user: userId,
              itemType,
              itemId,
              itemName,
              itemImage: itemImage || null,
              itemUrl: itemUrl || null,
              addedAt: new Date().toISOString(),
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setIsSaved(true);
          setSavedDocumentId(data.data.documentId);
        }
      }
    } catch (error) {
      console.error('Error toggling saved status:', error);
    }

    setIsLoading(false);
  };

  // Card variant - small heart icon for top-right of cards
  if (variant === 'card') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading || isChecking}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:shadow-md transition-all disabled:opacity-50 group ${className}`}
        title={isSaved ? 'Remove from Saved' : 'Save'}
        aria-label={isSaved ? 'Remove from Saved' : 'Save'}
      >
        {isLoading ? (
          <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" />
        ) : (
          <Heart
            className={`w-5 h-5 transition-colors ${
              isSaved
                ? 'fill-rose-500 text-rose-500'
                : 'text-gray-400 group-hover:text-rose-500'
            }`}
          />
        )}
      </button>
    );
  }

  // Button variant - full button with text
  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading || isChecking}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${
          isSaved
            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${className}`}
      >
        {isLoading ? (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" />
        ) : (
          <Heart
            className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        )}
        {isSaved ? 'Saved' : 'Save'}
      </button>
    );
  }

  // Icon variant - just the heart, no background
  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isChecking}
      className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 ${className}`}
      title={isSaved ? 'Remove from Saved' : 'Save'}
      aria-label={isSaved ? 'Remove from Saved' : 'Save'}
    >
      {isLoading ? (
        <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" />
      ) : (
        <Heart
          className={`w-5 h-5 transition-colors ${
            isSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-rose-500'
          }`}
        />
      )}
    </button>
  );
}
