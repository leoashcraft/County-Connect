import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { strapi } from '@/lib/strapi';
import { ArrowLeft, User, Clock, Eye, MessageSquare } from 'lucide-react';
import { CommentForm } from './comment-form';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await strapi.forum.post(Number(id));
    return { title: res.data?.title || 'Forum Post' };
  } catch {
    return { title: 'Forum Post' };
  }
}

export default async function ForumPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let post: any = null;
  let comments: any[] = [];

  try {
    const [postRes, commentsRes] = await Promise.all([
      strapi.forum.post(Number(id)),
      strapi.forum.comments(Number(id)),
    ]);
    post = postRes.data;
    comments = commentsRes.data || [];
  } catch (error) {
    console.error('Error fetching post:', error);
  }

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/community/forum" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Forum
        </Link>

        {/* Post */}
        <article className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <span>{post.author?.username || post.author?.email || 'Anonymous'}</span>
            </div>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.viewCount || 0} views
            </span>
          </div>
          <div className="prose max-w-none text-gray-700">{post.content}</div>
        </article>

        {/* Comments */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Comments ({comments.length})
          </h2>

          {comments.length > 0 ? (
            <div className="space-y-6 mb-8">
              {comments.map((comment: any) => (
                <div key={comment.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{comment.author?.username || 'Anonymous'}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 text-sm pl-9">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No comments yet. Be the first to reply!</p>
          )}

          <CommentForm postId={Number(id)} />
        </div>
      </main>
    </div>
  );
}
