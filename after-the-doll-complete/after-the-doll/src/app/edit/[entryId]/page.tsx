// src/app/edit/[entryId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getEntry, updateEntry, deleteEntry } from '@/lib/firestore';
import type { Visibility, JournalEntry } from '@/types';

function EditEntryContent({ params }: { params: { entryId: string } }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEntry();
  }, [params.entryId, user]);

  const loadEntry = async () => {
    const fetchedEntry = await getEntry(params.entryId);
    if (fetchedEntry && user && fetchedEntry.authorUid === user.uid) {
      setEntry(fetchedEntry);
      setTitle(fetchedEntry.title);
      setBody(fetchedEntry.body);
      setTags(fetchedEntry.tags.join(', '));
      setVisibility(fetchedEntry.visibility);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !entry) return;

    setSubmitting(true);
    try {
      const tagArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await updateEntry(params.entryId, {
        title,
        body,
        tags: tagArray,
        visibility,
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Failed to update entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
      return;
    }

    try {
      await deleteEntry(params.entryId);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
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
          />
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Visibility</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="public"
                checked={visibility === 'public'}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="mr-2"
              />
              <span>Public</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="friends"
                checked={visibility === 'friends'}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="mr-2"
              />
              <span>Friends</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="private"
                checked={visibility === 'private'}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="mr-2"
              />
              <span>Private</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-white text-gray-900 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-auto"
          >
            Delete Entry
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditEntryPage({ params }: { params: { entryId: string } }) {
  return (
    <ProtectedRoute>
      <EditEntryContent params={params} />
    </ProtectedRoute>
  );
}
