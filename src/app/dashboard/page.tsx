// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import JournalEntry from '@/components/JournalEntry';
import { getEntriesByUser } from '@/lib/firestore';
import type { JournalEntry as JournalEntryType } from '@/types';

function DashboardContent() {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    const fetchedEntries = await getEntriesByUser(user.uid);
    setEntries(fetchedEntries);
    setLoading(false);
  };

  // Get all unique tags
  const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags)));

  // Filter entries by selected tag
  const filteredEntries = selectedTag
    ? entries.filter((entry) => entry.tags.includes(selectedTag))
    : entries;

  // Group entries by month/year
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = new Date(entry.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(entry);
    return groups;
  }, {} as Record<string, JournalEntryType[]>);

  const sortedMonths = Object.keys(groupedEntries).sort().reverse();

  if (loading) {
    return <div className="text-center py-8">Loading your archive...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Archive</h1>
        <Link
          href="/new"
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          New Entry
        </Link>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded text-sm ${
              selectedTag === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded text-sm ${
                selectedTag === tag
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Entries grouped by month */}
      {sortedMonths.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-300 rounded">
          <p className="text-gray-600 mb-4">Your archive is empty. Start writing!</p>
          <Link
            href="/new"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Create Your First Entry
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedMonths.map((monthKey) => {
            const [year, month] = monthKey.split('-');
            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
              'en-US',
              { year: 'numeric', month: 'long' }
            );

            return (
              <div key={monthKey}>
                <h2 className="text-xl font-bold mb-4 text-gray-700">{monthName}</h2>
                {groupedEntries[monthKey].map((entry) => (
                  <JournalEntry key={entry.entryId} entry={entry} />
                ))}
              </div>
            );
          })}
        </div>
      )}
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
