// src/components/JournalEntry.tsx
'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { JournalEntry as JournalEntryType } from '@/types';

interface JournalEntryProps {
  entry: JournalEntryType;
  showFullContent?: boolean;
}

export default function JournalEntry({ entry, showFullContent = false }: JournalEntryProps) {
  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const preview = entry.body.slice(0, 200) + (entry.body.length > 200 ? '...' : '');

  return (
    <article className="border border-gray-300 bg-white p-6 mb-6 rounded shadow-sm">
      <header className="mb-4">
        <h2 className="text-2xl font-bold mb-2">
          {showFullContent ? (
            entry.title
          ) : (
            <Link
              href={`/u/${entry.authorUsername}/entry/${entry.entryId}`}
              className="hover:underline"
            >
              {entry.title}
            </Link>
          )}
        </h2>
        <div className="text-sm text-gray-600 flex items-center gap-4">
          <span>{formattedDate}</span>
          {entry.tags.length > 0 && (
            <div className="flex gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-200 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <span className="px-2 py-1 bg-gray-200 rounded text-xs">{entry.visibility}</span>
        </div>
      </header>
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{showFullContent ? entry.body : preview}</ReactMarkdown>
      </div>
      {!showFullContent && entry.body.length > 200 && (
        <div className="mt-4">
          <Link
            href={`/u/${entry.authorUsername}/entry/${entry.entryId}`}
            className="text-sm font-medium hover:underline"
          >
            Read more →
          </Link>
        </div>
      )}
    </article>
  );
}
