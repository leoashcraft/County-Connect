import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import SavedClient from './saved-client';

export const metadata = {
  title: 'Saved | CountyConnect',
  description: 'View and manage your saved items',
};

export default async function SavedPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/saved');
  }

  return <SavedClient />;
}
