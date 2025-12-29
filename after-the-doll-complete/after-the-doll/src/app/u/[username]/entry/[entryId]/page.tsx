// src/app/u/[username]/entry/[entryId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';
import JournalEntry from '@/components/JournalEntry';
import CommentSection from '@/components/CommentSection';
import { getEntry, areFriends } from '@/lib/firestore';
import type { JournalEntry as JournalEntryType } from '@/types';

export default function EntryDetailPage({
  params,
}: {
  params: { username: string; entryId: string };
}) {
  const { user } = useAuthContext();
  const [entry, setEntry] = useState<JournalEntryType | null>(null);
  const [canView, setCanView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [params.entryId, user]);

  const loadEntry = async () => {
    const fetchedEntry = await getEntry(params.entryId);
    if (!fetchedEntry) {
      setLoading(false);
      return;
    }

    setEntry(fetchedEntry);

    // Determine if current user can view this entry
    let canViewEntry = false;

    if (fetchedEntry.visibility === 'public') {
      canViewEntry = true;
    } else if (user && user.uid === fetchedEntry.authorUid) {
      // Owner can always view their own entries
      canViewEntry = true;
    } else if (user && fetchedEntry.visibility === 'friends') {
      // Check if they are friends
      const friendStatus = await areFriends(user.uid, fetchedEntry.authorUid);
      canViewEntry = friendStatus;
    }

    setCanView(canViewEntry);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!entry || !canView) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Entry Not Found</h1>
        <p className="text-gray-600 mb-6">
          This entry doesn't exist or you don't have permission to view it.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  const isOwner = user?.uid === entry.authorUid;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link
          href={`/u/${entry.authorUsername}`}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to @{entry.authorUsername}'s profile
        </Link>
      </div>

      <JournalEntry entry={entry} showFullContent={true} />

      {isOwner && (
        <div className="mb-6">
          <Link
            href={`/edit/${entry.entryId}`}
            className="inline-block px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-sm"
          >
            Edit Entry
          </Link>
        </div>
      )}

      <CommentSection entryId={entry.entryId} />
    </div>
  );
}
