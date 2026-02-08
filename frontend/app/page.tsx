import Link from 'next/link';
import { strapi } from '@/lib/strapi';
import {
  ShoppingBag, Briefcase, Building2, MapPin, Utensils,
  Church, Trophy, GraduationCap, Calendar, Heart, Home,
  Compass, Truck, ArrowRight, Star, Users, Sparkles
} from 'lucide-react';
import { HomeSearch } from '@/components/home-search';
import { HeroBackground } from '@/components/hero-background';
import { WeatherWidget } from '@/components/weather-widget';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const categories = [
  { title: 'Marketplace', description: 'Buy & sell locally', href: '/marketplace', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
  { title: 'Jobs & Gigs', description: 'Find opportunities', href: '/directory/jobs', icon: Briefcase, color: 'bg-green-100 text-green-600' },
  { title: 'Services', description: 'Local service providers', href: '/services', icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
  { title: 'Restaurants', description: 'Dining in Navarro County', href: '/directory/restaurants', icon: Utensils, color: 'bg-red-100 text-red-600' },
  { title: 'Real Estate', description: 'Homes & property', href: '/directory/real-estate', icon: Home, color: 'bg-amber-100 text-amber-600' },
  { title: 'Events', description: 'What\'s happening', href: '/directory/events', icon: Calendar, color: 'bg-pink-100 text-pink-600' },
  { title: 'Churches', description: 'Places of worship', href: '/directory/churches', icon: Church, color: 'bg-indigo-100 text-indigo-600' },
  { title: 'Schools', description: 'Education & childcare', href: '/directory/schools', icon: GraduationCap, color: 'bg-cyan-100 text-cyan-600' },
  { title: 'Sports Teams', description: 'Local athletics', href: '/directory/sports-teams', icon: Trophy, color: 'bg-orange-100 text-orange-600' },
  { title: 'Food Trucks', description: 'Mobile dining', href: '/directory/food-trucks', icon: Truck, color: 'bg-yellow-100 text-yellow-600' },
  { title: 'Community', description: 'Resources & support', href: '/directory/community-resources', icon: Heart, color: 'bg-rose-100 text-rose-600' },
  { title: 'Explore', description: 'Attractions & landmarks', href: '/directory/attractions', icon: Compass, color: 'bg-teal-100 text-teal-600' },
];

const stats = [
  { label: 'Residents', value: '52,000+', icon: Users },
  { label: 'Square Miles', value: '1,086', icon: MapPin },
  { label: 'Established', value: 'Since 1846', icon: Star },
];

export default async function HomePage() {
  // Fetch dynamic data from Strapi
  let towns: any[] = [];
  let restaurants: any[] = [];
  let events: any[] = [];
  let jobs: any[] = [];

  try {
    const [townsRes, restaurantsRes, eventsRes, jobsRes] = await Promise.all([
      strapi.towns.find({
        sort: 'population:desc',
        pagination: { pageSize: 50 },
        fields: ['name', 'slug', 'population'],
      }),
      strapi.directory.find('restaurants', {
        filters: { status: { $eq: 'active' } },
        sort: 'createdAt:desc',
        pagination: { pageSize: 4 },
        populate: ['town'],
      }).catch(() => ({ data: [] })),
      strapi.directory.find('events', {
        filters: { status: { $eq: 'upcoming' } },
        sort: 'startDate:asc',
        pagination: { pageSize: 3 },
        populate: ['town'],
      }).catch(() => ({ data: [] })),
      strapi.directory.find('jobs', {
        filters: { status: { $eq: 'active' } },
        sort: 'createdAt:desc',
        pagination: { pageSize: 4 },
        populate: ['town'],
      }).catch(() => ({ data: [] })),
    ]);

    towns = townsRes.data || [];
    restaurants = restaurantsRes.data || [];
    events = eventsRes.data || [];
    jobs = jobsRes.data || [];
  } catch (e) {
    // Silently fail — sections will be hidden if no data
  }

  const visibleTowns = towns.filter((t: any) => t.name !== 'County-wide');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroBackground
        imageUrl={`${STRAPI_URL}/uploads/hero_homepage_1d91226b7c.avif`}
        className="text-white px-6 flex items-center justify-center min-h-[450px] z-10"
      >
        {/* Weather Widget - Bottom Left on large screens */}
        <div className="hidden min-[1440px]:block absolute bottom-6 left-6">
          <WeatherWidget variant="glass" expandUp />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}>
            Welcome to Navarro County, TX
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-10" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}>
            Your independent community hub for local services, businesses, jobs, events, and everything Navarro County, Texas.
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <HomeSearch />
          </div>
          <p className="text-sm text-white/70 italic" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
            Not affiliated with Navarro County government.
          </p>
        </div>
      </HeroBackground>

      {/* Featured Local Sponsors */}
      <section className="py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Featured Local Sponsors
            </h2>
            <p className="text-gray-600">
              Support local businesses and discover trusted services in Navarro County.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Sponsored Business Cards (placeholders) */}
            {[1, 2, 3].map((spot) => (
              <div key={spot} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-2" />
                    <p className="text-brand-600 font-medium">Your Business Here</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Spot Available</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>Featured Business</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span className="px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full font-medium">Sponsored</span>
                    <span>Navarro County</span>
                  </div>
                  {spot === 1 ? (
                    <Link
                      href="/featured-spot?type=homepage-featured"
                      className="block w-full text-center py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Get Featured Here
                    </Link>
                  ) : (
                    <Link
                      href="/featured-spot?type=homepage-featured"
                      className="block w-full text-center py-2.5 border-2 border-brand-600 text-brand-600 font-medium rounded-lg hover:bg-brand-600 hover:text-white transition-colors"
                    >
                      Advertise Your Business
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Advertise CTA Banner */}
          <div className="text-center py-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Advertise Your Business</h3>
            <Link
              href="/featured-spot?type=homepage-featured"
              className="text-gray-600 hover:text-brand-600 text-sm font-medium inline-flex items-center gap-1"
            >
              Learn more about sponsorships <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats & Weather */}
      <section className="py-12 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
            {/* Weather Widget */}
            <div className="flex">
              <WeatherWidget variant="full" className="flex-1" />
            </div>

            {/* Stats */}
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6 text-center flex flex-col items-center justify-center">
                <stat.icon className="w-8 h-8 text-brand-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 px-6 bg-brand-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Explore Navarro County
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Located in the heart of Central Texas, Navarro County offers the perfect blend of small-town charm and modern conveniences. Just 50 miles south of Dallas, our county is home to Corsicana and over 20 unique communities.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group bg-white rounded-xl border-2 border-gray-100 hover:border-brand-300 hover:shadow-lg p-6 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors mb-1">
                  {cat.title}
                </h3>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">About Navarro County</h3>
              <p className="text-gray-700 mb-4">
                Navarro County provides an exceptional quality of life with affordable housing,
                excellent schools, and a strong sense of community. Whether you&apos;re looking for a place to
                raise a family, start a business, or enjoy retirement, our welcoming communities offer
                something for everyone.
              </p>
              <p className="text-gray-700">
                From the historic downtown of Corsicana to the peaceful countryside surrounding our
                smaller towns, residents enjoy access to local restaurants, community events, places of
                worship, and outdoor recreation at nearby lakes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Navarro County?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Affordable Cost of Living</strong> &mdash; Lower housing costs and taxes compared to nearby metropolitan areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Easy Commute to Dallas</strong> &mdash; Interstate 45 provides quick access to DFW job markets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Quality Education</strong> &mdash; Multiple school districts and Navarro College for higher education</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Outdoor Recreation</strong> &mdash; World-class fishing at Richland-Chambers Reservoir and Navarro Mills Lake</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      {restaurants.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Utensils className="w-6 h-6 text-red-500" />
                Local Restaurants
              </h2>
              <Link href="/directory/restaurants" className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {restaurants.map((restaurant: any) => (
                <Link
                  key={restaurant.documentId || restaurant.id}
                  href={`/directory/restaurants/${restaurant.slug || restaurant.documentId}`}
                  className="bg-white rounded-xl border hover:shadow-lg transition-shadow"
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{restaurant.name}</h3>
                    {restaurant.cuisine && (
                      <p className="text-sm text-gray-500 truncate">{restaurant.cuisine}</p>
                    )}
                    {restaurant.town?.name && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {restaurant.town.name}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-12 px-6 bg-pink-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-pink-500" />
                Upcoming Events
              </h2>
              <Link href="/directory/events" className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {events.map((event: any) => (
                <Link
                  key={event.documentId || event.id}
                  href={`/directory/events/${event.slug || event.documentId}`}
                  className="bg-white rounded-xl border hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 flex items-start gap-3">
                    <div className="bg-pink-100 text-pink-700 rounded-lg p-2 text-center min-w-[50px]">
                      <div className="text-xs font-medium">
                        {event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' }) : ''}
                      </div>
                      <div className="text-xl font-bold">
                        {event.startDate ? new Date(event.startDate).getDate() : ''}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                      {event.location && (
                        <p className="text-sm text-gray-500 truncate">{event.location}</p>
                      )}
                      {event.town?.name && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {event.town.name}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Jobs */}
      {jobs.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-green-500" />
                Job Opportunities
              </h2>
              <Link href="/directory/jobs" className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map((job: any) => (
                <Link
                  key={job.documentId || job.id}
                  href={`/directory/jobs/${job.slug || job.documentId}`}
                  className="bg-white rounded-xl border hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      {job.company && (
                        <p className="text-sm text-gray-600">{job.company}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        {job.town?.name && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {job.town.name}
                          </span>
                        )}
                        {job.jobType && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            {job.jobType}
                          </span>
                        )}
                      </div>
                    </div>
                    {job.salary && (
                      <span className="text-sm font-medium text-green-600 whitespace-nowrap">{job.salary}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Resources CTA */}
      <section className="py-12 px-6 bg-rose-50">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Community Resources &amp; Assistance
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Find food pantries, shelters, utility assistance, and other support services
            available to Navarro County residents.
          </p>
          <Link
            href="/directory/community-resources"
            className="inline-flex items-center gap-2 px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-colors"
          >
            Find Help &amp; Resources
          </Link>
        </div>
      </section>

      {/* Cities & Communities */}
      {visibleTowns.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <MapPin className="w-6 h-6 text-brand-600" />
                Cities &amp; Communities
              </h2>
              <p className="text-gray-600 mt-2">
                Explore the towns and cities of Navarro County
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {visibleTowns.map((town: any) => (
                <Link
                  key={town.documentId || town.id}
                  href={`/${town.slug}`}
                  className="group bg-white rounded-xl border hover:border-brand-300 hover:shadow-lg transition-all"
                >
                  <div className="p-4 text-center">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-brand-200 transition-colors">
                      <MapPin className="w-5 h-5 text-brand-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{town.name}</h3>
                    {town.population && (
                      <p className="text-xs text-gray-500 mt-1">
                        {town.population.toLocaleString()} residents
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-brand-100 to-brand-200">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-12 h-12 text-brand-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Serving Navarro County, Texas
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Corsicana, Kerens, Blooming Grove, Dawson, Frost, Rice, Angus, Eureka, Goodlow, Emhouse, Richland, Mildred, and surrounding communities.
          </p>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-700 to-brand-500 text-white rounded-xl font-semibold hover:from-brand-800 hover:to-brand-600 transition-all"
          >
            Find Local Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* SEO Footer Links */}
      <section className="py-8 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Popular Searches</h3>
              <ul className="space-y-1">
                <li><Link href="/directory/restaurants" className="hover:text-brand-600">Restaurants in Corsicana</Link></li>
                <li><Link href="/directory/jobs" className="hover:text-brand-600">Jobs in Navarro County</Link></li>
                <li><Link href="/directory/churches" className="hover:text-brand-600">Churches near me</Link></li>
                <li><Link href="/directory/events" className="hover:text-brand-600">Events this weekend</Link></li>
                <li><Link href="/directory/real-estate" className="hover:text-brand-600">Homes for sale</Link></li>
                <li><Link href="/directory/schools" className="hover:text-brand-600">Schools in Navarro County</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Services</h3>
              <ul className="space-y-1">
                <li><Link href="/directory/community-resources" className="hover:text-brand-600">Food Pantries</Link></li>
                <li><Link href="/guides/daycare" className="hover:text-brand-600">Daycare &amp; Childcare</Link></li>
                <li><Link href="/guides/tutoring" className="hover:text-brand-600">Tutoring Services</Link></li>
                <li><Link href="/guides/notary" className="hover:text-brand-600">Notary Public</Link></li>
                <li><Link href="/guides/tax-preparer" className="hover:text-brand-600">Tax Preparation</Link></li>
                <li><Link href="/directory/public-services" className="hover:text-brand-600">Public Services</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-2">Towns in Navarro County</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                {visibleTowns.map((town: any) => (
                  <li key={town.documentId || town.id}>
                    <Link href={`/${town.slug}`} className="hover:text-brand-600">
                      {town.name}, TX
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
