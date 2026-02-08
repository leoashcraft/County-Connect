import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import MyListingsClient from '../my-listings-client';

export const metadata = {
  title: 'My Lost & Found',
};

export default async function MyLostFoundPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/my-lost-found');
  }

  return (
    <MyListingsClient
      title="My Lost & Found"
      contentType="lost-and-found-posts"
      ownerField="postedBy"
      directoryType="lost-and-found"
    />
  );
}
