'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Utensils,
  Briefcase,
  ShoppingBag,
  BookOpen,
  Calendar,
  Home,
  Church,
  GraduationCap,
  Heart,
  Compass,
  Globe,
} from 'lucide-react';

const SEARCH_CATEGORIES = [
  { value: 'all', label: 'Search All', action: '/search', icon: Globe },
  { value: 'restaurants', label: 'Restaurants', action: '/directory/restaurants', icon: Utensils },
  { value: 'jobs', label: 'Jobs & Gigs', action: '/directory/jobs', icon: Briefcase },
  { value: 'marketplace', label: 'Marketplace', action: '/marketplace', icon: ShoppingBag },
  { value: 'guides', label: 'Local Guides', action: '/guides', icon: BookOpen },
  { value: 'events', label: 'Events', action: '/directory/events', icon: Calendar },
  { value: 'real-estate', label: 'Real Estate', action: '/directory/real-estate', icon: Home },
  { value: 'churches', label: 'Churches', action: '/directory/churches', icon: Church },
  { value: 'schools', label: 'Schools', action: '/directory/schools', icon: GraduationCap },
  { value: 'community-resources', label: 'Community Resources', action: '/directory/community-resources', icon: Heart },
  { value: 'attractions', label: 'Attractions', action: '/directory/attractions', icon: Compass },
];

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (category: typeof SEARCH_CATEGORIES[0]) => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('search', query.trim());
    }

    const url = params.toString()
      ? `${category.action}?${params.toString()}`
      : category.action;

    setIsOpen(false);
    router.push(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to search all
    handleSearch(SEARCH_CATEGORIES[0]);
  };

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto relative z-20">
      {/* Custom Dropdown - rendered first so it's behind the search bar */}
      {isOpen && (
        <div className="absolute top-0 left-0 right-0 z-0 bg-white rounded-[2rem] shadow-lg overflow-hidden">
          {/* Spacer for search bar area */}
          <div className="h-14" />
          {/* Dropdown content */}
          <div>
            {SEARCH_CATEGORIES.map((category, index) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleSearch(category)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors ${
                  index !== SEARCH_CATEGORIES.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <category.icon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search bar - on top */}
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="flex items-center bg-white shadow-lg rounded-full">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="Search businesses, restaurants, services..."
              className="w-full px-5 py-4 pl-14 text-gray-900 bg-transparent focus:outline-none text-lg"
            />
          </div>
          <button
            type="submit"
            className="w-12 h-12 mr-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
