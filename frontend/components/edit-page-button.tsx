'use client';

import { useSession } from 'next-auth/react';
import { Pencil } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface EditPageButtonProps {
  contentType: string; // e.g. "api::service-page.service-page"
  documentId: string;
}

export function EditPageButton({ contentType, documentId }: EditPageButtonProps) {
  const { data: session } = useSession();

  if (!session?.user?.isAdmin) return null;

  const editUrl = `${STRAPI_URL}/admin/content-manager/collection-types/${contentType}/${documentId}`;

  return (
    <a
      href={editUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium rounded-xl shadow-lg transition-colors"
    >
      <Pencil className="w-4 h-4" />
      Edit Page
    </a>
  );
}
