'use client';

import { useSession, signIn } from 'next-auth/react';
import { MessageSquare } from 'lucide-react';

export function ContactSellerButton({ listing }: { listing: any }) {
  const { data: session } = useSession();

  const handleContact = () => {
    if (!session) {
      signIn('google', { callbackUrl: `/marketplace/${listing.id}` });
      return;
    }
    // TODO: Implement messaging system
    alert('Messaging feature coming soon!');
  };

  return (
    <button
      onClick={handleContact}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
    >
      <MessageSquare className="w-5 h-5" />
      Contact Seller
    </button>
  );
}
