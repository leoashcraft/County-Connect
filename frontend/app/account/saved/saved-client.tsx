'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Heart,
  Trash2,
  MapPin,
  UtensilsCrossed,
  Church,
  GraduationCap,
  Calendar,
  Building2,
  ShoppingBag,
  Wrench,
  BookOpen,
  Filter,
  Plus,
  FolderOpen,
  MoreVertical,
  Pencil,
  X,
  FolderPlus,
  ChevronDown,
} from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface WishlistCollection {
  id: number;
  documentId: string;
  name: string;
  sortOrder: number;
}

interface SavedItem {
  id: number;
  documentId: string;
  itemType: string;
  itemId: string;
  itemName: string;
  itemImage: string | null;
  itemUrl: string | null;
  addedAt: string;
  collection?: WishlistCollection | null;
}

const itemTypeConfig: Record<string, { label: string; icon: typeof Heart; color: string }> = {
  product: { label: 'Products', icon: ShoppingBag, color: 'blue' },
  service: { label: 'Services', icon: Wrench, color: 'purple' },
  guide: { label: 'Guides', icon: BookOpen, color: 'emerald' },
  restaurant: { label: 'Restaurants', icon: UtensilsCrossed, color: 'orange' },
  church: { label: 'Churches', icon: Church, color: 'indigo' },
  school: { label: 'Schools', icon: GraduationCap, color: 'amber' },
  event: { label: 'Events', icon: Calendar, color: 'rose' },
  'local-business': { label: 'Businesses', icon: Building2, color: 'teal' },
};

