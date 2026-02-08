'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useRef, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Tag, ArrowUpDown, Check } from 'lucide-react';

function FiltersContent({ categories }: { categories: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openDropdown, setOpenDropdown] = useState<'category' | 'sort' | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryBtnRef = useRef<HTMLButtonElement>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update dropdown position when opened
  useEffect(() => {
    if (openDropdown && containerRef.current) {
      // Find the search bar container (parent form's first div)
      const searchBar = containerRef.current.closest('form')?.querySelector('div');
      if (searchBar) {
        const searchBarRect = searchBar.getBoundingClientRect();
        const btnRef = openDropdown === 'category' ? categoryBtnRef : sortBtnRef;
        const btnRect = btnRef.current?.getBoundingClientRect();

        if (btnRect) {
          setDropdownPosition({
            top: btnRect.bottom + window.scrollY,
            left: btnRect.left + window.scrollX,
            width: searchBarRect.right - btnRect.left,
          });
        }
      }
    }
  }, [openDropdown]);

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) current.delete(key);
        else current.set(key, value);
      });
      current.delete('page');
      return current.toString();
    },
    [searchParams]
  );

  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sort') || 'title:asc';
  const categoryLabel = currentCategory ? categories.find(c => c.slug === currentCategory)?.name || 'All Categories' : 'All Categories';

  const sortOptions = [
    { value: 'title:asc', label: 'A–Z' },
    { value: 'title:desc', label: 'Z–A' },
    { value: 'createdAt:desc', label: 'Newest' },
    { value: 'createdAt:asc', label: 'Oldest' },
  ];
  const sortLabel = sortOptions.find(s => s.value === currentSort)?.label || 'A–Z';

  const handleCategorySelect = (slug: string | null) => {
    const qs = createQueryString({ category: slug });
    router.push(`${pathname}${qs ? `?${qs}` : ''}`);
    setOpenDropdown(null);
  };

  const handleSortSelect = (value: string) => {
    const qs = createQueryString({ sort: value });
    router.push(`${pathname}${qs ? `?${qs}` : ''}`);
    setOpenDropdown(null);
  };

  const categoryDropdown = openDropdown === 'category' && mounted && createPortal(
    <div
      className="absolute bg-white rounded-[2rem] shadow-lg overflow-hidden z-0"
      style={{
        top: dropdownPosition.top - 56,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
      }}
    >
      {/* Spacer for button area */}
      <div className="h-14" />
      {/* Dropdown content */}
      <div className="max-h-64 overflow-y-auto">
        <button
          type="button"
          onClick={() => handleCategorySelect(null)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${!currentCategory ? 'bg-gray-50' : ''}`}
        >
          <Tag className="w-5 h-5 text-gray-400" />
          <span className="flex-1 text-gray-700">All Categories</span>
          {!currentCategory && <Check className="w-4 h-4 text-blue-600" />}
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => handleCategorySelect(category.slug)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${currentCategory === category.slug ? 'bg-gray-50' : ''}`}
          >
            <Tag className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-gray-700">{category.name}</span>
            {currentCategory === category.slug && <Check className="w-4 h-4 text-blue-600" />}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );

  const sortDropdown = openDropdown === 'sort' && mounted && createPortal(
    <div
      className="absolute bg-white rounded-[2rem] shadow-lg overflow-hidden z-0"
      style={{
        top: dropdownPosition.top - 56,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
      }}
    >
      {/* Spacer for button area */}
      <div className="h-14" />
      {/* Dropdown content */}
      <div>
        {sortOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSortSelect(option.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${currentSort === option.value ? 'bg-gray-50' : ''}`}
          >
            <ArrowUpDown className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-gray-700">{option.label}</span>
            {currentSort === option.value && <Check className="w-4 h-4 text-blue-600" />}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );

  return (
    <div ref={containerRef} className="flex items-center relative">
      {categoryDropdown}
      {sortDropdown}

      {/* Category Filter */}
      <div className="relative border-l border-gray-200">
        <button
          ref={categoryBtnRef}
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
          className="relative z-10 flex items-center gap-2 px-4 py-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors bg-white"
        >
          <span className="hidden sm:inline">{categoryLabel}</span>
          <span className="sm:hidden">Category</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Sort Filter */}
      <div className="relative border-l border-gray-200">
        <button
          ref={sortBtnRef}
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
          className="relative z-10 flex items-center gap-2 px-4 py-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors bg-white"
        >
          <span className="hidden sm:inline">Sort: {sortLabel}</span>
          <span className="sm:hidden">Sort</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}

export function MarketplaceFilters({ categories }: { categories: any[] }) {
  return (
    <Suspense fallback={<div className="h-14 w-48 bg-gray-100 animate-pulse" />}>
      <FiltersContent categories={categories} />
    </Suspense>
  );
}
