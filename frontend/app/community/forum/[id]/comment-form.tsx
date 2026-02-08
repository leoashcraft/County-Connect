'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export function CommentForm({ postId }: { postId: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!session) {
    return (
      <div className="text-center py-4 border-t border-gray-100">
        <button
          onClick={() => signIn('google', { callbackUrl: `/community/forum/${postId}` })}
          className="text-purple-600 hover:underline font-medium"
        >
          Sign in to comment
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);

    try {
      const token = (session.user as any)?.strapiToken;
      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/forum-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          data: {
            content,
            post: postId,
            author: (session.user as any)?.strapiUserId,
          },
        }),
      });
      setContent('');
      router.refresh();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-100 pt-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-3"
      />
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {submitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
