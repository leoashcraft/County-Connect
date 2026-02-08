import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import MyListingsClient from '../my-listings-client';

export const metadata = {
  title: 'My Businesses',
};

export default async function MyBusinessesPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/my-businesses');
  }

  return (
    <MyListingsClient
      title="My Businesses"
      contentType="local-businesses"
      ownerField="owner"
      directoryType="businesses"
      businessType="business"
    />
  );
}
