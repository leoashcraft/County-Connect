import { Metadata } from 'next';
import Link from 'next/link';
import { strapi } from '@/lib/strapi';
import { MessageSquare, Plus, User, Clock, Eye, Pin, Lock, Search } from 'lucide-react';
import { FeaturedSponsor } from '@/components/featured-sponsor';
import { HeroBackground } from '@/components/hero-background';
import { WeatherWidget } from '@/components/weather-widget';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const metadata: Metadata = {
  title: 'Community Forum',
  description: 'Join the conversation in the Navarro County community forum.',
};

export default async function ForumPage() {
  let posts: any[] = [];
  let categories: any[] = [];

  try {
    const [postsRes, catsRes] = await Promise.all([
      strapi.forum.posts({
        populate: ['author', 'category'],
        sort: ['isPinned:desc', 'createdAt:desc'],
        pagination: { pageSize: 25 },
      }),
      strapi.forum.categories(),
    ]);
    posts = postsRes.data || [];
    categories = catsRes.data || [];
  } catch (error) {
    console.error('Error fetching forum:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <HeroBackground
        imageUrl={`${STRAPI_URL}/uploads/hero_townsquare_6f590aa6b6.avif`}
        className="text-white px-6 flex items-center justify-center py-16"
        fallbackColor="bg-purple-700"
      >
        {/* Weather Widget - Top Left on large screens */}
        <div className="hidden min-[1440px]:block absolute top-4 left-4 md:top-6 md:left-6">
          <WeatherWidget variant="glass" />
        </div>

        {/* New Post Button - Top Right */}
        <Link
          href="/community/forum/new"
          className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl text-white text-sm md:text-base font-medium hover:bg-white/30 transition-colors"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          New Post
        </Link>

        <div className="max-w-4xl mx-auto text-center w-full">
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}
          >
            Community Forum
          </h1>
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}
          >
            Connect with your neighbors in Navarro County
          </p>

          {/* Search Bar */}
          <form action="/search" method="get" className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search forum posts..."
                  className="w-full px-5 py-4 pl-12 text-gray-900 bg-transparent focus:outline-none text-lg rounded-full"
                />
              </div>
              <button
                type="submit"
                className="w-12 h-12 mr-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </HeroBackground>

      <FeaturedSponsor
        href="/featured-spot?type=directory-featured&page=/community/forum"
        label="FEATURED SPONSOR"
        title="Advertise Your Business"
        description="Reach the Navarro County community"
        gradientClass="from-purple-50 to-purple-100"
        borderClass="border-purple-200"
        sideBgClass="bg-purple-100"
        textClass="text-purple-600"
        buttonBgClass="bg-purple-600"
        buttonHoverClass="hover:bg-purple-700"
      />

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">All</span>
              {categories.map((cat: any) => (
                <span key={cat.id} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Posts */}
          <div className="space-y-3">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/community/forum/${post.id}`}
                className="block bg-white rounded-xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-md p-5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {post.isPinned && <Pin className="w-4 h-4 text-amber-500" />}
                      {post.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                      <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {post.author && <span>{post.author.username || post.author.email}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.viewCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {post.viewCount}
                        </span>
                      )}
                      {post.category && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{post.category.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h2>
                <p className="text-gray-500 mb-6">Be the first to start a conversation!</p>
                <Link
                  href="/community/forum/new"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
