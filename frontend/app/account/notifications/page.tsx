import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { NotificationsClient } from './notifications-client';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'View your notifications',
};

export default async function NotificationsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account/notifications');
  }

  return <NotificationsClient />;
}
