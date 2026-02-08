export default function SavedLoading() {
  return (
    <div className="bg-white rounded-xl p-8 min-h-[60vh]">
      {/* Header skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-32" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="h-10 bg-gray-200 rounded-full animate-pulse w-20" />
        <div className="h-10 bg-gray-100 rounded-full animate-pulse w-28" />
        <div className="h-10 bg-gray-100 rounded-full animate-pulse w-24" />
      </div>

      {/* Grid skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-xl border-2 border-gray-100 overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="h-4 bg-pink-200 rounded animate-pulse w-24" />
                <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
