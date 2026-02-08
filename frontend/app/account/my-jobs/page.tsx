import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

import MyListingsClient from '../my-listings-client';

export const metadata = {
  title: 'My Jobs & Gigs',
};

export default async function MyJobsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/my-jobs');
  }

  return (
    <MyListingsClient
      title="My Jobs & Gigs"
      contentType="jobs"
      ownerField="postedBy"
      directoryType="jobs"
    />
  );
}
