// src/components/ForumThreadList.tsx
'use client';

import Link from 'next/link';
import type { ForumThread } from '@/types';

interface ForumThreadListProps {
  threads: ForumThread[];
}

export default function ForumThreadList({ threads }: ForumThreadListProps) {
  if (threads.length === 0) {
    return <p className="text-gray-600">No threads yet. Start the discussion!</p>;
  }

  return (
    <div className="space-y-3">
      {threads.map((thread) => (
        <div
          key={thread.threadId}
          className="border border-gray-300 bg-white p-4 rounded hover:bg-gray-50 transition"
        >
          <Link href={`/forum/thread/${thread.threadId}`}>
            <h3 className="text-lg font-bold hover:underline mb-2">{thread.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>by @{thread.authorUsername}</span>
              <span>•</span>
              <span>
                Last reply: {new Date(thread.lastReplyAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
