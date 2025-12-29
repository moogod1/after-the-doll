// src/app/forum/[categoryId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';
import ForumThreadList from '@/components/ForumThreadList';
import { getForumCategory, getThreadsByCategory, createForumThread } from '@/lib/firestore';
import type { ForumCategory, ForumThread } from '@/types';

export default function ForumCategoryPage({ params }: { params: { categoryId: string } }) {
  const { user } = useAuthContext();
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadBody, setNewThreadBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategory();
  }, [params.categoryId]);

  const loadCategory = async () => {
    const [fetchedCategory, fetchedThreads] = await Promise.all([
      getForumCategory(params.categoryId),
      getThreadsByCategory(params.categoryId),
    ]);
    setCategory(fetchedCategory);
    setThreads(fetchedThreads);
    setLoading(false);
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !category) return;

    setSubmitting(true);
    try {
      const now = new Date();
      await createForumThread({
        categoryId: category.categoryId,
        title: newThreadTitle,
        body: newThreadBody,
        authorUid: user.uid,
        authorUsername: user.username,
        createdAt: now,
        lastReplyAt: now,
      });

      setNewThreadTitle('');
      setNewThreadBody('');
      setShowNewThreadForm(false);
      await loadCategory();
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('Failed to create thread. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <Link href="/forum" className="text-blue-600 hover:underline">
          Back to Forum
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link href="/forum" className="text-blue-600 hover:underline text-sm">
          ← Back to Forum
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>
        {user && !showNewThreadForm && (
          <button
            onClick={() => setShowNewThreadForm(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 whitespace-nowrap"
          >
            New Thread
          </button>
        )}
      </div>

      {/* New thread form */}
      {showNewThreadForm && user && (
        <div className="bg-white border border-gray-300 rounded p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Thread</h2>
          <form onSubmit={handleCreateThread} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="What's this thread about?"
              />
            </div>
            <div>
              <label htmlFor="body" className="block text-sm font-medium mb-1">
                Body
              </label>
              <textarea
                id="body"
                value={newThreadBody}
                onChange={(e) => setNewThreadBody(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Start the conversation..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
              >
                {submitting ? 'Creating...' : 'Create Thread'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewThreadForm(false)}
                className="px-6 py-2 bg-white text-gray-900 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!user && (
        <div className="bg-blue-50 border border-blue-300 rounded p-4 mb-6">
          <p className="text-sm text-gray-700">
            <Link href="/login" className="font-medium underline">
              Login
            </Link>{' '}
            to create new threads and participate in discussions.
          </p>
        </div>
      )}

      {/* Thread list */}
      <ForumThreadList threads={threads} />
    </div>
  );
}
