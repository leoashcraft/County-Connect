export default function DirectoryLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="h-64 bg-gray-200 animate-pulse" />

      {/* Featured sponsor skeleton */}
      <section className="py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border-2 border-gray-100 overflow-hidden">
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
