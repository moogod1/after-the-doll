// src/app/archive/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createArchive } from '@/lib/firestore';

function NewArchiveContent() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError('');
    
    try {
      const now = new Date();
      const archiveId = await createArchive({
        uid: user.uid,
        username: user.username,
        title,
        description,
        createdAt: now,
        updatedAt: now,
      });

      router.push(`/archive/${archiveId}`);
    } catch (err: any) {
      console.error('Error creating archive:', err);
      setError('Failed to create archive. Please check your Firestore permissions and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Archive</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-300 rounded p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Archive Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="My Personal Journal, Travel Memories, etc."
          />
          <p className="text-xs text-gray-600 mt-1">
            Give your archive a meaningful title to organize your journal entries
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="What is this archive about?"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating...' : 'Create Archive'}
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

      <div className="mt-8 bg-blue-50 border border-blue-300 rounded p-4">
        <h3 className="font-medium mb-2">What is an Archive?</h3>
        <p className="text-sm text-gray-700">
          An archive is a container for your journal entries. You can create multiple archives to
          organize different aspects of your life (e.g., "Daily Thoughts", "Travel Journal",
          "Creative Writing"). Each archive will hold its own collection of entries.
        </p>
      </div>
    </div>
  );
}

export default function NewArchivePage() {
  return (
    <ProtectedRoute>
      <NewArchiveContent />
    </ProtectedRoute>
  );
}
