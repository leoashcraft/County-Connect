import React, { useState, useEffect } from "react";
import { Page, Town } from "@/api/entities";
import { useParams, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, ExternalLink } from "lucide-react";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

// Import TownDetail as a fallback
import TownDetail from "./TownDetail";

export default function CustomPage() {
  const { pageSlug } = useParams();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isTownSlug, setIsTownSlug] = useState(false);

  useEffect(() => {
    loadPage();
  }, [pageSlug]);

  const loadPage = async () => {
    setLoading(true);
    setNotFound(false);
    setIsTownSlug(false);

    try {
      // First, check if this is a custom page
      const pages = await Page.filter({ slug: pageSlug });
      if (pages.length > 0 && pages[0].is_published) {
        setPage(pages[0]);
        setLoading(false);
        return;
      }

      // If not a page, check if it's a town slug
      const towns = await Town.list('name');
      const town = towns.find(t => t.slug === pageSlug);
      if (town) {
        setIsTownSlug(true);
        setLoading(false);
        return;
      }

      // Neither page nor town found
      setNotFound(true);
    } catch (error) {
      console.error("Error loading page:", error);
      setNotFound(true);
    }
    setLoading(false);
  };

  // If it's a town slug, render TownDetail
  if (isTownSlug) {
    return <TownDetail />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <FileText className="w-12 h-12 text-orange-600 animate-pulse" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(createPageUrl("Home"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const sections = page.content?.sections || [];

  return (
    <>
      <MetaTags
        title={page.meta_title || page.title}
        description={page.meta_description || `${page.title} - ${settings.site_name || 'NavarroCounty.com'}`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        {sections.map((section, index) => (
          <PageSection key={section.id || index} section={section} />
        ))}

        {sections.length === 0 && (
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
          </div>
        )}
      </div>
    </>
  );
}

function PageSection({ section }) {
  const { type, content } = section;

  switch (type) {
    case 'hero':
      return (
        <section className="relative py-20 px-6" style={content.image ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${content.image ? 'text-white' : 'text-gray-900'}`}>
              {content.title}
            </h1>
            {content.subtitle && (
              <p className={`text-xl md:text-2xl mb-8 ${content.image ? 'text-gray-200' : 'text-gray-600'}`}>
                {content.subtitle}
              </p>
            )}
            {content.cta_text && content.cta_link && (
              <a
                href={content.cta_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all"
              >
                {content.cta_text}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        </section>
      );

    case 'text':
      return (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {content.heading && (
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.heading}</h2>
            )}
            {content.body && (
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                {content.body}
              </div>
            )}
          </div>
        </section>
      );

    case 'richtext':
      return (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {content.heading && (
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.heading}</h2>
            )}
            {content.body && (
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {content.body}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </section>
      );

    case 'image':
      return (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {content.image && (
              <figure>
                <img
                  src={content.image}
                  alt={content.alt || ''}
                  className="w-full rounded-lg shadow-lg"
                />
                {content.caption && (
                  <figcaption className="mt-3 text-center text-gray-600 text-sm">
                    {content.caption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </section>
      );

    case 'features':
      return (
        <section className="py-12 px-6 bg-white/50">
          <div className="max-w-4xl mx-auto">
            {content.heading && (
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{content.heading}</h2>
            )}
            {content.items && content.items.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {content.items.map((item, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg border-2 border-orange-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="py-16 px-6 bg-gradient-to-r from-orange-500 to-amber-500">
          <div className="max-w-4xl mx-auto text-center">
            {content.heading && (
              <h2 className="text-3xl font-bold text-white mb-4">{content.heading}</h2>
            )}
            {content.text && (
              <p className="text-xl text-orange-100 mb-8">{content.text}</p>
            )}
            {content.button_text && content.button_link && (
              <a
                href={content.button_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all"
              >
                {content.button_text}
              </a>
            )}
          </div>
        </section>
      );

    case 'html':
      return (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          </div>
        </section>
      );

    case 'faq': {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": (content.items || []).map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      };

      return (
        <section className="py-12 px-6">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
          <div className="max-w-4xl mx-auto">
            {content.heading && (
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{content.heading}</h2>
            )}
            <div className="space-y-6">
              {(content.items || []).map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.question}</h3>
                  <div className="text-gray-700 prose prose-lg max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {item.answer}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
