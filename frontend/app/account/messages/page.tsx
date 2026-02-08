import { Metadata } from 'next';
import { getSession, getStrapiToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import MessagesClient from './messages-client';

export const metadata: Metadata = {
  title: 'Messages | My Account | CountyConnect',
  description: 'View and manage your messages with other users',
};

interface Message {
  id: number;
  content: string;
  subject: string | null;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: number;
    username: string;
    email: string;
  } | null;
  recipient: {
    id: number;
    username: string;
    email: string;
  } | null;
  relatedListingType: string | null;
  relatedListingId: string | null;
}

interface StrapiResponse {
  data: Message[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

async function fetchMessages(token: string, userId: number): Promise<Message[]> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  // Fetch messages where user is either sender or recipient
  const [sentRes, receivedRes] = await Promise.all([
    fetch(
      `${STRAPI_URL}/api/messages?filters[sender][id][$eq]=${userId}&populate=sender,recipient&sort=createdAt:desc&pagination[pageSize]=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    ),
    fetch(
      `${STRAPI_URL}/api/messages?filters[recipient][id][$eq]=${userId}&populate=sender,recipient&sort=createdAt:desc&pagination[pageSize]=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    ),
  ]);

  if (!sentRes.ok || !receivedRes.ok) {
    console.error('Failed to fetch messages');
    return [];
  }

  const sentData: StrapiResponse = await sentRes.json();
  const receivedData: StrapiResponse = await receivedRes.json();

  // Combine and deduplicate messages
  const allMessages = [...(sentData.data || []), ...(receivedData.data || [])];
  const uniqueMessages = allMessages.filter(
    (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
  );

  return uniqueMessages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

async function fetchUsers(token: string): Promise<{ id: number; username: string; email: string }[]> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(
    `${STRAPI_URL}/api/users?pagination[pageSize]=50`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    console.error('Failed to fetch users');
    return [];
  }

  return res.json();
}

export default async function MessagesPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/messages');
  }

  const token = (session.user as any)?.strapiToken;
  const userId = (session.user as any)?.strapiUserId;

  if (!token || !userId) {
    redirect('/login?callbackUrl=/account/messages');
  }

  const [messages, users] = await Promise.all([
    fetchMessages(token, userId),
    fetchUsers(token),
  ]);

  return (
    <MessagesClient
      initialMessages={messages}
      currentUserId={userId}
      strapiToken={token}
      users={users.filter((u) => u.id !== userId)}
    />
  );
}
