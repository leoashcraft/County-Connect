import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { strapi } from '@/lib/strapi';
import {
  ChevronRight, MapPin, Phone, Mail, Globe, Clock, Star,
  CheckCircle, HelpCircle, ExternalLink, ArrowRight,
  AlertTriangle, Home, Wrench, Briefcase, Heart, Car, Music,
  Utensils, Leaf, Hammer, Scissors, GraduationCap, ShoppingBag,
  Bed, Factory
} from 'lucide-react';
import { ServicePageClient } from './client';
import { EditPageButton } from '@/components/edit-page-button';

// ISR: revalidate every 24 hours
export const revalidate = 86400;

// Icon mapping
const ICON_MAP: Record<string, any> = {
  Home, Wrench, Briefcase, Heart, Car, Music, Utensils, Leaf, Hammer, Scissors,
  GraduationCap, ShoppingBag, Bed, Factory, CheckCircle, Star, MapPin, Clock,
};

const COLOR_MAP: Record<string, string> = {
  slate: 'text-slate-600', gray: 'text-gray-600', red: 'text-red-600',
  orange: 'text-orange-600', amber: 'text-amber-600', yellow: 'text-yellow-600',
  lime: 'text-lime-600', green: 'text-green-600', emerald: 'text-emerald-600',
  teal: 'text-teal-600', cyan: 'text-cyan-600', sky: 'text-sky-600',
  blue: 'text-blue-600', indigo: 'text-indigo-600', violet: 'text-violet-600',
  purple: 'text-purple-600', fuchsia: 'text-fuchsia-600', pink: 'text-pink-600',
  rose: 'text-rose-600',
};

const BG_COLOR_MAP: Record<string, string> = {
  slate: 'bg-slate-100', gray: 'bg-gray-100', red: 'bg-red-100',
  orange: 'bg-orange-100', amber: 'bg-amber-100', yellow: 'bg-yellow-100',
  lime: 'bg-lime-100', green: 'bg-green-100', emerald: 'bg-emerald-100',
  teal: 'bg-teal-100', cyan: 'bg-cyan-100', sky: 'bg-sky-100',
  blue: 'bg-blue-100', indigo: 'bg-indigo-100', violet: 'bg-violet-100',
  purple: 'bg-purple-100', fuchsia: 'bg-fuchsia-100', pink: 'bg-pink-100',
  rose: 'bg-rose-100',
};

// Generate static params for all service pages
export async function generateStaticParams() {
  try {
    const res = await strapi.servicePages.find({
      filters: { status: { $eq: 'active' } },
      fields: ['slug'],
      pagination: { pageSize: 500 },
    });
    return (res.data || []).map((page: any) => ({ slug: page.slug }));
  } catch {
    return [];
  }
}

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await strapi.servicePages.findBySlug(slug);
    const page = res.data?.[0];

    if (!page) return { title: 'Service Not Found' };

    return {
      title: page.metaTitle || `${page.title} in Navarro County, TX`,
      description: page.metaDescription || `Find ${page.title.toLowerCase()} services in Navarro County, Texas.`,
      keywords: page.metaKeywords,
      alternates: {
        canonical: `/guides/${page.slug}`,
      },
      openGraph: {
        title: page.metaTitle || page.title,
        description: page.metaDescription,
        type: 'website',
        url: `/guides/${page.slug}`,
      },
    };
  } catch {
    return { title: 'Service Not Found' };
  }
}

// Custom ReactMarkdown components
const markdownComponents = {
  p: ({ children }: any) => {
    const childArray = Array.isArray(children) ? children : [children];
    if (childArray.length === 1 && typeof childArray[0] === 'object' && childArray[0]?.type === 'strong') {
      return <h4 className="font-semibold text-gray-900 mt-6 mb-2 first:mt-0">{childArray[0].props.children}</h4>;
    }
    return <p className="mb-3">{children}</p>;
  },
  ul: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
  li: ({ children }: any) => <li className="text-gray-700">{children}</li>,
  strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
  a: ({ href, children }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
      {children}
    </a>
  ),
};

