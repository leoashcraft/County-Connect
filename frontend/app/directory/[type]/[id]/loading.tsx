export default function DirectoryDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back link skeleton */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-6" />

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Image skeleton */}
            <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse" />

            {/* Content card skeleton */}
            <div className="bg-gray-50 rounded-2xl p-8 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save button skeleton */}
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />

            {/* Contact card skeleton */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
