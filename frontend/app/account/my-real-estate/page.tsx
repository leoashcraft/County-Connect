import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import MyListingsClient from '../my-listings-client';

export const metadata = {
  title: 'My Real Estate',
};

export default async function MyRealEstatePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/my-real-estate');
  }

  return (
    <MyListingsClient
      title="My Real Estate"
      contentType="real-estates"
      ownerField="listedBy"
      directoryType="real-estate"
    />
  );
}
