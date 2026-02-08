import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import MyListingsClient from '../my-listings-client';

export const metadata = {
  title: 'My Community Resources',
};

export default async function MyCommunityResourcesPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/my-community-resources');
  }

  return (
    <MyListingsClient
      title="My Community Resources"
      contentType="local-businesses"
      ownerField="owner"
      directoryType="community-resources"
      businessType="community-resource"
    />
  );
}
