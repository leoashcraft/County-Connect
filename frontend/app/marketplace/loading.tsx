export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="h-64 bg-blue-100 animate-pulse" />

      {/* Filters skeleton */}
      <section className="py-6 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex gap-4">
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-32" />
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-32" />
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-32" />
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border-2 border-gray-100 overflow-hidden">
                <div className="aspect-square bg-blue-50 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-blue-200 rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
