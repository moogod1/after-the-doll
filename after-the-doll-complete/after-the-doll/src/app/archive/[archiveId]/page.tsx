// src/app/archive/[archiveId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import JournalEntry from '@/components/JournalEntry';
import { getArchive, getEntriesByArchive, deleteArchive } from '@/lib/firestore';
import type { Archive, JournalEntry as JournalEntryType } from '@/types';
import { useRouter } from 'next/navigation';

function ArchiveDetailContent({ params }: { params: { archiveId: string } }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [archive, setArchive] = useState<Archive | null>(null);
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadArchive();
    }
  }, [params.archiveId, user]);

  const loadArchive = async () => {
    try {
      const [fetchedArchive, fetchedEntries] = await Promise.all([
        getArchive(params.archiveId),
        getEntriesByArchive(params.archiveId),
      ]);

      if (fetchedArchive && user && fetchedArchive.uid === user.uid) {
        setArchive(fetchedArchive);
        setEntries(fetchedEntries);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error loading archive:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this archive? This will also delete all entries inside it. This cannot be undone.')) {
      return;
    }

    try {
      await deleteArchive(params.archiveId);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting archive:', error);
      alert('Failed to delete archive. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading archive...</div>;
  }

  if (!archive) {
    return <div className="text-center py-8">Archive not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to My Archives
        </Link>
      </div>

      {/* Archive Header */}
      <div className="bg-white border border-gray-300 rounded p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{archive.title}</h1>
            {archive.description && (
              <p className="text-gray-600 mb-4">{archive.description}</p>
            )}
            <p className="text-sm text-gray-600">
              Created {new Date(archive.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Delete Archive
          </button>
        </div>

        <Link
          href={`/archive/${archive.archiveId}/new-entry`}
          className="inline-block px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          New Entry
        </Link>
      </div>

      {/* Entries */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Entries ({entries.length})</h2>
        {entries.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded p-8 text-center text-gray-600">
            <p className="mb-4">No entries yet. Start writing your first entry!</p>
            <Link
              href={`/archive/${archive.archiveId}/new-entry`}
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              Create First Entry
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.entryId}>
                <JournalEntry entry={entry} />
                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/edit/${entry.entryId}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArchiveDetailPage({ params }: { params: { archiveId: string } }) {
  return (
    <ProtectedRoute>
      <ArchiveDetailContent params={params} />
    </ProtectedRoute>
  );
}
