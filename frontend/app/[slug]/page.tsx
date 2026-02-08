import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { strapi } from '@/lib/strapi';
import { EditPageButton } from '@/components/edit-page-button';
import {
  MapPin, Users, ChevronRight, ArrowLeft,
  Utensils, GraduationCap, Church, Briefcase, Calendar,
  Heart, Truck, ShoppingBag, Trophy, Compass, Home, Building2
} from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function generateStaticParams() {
  try {
    const res = await strapi.towns.find({ fields: ['slug'] });
    return (res.data || []).map((town: any) => ({ slug: town.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await strapi.towns.findBySlug(slug);
    const town = res.data?.[0];
    if (!town) return { title: 'Not Found' };
    const plainDesc = town.description?.replace(/##?\s.*\n?/g, '').replace(/\n+/g, ' ').trim().slice(0, 160);
    return {
      title: `${town.name}, Texas - Local Guide | Navarro County`,
      description: plainDesc || `Explore ${town.name}, Texas. Restaurants, schools, churches, jobs, events, and community resources in Navarro County.`,
    };
  } catch {
    return { title: 'Not Found' };
  }
}

// Parse the description markdown into sections
function parseTownDescription(description: string) {
  const sections: { title: string; content: string }[] = [];
  let intro = '';

  if (!description) return { intro, sections };

  const lines = description.split('\n');
  let currentTitle = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)/);
    if (headingMatch) {
      if (currentTitle) {
        sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
      } else if (currentContent.length > 0) {
        intro = currentContent.join('\n').trim();
      }
      currentTitle = headingMatch[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Push last section
  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
  } else if (!intro && currentContent.length > 0) {
    intro = currentContent.join('\n').trim();
  }

  return { intro, sections };
}

const DIRECTORY_LINKS = [
  { title: 'Restaurants', href: '/directory/restaurants', icon: Utensils, color: 'bg-red-100 text-red-600' },
  { title: 'Schools', href: '/directory/schools', icon: GraduationCap, color: 'bg-cyan-100 text-cyan-600' },
  { title: 'Churches', href: '/directory/churches', icon: Church, color: 'bg-indigo-100 text-indigo-600' },
  { title: 'Jobs & Gigs', href: '/directory/jobs', icon: Briefcase, color: 'bg-sky-100 text-sky-600' },
  { title: 'Events', href: '/directory/events', icon: Calendar, color: 'bg-pink-100 text-pink-600' },
  { title: 'Food Trucks', href: '/directory/food-trucks', icon: Truck, color: 'bg-yellow-100 text-yellow-600' },
  { title: 'Sports Teams', href: '/directory/sports-teams', icon: Trophy, color: 'bg-emerald-100 text-emerald-600' },
  { title: 'Community Resources', href: '/directory/community-resources', icon: Heart, color: 'bg-teal-100 text-teal-600' },
  { title: 'Businesses', href: '/directory/businesses', icon: Building2, color: 'bg-blue-100 text-blue-600' },
  { title: 'Real Estate', href: '/directory/real-estate', icon: Home, color: 'bg-amber-100 text-amber-600' },
  { title: 'Attractions', href: '/directory/attractions', icon: Compass, color: 'bg-violet-100 text-violet-600' },
  { title: 'Marketplace', href: '/marketplace', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
];

export default async function TownPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let town: any = null;
  try {
    const res = await strapi.towns.findBySlug(slug);
    town = res.data?.[0];
  } catch {}

  if (!town) notFound();

  const { intro, sections } = parseTownDescription(town.description || '');
  const historySection = sections.find(s => s.title === 'History');
  const knownForSection = sections.find(s => s.title === 'Known For');
  const gettingAroundSection = sections.find(s => s.title === 'Getting Around');

  // Parse "Known For" into tags
  const knownForTags = knownForSection?.content
    ?.split(',')
    .map((t: string) => t.trim())
    .filter(Boolean) || [];

  const sizeLabel = town.population >= 10000 ? 'city' : town.population >= 1000 ? 'town' : 'community';

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{town.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative text-white py-12 px-6 bg-cover bg-center"
        style={{ backgroundImage: `url('${STRAPI_URL}/uploads/bluebonnets_4f6ab757d6.avif')` }}
      >
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-4" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6)' }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4)' }}>
            <MapPin className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-bold">{town.name}</h1>
          </div>
          <p className="text-white text-lg" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 12px 48px rgba(0,0,0,0.5)' }}>Navarro County, Texas</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {town.population && (
            <div className="bg-white rounded-2xl border-2 border-brand-100 p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-brand-600" />
              <p className="text-2xl font-bold text-gray-900">{town.population.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Population</p>
            </div>
          )}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 text-center">
            <MapPin className="w-6 h-6 mx-auto mb-2 text-brand-600" />
            <p className="text-2xl font-bold text-gray-900">Navarro</p>
            <p className="text-sm text-gray-600">County</p>
          </div>
          {town.zipCodes && (
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 text-center">
              <Building2 className="w-6 h-6 mx-auto mb-2 text-brand-600" />
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(town.zipCodes) ? town.zipCodes.join(', ') : town.zipCodes}
              </p>
              <p className="text-sm text-gray-600">Zip Code</p>
            </div>
          )}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 text-center">
            <Compass className="w-6 h-6 mx-auto mb-2 text-brand-600" />
            <p className="text-2xl font-bold text-gray-900">TX</p>
            <p className="text-sm text-gray-600">State</p>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-brand-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {town.name}</h2>
          {town.population && (
            <p className="text-gray-600 mb-4">
              <span className="font-semibold text-gray-800">{town.name}</span> is a {sizeLabel} of{' '}
              <span className="font-semibold text-gray-800">{town.population.toLocaleString()} residents</span> in Navarro County, Texas.
            </p>
          )}
          {intro && (
            <div className="prose max-w-none text-gray-700">
              <ReactMarkdown>{intro}</ReactMarkdown>
            </div>
          )}
          {knownForTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm font-medium text-gray-600">Known for:</span>
              {knownForTags.map((tag: string, i: number) => (
                <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        {historySection && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-amber-600">&#x1f4dc;</span> History of {town.name}
            </h2>
            <div className="prose max-w-none text-gray-700">
              <ReactMarkdown>{historySection.content}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Getting Around */}
        {gettingAroundSection && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Getting Around
            </h2>
            <div className="prose max-w-none text-gray-700">
              <ReactMarkdown>{gettingAroundSection.content}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Explore Directory */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Explore {town.name}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DIRECTORY_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-xl border-2 border-gray-100 hover:border-brand-300 hover:shadow-md p-5 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Browse in {town.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Services CTA */}
        <div className="bg-gradient-to-r from-brand-100 to-brand-200 rounded-2xl p-8 border-2 border-brand-200 text-center">
          <MapPin className="w-12 h-12 text-brand-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Find Guides for {town.name}
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Browse over 300 local guides available to {town.name} residents — from government services to healthcare and more.
          </p>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-700 to-brand-500 hover:from-brand-800 hover:to-brand-600 text-white rounded-xl font-semibold transition-all"
          >
            Browse All Guides
          </Link>
        </div>
        {town.documentId && (
          <EditPageButton contentType="api::town.town" documentId={town.documentId} />
        )}
      </div>
    </div>
  );
}