// JSON-LD Schema generation
function generateSchema(page: any, claimedBusiness?: any) {
  const schemas: any[] = [];

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    description: page.metaDescription,
    areaServed: {
      '@type': 'County',
      name: 'Navarro County',
      containedIn: { '@type': 'State', name: 'Texas' },
    },
    ...(claimedBusiness ? {
      provider: {
        '@type': 'LocalBusiness',
        name: claimedBusiness.name,
        telephone: claimedBusiness.phone,
        address: {
          '@type': 'PostalAddress',
          addressLocality: claimedBusiness.city || 'Corsicana',
          addressRegion: 'TX',
        },
      },
    } : {}),
  });

  if (page.faqs && page.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq: any) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return schemas;
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let page: any = null;
  let relatedPages: any[] = [];

  try {
    const res = await strapi.servicePages.findBySlug(slug);
    page = res.data?.[0];
  } catch (error) {
    console.error('Error fetching service page:', error);
  }

  if (!page || page.status !== 'active') {
    notFound();
  }

  // Load related services
  if (page.relatedServices && page.relatedServices.length > 0) {
    try {
      // relatedServices could be slugs or relation objects
      const relatedSlugs = page.relatedServices.map((r: any) => typeof r === 'string' ? r : r.slug).filter(Boolean);
      if (relatedSlugs.length > 0) {
        const relRes = await strapi.servicePages.find({
          filters: { slug: { $in: relatedSlugs }, status: { $eq: 'active' } },
          fields: ['title', 'slug', 'icon', 'iconColor'],
          pagination: { pageSize: 4 },
        });
        relatedPages = relRes.data || [];
      }
    } catch (e) {
      console.log('Could not load related pages');
    }
  }

  const IconComponent = ICON_MAP[page.icon] || Briefcase;
  const iconColor = COLOR_MAP[page.iconColor] || 'text-brand-600';
  const bgColor = BG_COLOR_MAP[page.iconColor] || 'bg-brand-100';
  const schemas = generateSchema(page);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-brand-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/guides" className="hover:text-brand-600">Guides</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{page.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Content - Render based on layout */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {page.layout === 2 ? (
            <LayoutSplit page={page} IconComponent={IconComponent} iconColor={iconColor} bgColor={bgColor} relatedPages={relatedPages} />
          ) : page.layout === 3 ? (
            <LayoutCards page={page} IconComponent={IconComponent} iconColor={iconColor} bgColor={bgColor} relatedPages={relatedPages} />
          ) : page.layout === 4 ? (
            <LayoutTimeline page={page} IconComponent={IconComponent} iconColor={iconColor} bgColor={bgColor} relatedPages={relatedPages} />
          ) : page.layout === 5 ? (
            <LayoutMagazine page={page} IconComponent={IconComponent} iconColor={iconColor} bgColor={bgColor} relatedPages={relatedPages} />
          ) : (
            <LayoutStandard page={page} IconComponent={IconComponent} iconColor={iconColor} bgColor={bgColor} relatedPages={relatedPages} />
          )}
        </main>
        {page.documentId && (
          <EditPageButton contentType="api::service-page.service-page" documentId={page.documentId} />
        )}
      </div>
    </>
  );
}

// Shared props type
interface LayoutProps {
  page: any;
  IconComponent: any;
  iconColor: string;
  bgColor: string;
  relatedPages: any[];
}

// ===== Layout 1: Standard =====
function LayoutStandard({ page, IconComponent, iconColor, bgColor, relatedPages }: LayoutProps) {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-brand-100">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-4 rounded-xl ${bgColor}`}>
            <IconComponent className={`w-8 h-8 ${iconColor}`} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{page.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Navarro County, Texas</span>
            </div>
          </div>
        </div>
        <div className="prose prose-lg max-w-none text-gray-700">
          <ReactMarkdown components={markdownComponents}>{page.heroContent}</ReactMarkdown>
        </div>
      </section>

      {page.localContext && (
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-600" />
            Why This Matters in Navarro County
          </h2>
          <div className="prose max-w-none text-gray-700">
            <ReactMarkdown components={markdownComponents}>{page.localContext}</ReactMarkdown>
          </div>
        </section>
      )}

      {page.sections?.map((section: any, index: number) => (
        <section key={index} className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
          <div className="prose max-w-none text-gray-700">
            <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
          </div>
        </section>
      ))}

      <FAQSection faqs={page.faqs} />
      <ClaimCTA page={page} />
      <RelatedServices relatedPages={relatedPages} />
      <ExternalResources resources={page.externalResources} />
    </div>
  );
}

