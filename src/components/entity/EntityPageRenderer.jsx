import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import EntityPhotoGallery, { EntityHeroImage } from "./EntityPhotoGallery";

/**
 * EntityPageRenderer - Renders page content sections for entity mini-websites
 *
 * Supports section types:
 * - hero: Full-width hero image with title/subtitle
 * - text: Text content with optional heading
 * - image: Single image with caption
 * - gallery: Photo gallery
 * - features: Feature list with icons
 * - html: Raw HTML content (sanitized)
 * - menu: Menu sections (for restaurants/food trucks)
 * - hours: Operating hours
 * - contact: Contact information
 * - map: Embedded map
 * - cta: Call to action button
 *
 * @param {Object} props
 * @param {Array} props.sections - Array of section objects
 * @param {string} props.entityName - Name of the entity for context
 * @param {string} props.accentColor - Primary accent color class (e.g., 'amber', 'green', 'blue')
 */
export default function EntityPageRenderer({
  sections = [],
  entityName = "",
  accentColor = "amber"
}) {
  if (!sections || sections.length === 0) {
    return null;
  }

  const colorClasses = {
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-600",
      button: "bg-amber-500 hover:bg-amber-600"
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-600",
      button: "bg-green-500 hover:bg-green-600"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-600",
      button: "bg-blue-500 hover:bg-blue-600"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-600",
      button: "bg-purple-500 hover:bg-purple-600"
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-600",
      button: "bg-orange-500 hover:bg-orange-600"
    }
  };

  const colors = colorClasses[accentColor] || colorClasses.amber;

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'hero':
        return (
          <EntityHeroImage
            key={index}
            image={section.content?.image}
            title={section.content?.title}
            subtitle={section.content?.subtitle}
            height={section.content?.height || "h-64 md:h-80"}
            className="rounded-lg overflow-hidden"
          />
        );

      case 'text':
        return (
          <div key={index} className="prose max-w-none">
            {section.content?.heading && (
              <h2 className={`text-2xl font-bold mb-4 ${colors.text}`}>
                {section.content.heading}
              </h2>
            )}
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {section.content?.body}
            </div>
          </div>
        );

      case 'image':
        return (
          <figure key={index} className="my-4">
            <img
              src={section.content?.url}
              alt={section.content?.alt || entityName}
              className="w-full rounded-lg"
            />
            {section.content?.caption && (
              <figcaption className="text-center text-gray-600 text-sm mt-2">
                {section.content.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'gallery':
        return (
          <div key={index}>
            {section.content?.title && (
              <h3 className={`text-xl font-bold mb-4 ${colors.text}`}>
                {section.content.title}
              </h3>
            )}
            <EntityPhotoGallery
              photos={section.content?.images || []}
              entityName={entityName}
              columns={section.content?.columns || 3}
              showMainPhoto={false}
            />
          </div>
        );

      case 'features':
        return (
          <div key={index}>
            {section.content?.title && (
              <h3 className={`text-xl font-bold mb-4 ${colors.text}`}>
                {section.content.title}
              </h3>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(section.content?.features || []).map((feature, i) => (
                <div key={i} className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
                  {feature.icon && (
                    <div className={`text-2xl mb-2 ${colors.text}`}>{feature.icon}</div>
                  )}
                  <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  {feature.description && (
                    <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'html':
        return (
          <div
            key={index}
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(section.content?.html || '')
            }}
          />
        );

      case 'menu':
        return <MenuSection key={index} content={section.content} colors={colors} />;

      case 'hours':
        return <HoursSection key={index} content={section.content} colors={colors} />;

      case 'contact':
        return <ContactSection key={index} content={section.content} colors={colors} />;

      case 'cta':
        return (
          <div key={index} className={`text-center p-8 rounded-lg ${colors.bg}`}>
            {section.content?.title && (
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {section.content.title}
              </h3>
            )}
            {section.content?.description && (
              <p className="text-gray-600 mb-4">{section.content.description}</p>
            )}
            {section.content?.buttonText && section.content?.buttonUrl && (
              <Button
                className={`${colors.button} text-white`}
                onClick={() => window.open(section.content.buttonUrl, '_blank')}
              >
                {section.content.buttonText}
              </Button>
            )}
          </div>
        );

      case 'divider':
        return <hr key={index} className={`my-8 border-t-2 ${colors.border}`} />;

      case 'spacer':
        return <div key={index} className={`h-${section.content?.size || 8}`} />;

      default:
        console.warn(`Unknown section type: ${section.type}`);
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );
}

/**
 * MenuSection - Renders a menu with categories/sections
 */
function MenuSection({ content, colors }) {
  const { title, sections = [] } = content || {};

  return (
    <div>
      {title && (
        <h3 className={`text-xl font-bold mb-4 ${colors.text}`}>{title}</h3>
      )}
      <div className="space-y-6">
        {sections.map((section, sIndex) => (
          <div key={sIndex}>
            <h4 className={`text-lg font-semibold mb-3 pb-2 border-b ${colors.border}`}>
              {section.name}
            </h4>
            <div className="space-y-3">
              {(section.items || []).map((item, iIndex) => (
                <div key={iIndex} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                  {item.price && (
                    <div className={`font-semibold ${colors.text} ml-4`}>
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * HoursSection - Renders operating hours
 */
function HoursSection({ content, colors }) {
  const { title = "Hours", hours = [] } = content || {};

  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  return (
    <div>
      <h3 className={`text-xl font-bold mb-4 ${colors.text}`}>{title}</h3>
      <div className="space-y-2">
        {hours.map((day, index) => (
          <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
            <span className="font-medium text-gray-900">
              {dayLabels[day.day?.toLowerCase()] || day.day}
            </span>
            <span className="text-gray-600">
              {day.is_closed ? 'Closed' : `${day.open_time} - ${day.close_time}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ContactSection - Renders contact information
 */
function ContactSection({ content, colors }) {
  const { title = "Contact", phone, email, website, address, city, state, zip_code } = content || {};

  return (
    <div>
      <h3 className={`text-xl font-bold mb-4 ${colors.text}`}>{title}</h3>
      <div className="space-y-2">
        {address && (
          <div>
            <span className="text-gray-600">{address}</span>
            {(city || state || zip_code) && (
              <div className="text-gray-600">
                {city}{city && state && ', '}{state} {zip_code}
              </div>
            )}
          </div>
        )}
        {phone && (
          <div>
            <a href={`tel:${phone}`} className={`${colors.text} hover:underline`}>
              {phone}
            </a>
          </div>
        )}
        {email && (
          <div>
            <a href={`mailto:${email}`} className={`${colors.text} hover:underline`}>
              {email}
            </a>
          </div>
        )}
        {website && (
          <div>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className={`${colors.text} hover:underline`}
            >
              Visit Website
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Export section components for direct use
 */
export { MenuSection, HoursSection, ContactSection };
