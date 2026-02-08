import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { strapi } from '@/lib/strapi';
import { ChevronRight, MapPin, Tag, User, Calendar, ArrowLeft, ShoppingBag, MessageSquare } from 'lucide-react';
import { ContactSellerButton } from './contact';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await strapi.marketplace.findOne(Number(id));
    const listing = res.data;
    if (!listing) return { title: 'Listing Not Found' };
    return {
      title: listing.title,
      description: listing.description?.slice(0, 160),
    };
  } catch {
    return { title: 'Listing Not Found' };
  }
}

export default async function MarketplaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let listing: any = null;
  try {
    const res = await strapi.marketplace.findOne(Number(id));
    listing = res.data;
  } catch (error) {
    console.error('Error fetching listing:', error);
  }

  if (!listing) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/marketplace" className="hover:text-orange-600">Marketplace</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium line-clamp-1">{listing.title}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
              {listing.images?.[0] ? (
                <img
                  src={listing.images[0].url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-gray-200" />
                </div>
              )}
            </div>
            {listing.images && listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.slice(1, 5).map((img: any, i: number) => (
                  <div key={i} className="aspect-square bg-white rounded-lg border border-gray-100 overflow-hidden">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <p className="text-3xl font-bold text-blue-600">
                ${Number(listing.price).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {listing.condition && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  <Tag className="w-3.5 h-3.5" />
                  {listing.condition}
                </span>
              )}
              {listing.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700">
                  {listing.category.name}
                </span>
              )}
              {listing.location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full text-sm text-green-700">
                  <MapPin className="w-3.5 h-3.5" />
                  {listing.location}
                </span>
              )}
            </div>

            {listing.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
                <div className="text-gray-700 whitespace-pre-line">{listing.description}</div>
              </div>
            )}

            {listing.seller && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Seller</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{listing.seller.username || listing.seller.email}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Listed {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <ContactSellerButton listing={listing} />
          </div>
        </div>
      </main>
    </div>
  );
}
