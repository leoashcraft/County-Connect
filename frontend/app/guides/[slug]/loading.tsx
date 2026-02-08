export default function GuideDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="h-80 bg-emerald-100 animate-pulse" />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-2xl p-8 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-emerald-50 rounded-2xl p-6 space-y-4">
              <div className="h-5 bg-emerald-200 rounded animate-pulse w-1/2" />
              <div className="space-y-2">
                <div className="h-4 bg-emerald-100 rounded animate-pulse" />
                <div className="h-4 bg-emerald-100 rounded animate-pulse w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
