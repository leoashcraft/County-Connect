import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import MyListingsClient from '../my-listings-client';

export const metadata = {
  title: 'My Restaurants',
};

export default async function MyRestaurantsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/my-restaurants');
  }

  return (
    <MyListingsClient
      title="My Restaurants"
      contentType="restaurants"
      ownerField="owner"
      directoryType="restaurants"
    />
  );
}
