import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';

interface FeaturedSponsorProps {
  href: string;
  label: string;
  title: string;
  description: string;
  gradientClass?: string;
  borderClass?: string;
  sideBgClass?: string;
  textClass?: string;
  buttonBgClass?: string;
  buttonHoverClass?: string;
}

export function FeaturedSponsor({
  href,
  label,
  title,
  description,
  gradientClass = 'from-brand-50 to-brand-100',
  borderClass = 'border-brand-200',
  sideBgClass = 'bg-brand-100',
  textClass = 'text-brand-600',
  buttonBgClass = 'bg-brand-600',
  buttonHoverClass = 'hover:bg-brand-700',
}: FeaturedSponsorProps) {
  return (
    <section className="py-6 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <Link
          href={href}
          className={`flex items-stretch bg-gradient-to-r ${gradientClass} rounded-2xl ${borderClass} border overflow-hidden hover:shadow-lg transition-shadow`}
        >
          <div className={`w-48 md:w-64 flex-shrink-0 ${sideBgClass} flex items-center justify-center`}>
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-2">
                <Plus className={`w-8 h-8 ${textClass}`} />
              </div>
              <p className={`${textClass} font-medium text-sm`}>Your Ad Here</p>
            </div>
          </div>
          <div className="flex-1 p-6 flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium ${textClass} mb-1`}>{label}</p>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
            <div className="hidden md:block">
              <span className={`inline-flex items-center gap-2 px-5 py-2.5 ${buttonBgClass} ${buttonHoverClass} text-white font-medium rounded-lg transition-colors`}>
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
