// src/app/forum/thread/[threadId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';
import { getForumThread, getForumReplies, createForumReply } from '@/lib/firestore';
import type { ForumThread, ForumReply } from '@/types';

export default function ForumThreadPage({ params }: { params: { threadId: string } }) {
  const { user } = useAuthContext();
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadThread();
  }, [params.threadId]);

  const loadThread = async () => {
    const [fetchedThread, fetchedReplies] = await Promise.all([
      getForumThread(params.threadId),
      getForumReplies(params.threadId),
    ]);
    setThread(fetchedThread);
    setReplies(fetchedReplies);
    setLoading(false);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !thread) return;

    setSubmitting(true);
    try {
      await createForumReply(params.threadId, {
        body: replyBody,
        authorUid: user.uid,
        authorUsername: user.username,
        createdAt: new Date(),
      });

      setReplyBody('');
      await loadThread();
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Failed to post reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading thread...</div>;
  }

  if (!thread) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Thread Not Found</h1>
        <Link href="/forum" className="text-blue-600 hover:underline">
          Back to Forum
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link
          href={`/forum/${thread.categoryId}`}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to category
        </Link>
      </div>

      {/* Thread */}
      <div className="bg-white border border-gray-300 rounded p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{thread.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span>
            by{' '}
            <Link href={`/u/${thread.authorUsername}`} className="font-medium hover:underline">
              @{thread.authorUsername}
            </Link>
          </span>
          <span>•</span>
          <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap">{thread.body}</p>
        </div>
      </div>

      {/* Replies */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          Replies ({replies.length})
        </h2>
        {replies.length === 0 ? (
          <p className="text-gray-600 mb-6">No replies yet. Be the first to reply!</p>
        ) : (
          <div className="space-y-4 mb-6">
            {replies.map((reply) => (
              <div key={reply.replyId} className="bg-white border border-gray-300 rounded p-4">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <Link
                    href={`/u/${reply.authorUsername}`}
                    className="font-medium hover:underline"
                  >
                    @{reply.authorUsername}
                  </Link>
                  <span>•</span>
                  <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{reply.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply form */}
      {user ? (
        <div className="bg-white border border-gray-300 rounded p-6">
          <h3 className="text-lg font-bold mb-4">Post a Reply</h3>
          <form onSubmit={handleReply} className="space-y-4">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Write your reply..."
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
            >
              {submitting ? 'Posting...' : 'Post Reply'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-300 rounded p-4">
          <p className="text-sm text-gray-700">
            <Link href="/login" className="font-medium underline">
              Login
            </Link>{' '}
            to post a reply.
          </p>
        </div>
      )}
    </div>
  );
}