export default function SavedClient() {
  const { data: session } = useSession();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [collections, setCollections] = useState<WishlistCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState<string | null>(null); // null = All, 'uncategorized' = no collection, or documentId

  // Collection management state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState<WishlistCollection | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<WishlistCollection | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [deleteOption, setDeleteOption] = useState<'move' | 'delete'>('move');
  const [collectionActionOpen, setCollectionActionOpen] = useState<string | null>(null);
  const [moveToCollectionOpen, setMoveToCollectionOpen] = useState<string | null>(null);
  const [savingCollection, setSavingCollection] = useState(false);

  const collectionActionRef = useRef<HTMLDivElement>(null);
  const moveToCollectionRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collectionActionRef.current && !collectionActionRef.current.contains(event.target as Node)) {
        setCollectionActionOpen(null);
      }
      if (moveToCollectionRef.current && !moveToCollectionRef.current.contains(event.target as Node)) {
        setMoveToCollectionOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (session) {
      loadSavedItems();
      loadCollections();
    }
  }, [session]);

  const loadSavedItems = async () => {
    try {
      const token = (session?.user as any)?.strapiToken;
      const userId = (session?.user as any)?.strapiUserId;

      if (!userId) {
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${STRAPI_URL}/api/wishlist-items?filters[user][id][$eq]=${userId}&sort=addedAt:desc&populate=collection`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await res.json();
      setSavedItems(data.data || []);
    } catch (error) {
      console.error('Error loading saved items:', error);
    }
    setLoading(false);
  };

  const loadCollections = async () => {
    try {
      const token = (session?.user as any)?.strapiToken;
      const userId = (session?.user as any)?.strapiUserId;

      if (!userId) return;

      const res = await fetch(
        `${STRAPI_URL}/api/wishlist-collections?filters[user][id][$eq]=${userId}&sort=sortOrder:asc`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await res.json();
      setCollections(data.data || []);
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;

    try {
      setSavingCollection(true);
      const token = (session?.user as any)?.strapiToken;
      const userId = (session?.user as any)?.strapiUserId;

      const res = await fetch(`${STRAPI_URL}/api/wishlist-collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          data: {
            name: newCollectionName.trim(),
            user: userId,
            sortOrder: collections.length,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCollections((prev) => [...prev, data.data]);
        setNewCollectionName('');
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
    }
    setSavingCollection(false);
  };

  const renameCollection = async () => {
    if (!showRenameModal || !renameValue.trim()) return;

    try {
      setSavingCollection(true);
      const token = (session?.user as any)?.strapiToken;

      const res = await fetch(`${STRAPI_URL}/api/wishlist-collections/${showRenameModal.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          data: {
            name: renameValue.trim(),
          },
        }),
      });

      if (res.ok) {
        setCollections((prev) =>
          prev.map((c) => (c.documentId === showRenameModal.documentId ? { ...c, name: renameValue.trim() } : c))
        );
        setShowRenameModal(null);
        setRenameValue('');
      }
    } catch (error) {
      console.error('Error renaming collection:', error);
    }
    setSavingCollection(false);
  };

  const deleteCollection = async () => {
    if (!showDeleteModal) return;

    try {
      setSavingCollection(true);
      const token = (session?.user as any)?.strapiToken;

      // If moving items to uncategorized, update all items in this collection first
      if (deleteOption === 'move') {
        const itemsInCollection = savedItems.filter(
          (item) => item.collection?.documentId === showDeleteModal.documentId
        );
        for (const item of itemsInCollection) {
          await fetch(`${STRAPI_URL}/api/wishlist-items/${item.documentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              data: {
                collection: null,
              },
            }),
          });
        }
        // Update local state
        setSavedItems((prev) =>
          prev.map((item) =>
            item.collection?.documentId === showDeleteModal.documentId ? { ...item, collection: null } : item
          )
        );
      } else {
        // Delete all items in the collection
        const itemsInCollection = savedItems.filter(
          (item) => item.collection?.documentId === showDeleteModal.documentId
        );
        for (const item of itemsInCollection) {
          await fetch(`${STRAPI_URL}/api/wishlist-items/${item.documentId}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
        }
        // Update local state
        setSavedItems((prev) => prev.filter((item) => item.collection?.documentId !== showDeleteModal.documentId));
      }

      // Now delete the collection
      const res = await fetch(`${STRAPI_URL}/api/wishlist-collections/${showDeleteModal.documentId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setCollections((prev) => prev.filter((c) => c.documentId !== showDeleteModal.documentId));
        // Reset active collection if we just deleted it
        if (activeCollection === showDeleteModal.documentId) {
          setActiveCollection(null);
        }
        setShowDeleteModal(null);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
    setSavingCollection(false);
  };

  const moveItemToCollection = async (itemDocumentId: string, collectionDocumentId: string | null) => {
    try {
      const token = (session?.user as any)?.strapiToken;

      const res = await fetch(`${STRAPI_URL}/api/wishlist-items/${itemDocumentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          data: {
            collection: collectionDocumentId,
          },
        }),
      });

      if (res.ok) {
        const targetCollection = collectionDocumentId
          ? collections.find((c) => c.documentId === collectionDocumentId) || null
          : null;
        setSavedItems((prev) =>
          prev.map((item) => (item.documentId === itemDocumentId ? { ...item, collection: targetCollection } : item))
        );
        setMoveToCollectionOpen(null);
      }
    } catch (error) {
      console.error('Error moving item to collection:', error);
    }
  };

  const removeItem = async (documentId: string) => {
    try {
      setRemovingId(documentId);
      const token = (session?.user as any)?.strapiToken;

      const res = await fetch(`${STRAPI_URL}/api/wishlist-items/${documentId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setSavedItems((prev) => prev.filter((item) => item.documentId !== documentId));
      }
    } catch (error) {
      console.error('Error removing saved item:', error);
    }
    setRemovingId(null);
  };

  const getItemUrl = (item: SavedItem): string => {
    if (item.itemUrl) return item.itemUrl;

    // Build URL based on item type
    switch (item.itemType) {
      case 'product':
        return `/marketplace/${item.itemId}`;
      case 'service':
        return `/services/${item.itemId}`;
      case 'guide':
        return `/guides/${item.itemId}`;
      case 'restaurant':
        return `/directory/restaurants/${item.itemId}`;
      case 'church':
        return `/directory/churches/${item.itemId}`;
      case 'school':
        return `/directory/schools/${item.itemId}`;
      case 'event':
        return `/directory/events/${item.itemId}`;
      case 'local-business':
        return `/directory/local-businesses/${item.itemId}`;
      default:
        return '#';
    }
  };

  const getTypeConfig = (type: string) => {
    return itemTypeConfig[type] || { label: type, icon: Heart, color: 'gray' };
  };

  // Get unique types for filter
  const uniqueTypes = [...new Set(savedItems.map((item) => item.itemType))];

  // Filter items by collection first, then by type
  const collectionFilteredItems = (() => {
    if (activeCollection === null) {
      return savedItems; // All items
    } else if (activeCollection === 'uncategorized') {
      return savedItems.filter((item) => !item.collection);
    } else {
      return savedItems.filter((item) => item.collection?.documentId === activeCollection);
    }
  })();

  const filteredItems = activeFilter
    ? collectionFilteredItems.filter((item) => item.itemType === activeFilter)
    : collectionFilteredItems;

  // Count items per collection
  const getCollectionCount = (collectionDocumentId: string | null) => {
    if (collectionDocumentId === null) {
      return savedItems.length; // All items
    } else if (collectionDocumentId === 'uncategorized') {
      return savedItems.filter((item) => !item.collection).length;
    } else {
      return savedItems.filter((item) => item.collection?.documentId === collectionDocumentId).length;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved</h1>
          <p className="text-gray-500 mt-1">
            {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {/* Collection Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-1 -mb-px">
          {/* All Items Tab */}
          <button
            onClick={() => setActiveCollection(null)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeCollection === null
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Items
            <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {getCollectionCount(null)}
            </span>
          </button>

          {/* Uncategorized Tab */}
          <button
            onClick={() => setActiveCollection('uncategorized')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeCollection === 'uncategorized'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Uncategorized
            <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {getCollectionCount('uncategorized')}
            </span>
          </button>

          {/* Dynamic Collection Tabs */}
          {collections.map((collection) => (
            <div key={collection.documentId} className="relative flex items-center" ref={collectionActionOpen === collection.documentId ? collectionActionRef : null}>
              <button
                onClick={() => setActiveCollection(collection.documentId)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeCollection === collection.documentId
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                {collection.name}
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  {getCollectionCount(collection.documentId)}
                </span>
              </button>
              {/* Collection Actions Dropdown */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCollectionActionOpen(collectionActionOpen === collection.documentId ? null : collection.documentId);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {collectionActionOpen === collection.documentId && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[150px]">
                  <button
                    onClick={() => {
                      setRenameValue(collection.name);
                      setShowRenameModal(collection);
                      setCollectionActionOpen(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(collection);
                      setDeleteOption('move');
                      setCollectionActionOpen(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* New Collection Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-orange-600 border-b-2 border-transparent flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        </div>
      </div>

      {/* Type Filter Tabs */}
      {uniqueTypes.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({collectionFilteredItems.length})
          </button>
          {uniqueTypes.map((type) => {
            const config = getTypeConfig(type);
            const count = collectionFilteredItems.filter((item) => item.itemType === type).length;
            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeFilter === type
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <config.icon className="w-4 h-4" />
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {filteredItems.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const config = getTypeConfig(item.itemType);
            const Icon = config.icon;

            return (
              <div
                key={item.documentId}
                className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-200"
              >
                {/* Image / Placeholder */}
                <Link
                  href={getItemUrl(item)}
                  className="block aspect-[4/3] bg-gray-100 relative overflow-hidden"
                >
                  {item.itemImage ? (
                    <img
                      src={item.itemImage}
                      alt={item.itemName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <Icon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {/* Type Badge */}
                  <span className={`absolute top-2 left-2 px-2.5 py-1 bg-white/95 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1.5 shadow-sm`}>
                    <Icon className="w-3.5 h-3.5" />
                    {config.label.replace(/s$/, '')}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link href={getItemUrl(item)} className="block group">
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                      {item.itemName}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-400 mt-2">
                    Saved {new Date(item.addedAt).toLocaleDateString()}
                  </p>

                  {/* Collection Badge */}
                  {item.collection && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                      <FolderOpen className="w-3.5 h-3.5" />
                      {item.collection.name}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <Link
                      href={getItemUrl(item)}
                      className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      View Details →
                    </Link>
                    <div className="flex items-center gap-1">
                      {/* Move to Collection Dropdown */}
                      <div className="relative" ref={moveToCollectionOpen === item.documentId ? moveToCollectionRef : null}>
                        <button
                          onClick={() => setMoveToCollectionOpen(moveToCollectionOpen === item.documentId ? null : item.documentId)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Move to Collection"
                        >
                          <FolderPlus className="w-4 h-4" />
                        </button>
                        {moveToCollectionOpen === item.documentId && (
                          <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[180px]">
                            <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                              Move to Collection
                            </div>
                            {/* Remove from collection option */}
                            {item.collection && (
                              <button
                                onClick={() => moveItemToCollection(item.documentId, null)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <X className="w-4 h-4 text-gray-400" />
                                Remove from Collection
                              </button>
                            )}
                            {/* Collection options */}
                            {collections.map((collection) => (
                              <button
                                key={collection.documentId}
                                onClick={() => moveItemToCollection(item.documentId, collection.documentId)}
                                disabled={item.collection?.documentId === collection.documentId}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                                  item.collection?.documentId === collection.documentId
                                    ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <FolderOpen className="w-4 h-4" />
                                {collection.name}
                                {item.collection?.documentId === collection.documentId && (
                                  <span className="ml-auto text-xs text-gray-400">Current</span>
                                )}
                              </button>
                            ))}
                            {collections.length === 0 && (
                              <div className="px-4 py-2 text-sm text-gray-500">
                                No collections yet
                              </div>
                            )}
                            {/* Create new collection shortcut */}
                            <div className="border-t border-gray-100 mt-1 pt-1">
                              <button
                                onClick={() => {
                                  setMoveToCollectionOpen(null);
                                  setShowCreateModal(true);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Create New Collection
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.documentId)}
                        disabled={removingId === item.documentId}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove from Saved"
                      >
                        {removingId === item.documentId ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
                        ) : (
                          <Heart className="w-4 h-4 fill-current" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-100">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {activeFilter ? `No saved ${getTypeConfig(activeFilter).label.toLowerCase()}` : 'Nothing saved yet'}
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Save your favorite restaurants, guides, events, and more by clicking the heart icon on any listing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/directory/restaurants"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Restaurants
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Guides
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Marketplace
            </Link>
          </div>
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Collection</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewCollectionName('');
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                id="collectionName"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g., Favorites, To Visit, Gift Ideas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createCollection();
                }}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewCollectionName('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createCollection}
                disabled={!newCollectionName.trim() || savingCollection}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingCollection ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  'Create Collection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Collection Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rename Collection</h3>
              <button
                onClick={() => {
                  setShowRenameModal(null);
                  setRenameValue('');
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="renameCollection" className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                id="renameCollection"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') renameCollection();
                }}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRenameModal(null);
                  setRenameValue('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={renameCollection}
                disabled={!renameValue.trim() || savingCollection}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingCollection ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Collection Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Collection</h3>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              What would you like to do with the {getCollectionCount(showDeleteModal.documentId)} item(s) in &quot;{showDeleteModal.name}&quot;?
            </p>
            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="deleteOption"
                  value="move"
                  checked={deleteOption === 'move'}
                  onChange={() => setDeleteOption('move')}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-medium text-gray-900">Move items to Uncategorized</div>
                  <div className="text-sm text-gray-500">Items will be kept but won&apos;t belong to any collection</div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="deleteOption"
                  value="delete"
                  checked={deleteOption === 'delete'}
                  onChange={() => setDeleteOption('delete')}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-medium text-gray-900">Delete items too</div>
                  <div className="text-sm text-red-500">All items in this collection will be permanently removed</div>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteCollection}
                disabled={savingCollection}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingCollection ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  'Delete Collection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
