// src/app/forum/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getForumCategories } from '@/lib/firestore';
import type { ForumCategory } from '@/types';

export default function ForumIndexPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const fetchedCategories = await getForumCategories();
    setCategories(fetchedCategories);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading forum...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Forum</h1>

      {categories.length === 0 ? (
        <div className="bg-white border border-gray-300 rounded p-8 text-center">
          <p className="text-gray-600 mb-4">No forum categories have been created yet.</p>
          <p className="text-sm text-gray-600">
            An administrator needs to create categories in the Firebase Console.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <Link
              key={category.categoryId}
              href={`/forum/${category.categoryId}`}
              className="block bg-white border border-gray-300 rounded p-6 hover:bg-gray-50 transition"
            >
              <h2 className="text-xl font-bold mb-2">{category.name}</h2>
              <p className="text-gray-600">{category.description}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-300 rounded p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Forum categories are managed by administrators. If you need a new
          category created, please contact the site administrator.
        </p>
      </div>
    </div>
  );
}
