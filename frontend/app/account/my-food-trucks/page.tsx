import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import MyListingsClient from '../my-listings-client';

export const metadata = {
  title: 'My Food Trucks',
};

export default async function MyFoodTrucksPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/my-food-trucks');
  }

  return (
    <MyListingsClient
      title="My Food Trucks"
      contentType="local-businesses"
      ownerField="owner"
      directoryType="food-trucks"
      businessType="food-truck"
    />
  );
}
