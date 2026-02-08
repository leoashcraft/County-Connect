import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { SavedSearchesClient } from './saved-searches-client';

export const metadata: Metadata = {
  title: 'Saved Searches',
  description: 'Manage your saved search alerts',
};

export default async function SavedSearchesPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/saved-searches');
  }

  return <SavedSearchesClient />;
}