// ===== Layout 2: Split =====
function LayoutSplit({ page, IconComponent, iconColor, bgColor, relatedPages }: LayoutProps) {
  return (
    <div className="space-y-8">
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8 border-2 border-brand-100">
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-4 rounded-xl ${bgColor}`}>
              <IconComponent className={`w-8 h-8 ${iconColor}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{page.title}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Navarro County, TX
              </span>
            </div>
          </div>
          <div className="prose max-w-none text-gray-700">
            <ReactMarkdown components={markdownComponents}>{page.heroContent}</ReactMarkdown>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-brand-50 rounded-2xl border-2 border-brand-200 p-6 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-brand-600" />
            <p className="text-sm text-gray-700 mb-4">
              Are you a {page.title.toLowerCase()} service provider in Navarro County?
            </p>
            <Link
              href={`/guides/${page.slug}/inquiry`}
              className="block w-full px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors text-center"
            >
              Claim This Page
            </Link>
          </div>

          {page.localContext && (
            <div className="bg-white rounded-2xl border-2 border-amber-200 p-5">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-amber-600" />
                Local Info
              </h3>
              <div className="text-sm text-gray-600 line-clamp-6">
                <ReactMarkdown components={markdownComponents}>{page.localContext}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {page.sections?.map((section: any, index: number) => (
          <section key={index} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
            </div>
          </section>
        ))}
      </div>

      <FAQSection faqs={page.faqs} />
      <RelatedServices relatedPages={relatedPages} />
      <ExternalResources resources={page.externalResources} />
    </div>
  );
}

// ===== Layout 3: Cards =====
function LayoutCards({ page, IconComponent, iconColor, bgColor, relatedPages }: LayoutProps) {
  return (
    <div className="space-y-8">
      <section className={`${bgColor} rounded-2xl p-8 border-2 border-gray-200`}>
        <div className="max-w-3xl mx-auto text-center">
          <IconComponent className={`w-16 h-16 mx-auto mb-4 ${iconColor}`} />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
          <p className="text-lg text-gray-700 flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" /> Serving Navarro County, Texas
          </p>
        </div>
      </section>

      <div className="bg-white rounded-2xl border-2 border-brand-200 p-8">
        <div className="prose prose-lg max-w-none text-gray-700">
          <ReactMarkdown components={markdownComponents}>{page.heroContent}</ReactMarkdown>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {page.localContext && (
          <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-amber-600" />
              Local Context
            </h3>
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown components={markdownComponents}>{page.localContext}</ReactMarkdown>
            </div>
          </div>
        )}

        {page.sections?.map((section: any, index: number) => (
          <div key={index} className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-3">{section.heading}</h3>
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <FAQSection faqs={page.faqs} />
      <ClaimCTA page={page} />
      <RelatedServices relatedPages={relatedPages} />
      <ExternalResources resources={page.externalResources} />
    </div>
  );
}

// ===== Layout 4: Timeline =====
function LayoutTimeline({ page, IconComponent, iconColor, bgColor, relatedPages }: LayoutProps) {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-brand-100">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-full ${bgColor}`}>
            <IconComponent className={`w-10 h-10 ${iconColor}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
            <p className="text-gray-600">Navarro County, Texas</p>
          </div>
        </div>
        <div className="prose max-w-none text-gray-700">
          <ReactMarkdown components={markdownComponents}>{page.heroContent}</ReactMarkdown>
        </div>
      </section>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-200" />

        {page.localContext && (
          <div className="relative pl-20 pb-8">
            <div className={`absolute left-6 w-5 h-5 rounded-full ${bgColor} border-4 border-white shadow`} />
            <div className="bg-white rounded-2xl border-2 border-amber-200 p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-amber-600" />
                Local Considerations
              </h2>
              <div className="prose max-w-none text-gray-700">
                <ReactMarkdown components={markdownComponents}>{page.localContext}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {page.sections?.map((section: any, index: number) => (
          <div key={index} className="relative pl-20 pb-8">
            <div className="absolute left-6 w-5 h-5 rounded-full bg-white border-4 border-brand-400 shadow" />
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 mb-2">
                Step {index + 1}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
              <div className="prose max-w-none text-gray-700">
                <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FAQSection faqs={page.faqs} />
      <ClaimCTA page={page} />
      <RelatedServices relatedPages={relatedPages} />
      <ExternalResources resources={page.externalResources} />
    </div>
  );
}

// ===== Layout 5: Magazine =====
function LayoutMagazine({ page, IconComponent, iconColor, bgColor, relatedPages }: LayoutProps) {
  return (
    <div className="space-y-8">
      <section className={`relative ${bgColor} rounded-2xl overflow-hidden`}>
        <div className="p-12 md:p-16">
          <div className="max-w-4xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/80 text-gray-800 mb-4">
              Navarro County Guide
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{page.title}</h1>
            <div className="prose prose-lg max-w-none text-gray-700">
              <ReactMarkdown components={markdownComponents}>{page.heroContent}</ReactMarkdown>
            </div>
          </div>
        </div>
        <IconComponent className={`absolute right-8 bottom-8 w-32 h-32 ${iconColor} opacity-10`} />
      </section>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          {page.localContext && (
            <section className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Navarro County Difference</h2>
              <div className="prose max-w-none text-gray-700">
                <ReactMarkdown components={markdownComponents}>{page.localContext}</ReactMarkdown>
              </div>
            </section>
          )}

          {page.sections?.map((section: any, index: number) => (
            <section key={index} className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
              <div className="prose max-w-none text-gray-700">
                <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
              </div>
            </section>
          ))}
        </div>

        <aside className="md:col-span-4 space-y-6">
          <div className="bg-brand-50 rounded-2xl border-2 border-brand-200 p-6 text-center sticky top-6">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-brand-600" />
            <h3 className="font-bold text-gray-900 mb-2">Feature Your Business</h3>
            <p className="text-sm text-gray-600 mb-4">
              Claim this page to be featured as the exclusive provider
            </p>
            <Link
              href={`/guides/${page.slug}/inquiry`}
              className="block w-full px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors text-center"
            >
              Learn More
            </Link>
          </div>

          {page.faqs && page.faqs.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-brand-200 p-6">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-brand-600" />
                Quick Answers
              </h3>
              <div className="space-y-4">
                {page.faqs.slice(0, 3).map((faq: any, index: number) => (
                  <div key={index}>
                    <p className="font-medium text-sm text-gray-900">{faq.question}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedPages.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Related Services</h3>
              <div className="space-y-2">
                {relatedPages.map((rp: any) => (
                  <Link
                    key={rp.id || rp.slug}
                    href={`/guides/${rp.slug}`}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-sm text-gray-700">{rp.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <ExternalResources resources={page.externalResources} />
    </div>
  );
}

// ===== Shared Components =====

function FAQSection({ faqs }: { faqs?: any[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-brand-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-brand-600" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq: any, index: number) => (
          <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClaimCTA({ page }: { page: any }) {
  return (
    <section className="bg-gradient-to-r from-brand-100 to-brand-200 rounded-2xl p-8 border-2 border-brand-200">
      <div className="max-w-2xl mx-auto text-center">
        <Briefcase className="w-16 h-16 mx-auto mb-4 text-brand-600" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Are You a {page.title} Provider in Navarro County?
        </h2>
        <p className="text-gray-700 mb-6">
          This page is available for exclusive sponsorship. Feature your business prominently
          on this high-visibility local service page and connect with customers actively searching
          for {page.title.toLowerCase()} services.
        </p>
        <Link
          href={`/guides/${page.slug}/inquiry`}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-700 to-brand-500 hover:from-brand-800 hover:to-brand-600 text-white rounded-xl font-semibold transition-all"
        >
          Inquire About This Page
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function RelatedServices({ relatedPages }: { relatedPages: any[] }) {
  if (relatedPages.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Services</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedPages.map((rp: any) => {
          const RelatedIcon = ICON_MAP[rp.icon] || Briefcase;
          const relatedColor = COLOR_MAP[rp.iconColor] || 'text-gray-600';
          const relatedBg = BG_COLOR_MAP[rp.iconColor] || 'bg-gray-100';

          return (
            <Link
              key={rp.id || rp.slug}
              href={`/guides/${rp.slug}`}
              className="group p-4 rounded-xl border-2 border-gray-200 hover:border-brand-300 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-lg ${relatedBg} flex items-center justify-center mb-3`}>
                <RelatedIcon className={`w-5 h-5 ${relatedColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                {rp.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Learn more</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ExternalResources({ resources }: { resources?: any[] }) {
  if (!resources || resources.length === 0) return null;

  return (
    <section className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Resources</h2>
      <div className="flex flex-wrap gap-3">
        {resources.map((resource: any, index: number) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:border-brand-300 hover:shadow-sm transition-all text-sm"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
            {resource.name}
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        External links provided for informational purposes. We are not affiliated with these organizations.
      </p>
    </section>
  );
}
