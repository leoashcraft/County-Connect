import { Metadata } from 'next';
import { ActivityFeed } from '@/components/activity-feed';

export const metadata: Metadata = {
  title: 'Community Activity',
  description: 'See what\'s happening in Navarro County',
};

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Community Activity</h1>
        <ActivityFeed limit={50} showRefresh={true} />
      </div>
    </div>
  );
}
