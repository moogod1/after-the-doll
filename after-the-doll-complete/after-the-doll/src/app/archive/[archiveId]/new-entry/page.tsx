// src/app/archive/[archiveId]/new-entry/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createEntry, getArchive } from '@/lib/firestore';
import type { Visibility, Archive } from '@/types';

function NewEntryContent({ params }: { params: { archiveId: string } }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [archive, setArchive] = useState<Archive | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('private');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArchive();
  }, [params.archiveId, user]);

  const loadArchive = async () => {
    const fetchedArchive = await getArchive(params.archiveId);
    if (fetchedArchive && user && fetchedArchive.uid === user.uid) {
      setArchive(fetchedArchive);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !archive) return;

    setSubmitting(true);
    setError('');
    
    try {
      const tagArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const now = new Date();
      await createEntry({
        archiveId: archive.archiveId,
        authorUid: user.uid,
        authorUsername: user.username,
        title,
        body,
        tags: tagArray,
        visibility,
        createdAt: now,
        updatedAt: now,
      });

      router.push(`/archive/${archive.archiveId}`);
    } catch (err: any) {
      console.error('Error creating entry:', err);
      setError('Failed to create entry. Please check your Firestore permissions and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!archive) {
    return <div className="text-center py-8">Archive not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link href={`/archive/${archive.archiveId}`} className="text-blue-600 hover:underline text-sm">
          ← Back to {archive.title}
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">New Entry</h1>
      <p className="text-gray-600 mb-8">Writing in: {archive.title}</p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Entry Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Give your entry a title..."
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium mb-2">
            Content (Markdown supported)
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={16}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-sm"
            placeholder="Write your thoughts..."
          />
          <p className="text-xs text-gray-600 mt-1">
            You can use Markdown formatting: **bold**, *italic*, # headers, - lists, etc.
          </p>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="personal, travel, thoughts..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Visibility</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="private"
                checked={visibility === 'private'}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="mr-2"
              />
              <span>Private - Only you can read this entry</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="friends"
                checked={visibility === 'friends'}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="mr-2"
              />
              <span>Friends - Only friends can read this entry</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="public"
                checked={visibility === 'public'}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="mr-2"
              />
              <span>Public - Anyone can read this entry</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Publishing...' : 'Publish Entry'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-white text-gray-900 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewEntryPage({ params }: { params: { archiveId: string } }) {
  return (
    <ProtectedRoute>
      <NewEntryContent params={params} />
    </ProtectedRoute>
  );
}
