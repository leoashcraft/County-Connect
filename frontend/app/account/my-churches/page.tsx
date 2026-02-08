import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import MyListingsClient from '../my-listings-client';

export const metadata = {
  title: 'My Churches',
};

export default async function MyChurchesPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/my-churches');
  }

  return (
    <MyListingsClient
      title="My Churches"
      contentType="churches"
      ownerField="owner"
      directoryType="churches"
    />
  );
}
