import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import MyListingsClient from '../my-listings-client';

export const metadata = {
  title: 'My Sports Teams',
};

export default async function MySportsTeamsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/my-sports-teams');
  }

  return (
    <MyListingsClient
      title="My Sports Teams"
      contentType="local-businesses"
      ownerField="owner"
      directoryType="sports-teams"
      businessType="sports-team"
    />
  );
}
