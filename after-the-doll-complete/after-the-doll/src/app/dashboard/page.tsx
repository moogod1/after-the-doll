// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getArchivesByUser } from '@/lib/firestore';
import type { Archive } from '@/types';

function DashboardContent() {
  const { user } = useAuthContext();
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadArchives();
    }
  }, [user]);

  const loadArchives = async () => {
    if (!user) return;
    const fetchedArchives = await getArchivesByUser(user.uid);
    setArchives(fetchedArchives);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading your archives...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Archives</h1>
        <Link
          href="/archive/new"
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          Create Archive
        </Link>
      </div>

      {archives.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-300 rounded">
          <p className="text-gray-600 mb-4">You haven't created any archives yet.</p>
          <p className="text-sm text-gray-600 mb-6">
            Archives are containers for your journal entries. Create one to get started!
          </p>
          <Link
            href="/archive/new"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Create Your First Archive
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {archives.map((archive) => (
            <Link
              key={archive.archiveId}
              href={`/archive/${archive.archiveId}`}
              className="block bg-white border border-gray-300 rounded p-6 hover:bg-gray-50 transition"
            >
              <h2 className="text-xl font-bold mb-2">{archive.title}</h2>
              {archive.description && (
                <p className="text-gray-600 mb-3">{archive.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Created {new Date(archive.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Last updated {new Date(archive.updatedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-300 rounded p-4">
        <h3 className="font-medium mb-2">About Archives</h3>
        <p className="text-sm text-gray-700">
          Each archive is a collection of journal entries. You can organize your writing into
          multiple archives (e.g., "Daily Thoughts", "Travel Journal", "Creative Writing").
          Click on an archive to view and create entries within it.
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
