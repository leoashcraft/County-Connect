import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import MyListingsClient from '../my-listings-client';

export const metadata = {
  title: 'My Schools',
};

export default async function MySchoolsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/my-schools');
  }

  return (
    <MyListingsClient
      title="My Schools"
      contentType="schools"
      ownerField="owner"
      directoryType="schools"
    />
  );
}
