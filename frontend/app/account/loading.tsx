export default function AccountLoading() {
  return (
    <div className="bg-white rounded-xl p-8 min-h-[60vh]">
      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-96" />
      </div>

      {/* Profile card skeleton */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-40" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-56" />
          </div>
        </div>
      </div>

      {/* Tiles grid skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse" />
              <div className="w-5 h-5 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
