// src/app/page.tsx
'use client';

import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';

export default function Home() {
  const { user, loading } = useAuthContext();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6">After The Doll</h1>
        <p className="text-xl text-gray-700 mb-8">
          A calm, retro-inspired space for personal archiving and thoughtful conversation.
        </p>
      </div>

      <div className="prose prose-lg mx-auto mb-12">
        <h2>Welcome to your personal archive</h2>
        <p>
          This is not a social media platform. There are no likes, no reactions, no algorithms,
          and no endless scrolling. After The Doll is designed for journaling first, conversation
          second.
        </p>

        <h3>What you'll find here:</h3>
        <ul>
          <li>
            <strong>Your Archive:</strong> Create personal journal archives to organize your thoughts.
            Write editorial-style journal entries meant to be read later — months or even years from now.
            Tag them, organize them, and keep them private, share with friends, or make them public.
          </li>
          <li>
            <strong>Thoughtful Discussion:</strong> Friends can comment on your entries or ask
            questions. No likes, no scores, just conversation.
          </li>
          <li>
            <strong>Classic Forums:</strong> Join broader discussions in traditional forum
            categories. Simple threads, simple replies.
          </li>
          <li>
            <strong>No Dopamine Tricks:</strong> No infinite scroll, no notifications designed to
            pull you back in, no influencer mechanics. Just a calm space to write and reflect.
          </li>
        </ul>

        <h3>Why "After The Doll"?</h3>
        <p>
          The name evokes a nostalgic era of early personal web pages and genuine online
          communities — before everything became about engagement metrics and viral content. This
          is a return to slower, more intentional online spaces.
        </p>
      </div>

      <div className="text-center">
        {!loading && (
          <>
            {user ? (
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 bg-gray-900 text-white rounded text-lg font-medium hover:bg-gray-800"
              >
                Go to My Archives
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-block px-8 py-3 bg-gray-900 text-white rounded text-lg font-medium hover:bg-gray-800 mr-4"
                >
                  Create Your Archive
                </Link>
                <Link
                  href="/login"
                  className="inline-block px-8 py-3 bg-white text-gray-900 border-2 border-gray-900 rounded text-lg font-medium hover:bg-gray-100"
                >
                  Login
                </Link>
              </>
            )}
          </>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <p className="text-center text-gray-600">
          Or browse the{' '}
          <Link href="/forum" className="underline hover:text-gray-900">
            public forums
          </Link>{' '}
          to see what people are discussing.
        </p>
      </div>
    </div>
  );
}
