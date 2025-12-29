// src/app/u/[username]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';
import JournalEntry from '@/components/JournalEntry';
import { getUserByUsername, getEntriesByUser, areFriends } from '@/lib/firestore';
import type { User, JournalEntry as JournalEntryType } from '@/types';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { user: currentUser } = useAuthContext();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [params.username, currentUser]);

  const loadProfile = async () => {
    const user = await getUserByUsername(params.username);
    if (!user) {
      setLoading(false);
      return;
    }

    setProfileUser(user);

    // Check friendship status
    let friendStatus = false;
    if (currentUser && currentUser.uid !== user.uid) {
      friendStatus = await areFriends(currentUser.uid, user.uid);
      setIsFriend(friendStatus);
    }

    // Determine which entries the current user can see
    let visibilityFilter: string[] = ['public'];
    if (currentUser && currentUser.uid === user.uid) {
      // User viewing their own profile - can see everything
      visibilityFilter = ['public', 'friends', 'private'];
    } else if (friendStatus) {
      // Viewing friend's profile - can see public and friends-only
      visibilityFilter = ['public', 'friends'];
    }

    const fetchedEntries = await getEntriesByUser(user.uid, visibilityFilter);
    setEntries(fetchedEntries);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-6">The user @{params.username} does not exist.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?.uid === profileUser.uid;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-white border border-gray-300 rounded p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{profileUser.displayName}</h1>
            <p className="text-gray-600 mb-4">@{profileUser.username}</p>
            {profileUser.bio && <p className="text-gray-800 mb-4">{profileUser.bio}</p>}
            <p className="text-sm text-gray-600">
              Member since {new Date(profileUser.createdAt).toLocaleDateString()}
            </p>
          </div>
          {isOwnProfile && (
            <Link
              href="/settings"
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* Entries */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {isOwnProfile ? 'Your Entries' : `${profileUser.displayName}'s Entries`}
        </h2>
        {entries.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded p-8 text-center text-gray-600">
            {isOwnProfile ? (
              <>
                <p className="mb-4">You haven't written any entries yet.</p>
                <Link
                  href="/new"
                  className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800"
                >
                  Create Your First Entry
                </Link>
              </>
            ) : (
              <p>This user hasn't shared any public entries yet.</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.entryId}>
                <JournalEntry entry={entry} />
                {isOwnProfile && (
                  <div className="mt-2 flex gap-2">
                    <Link
                      href={`/edit/${entry.entryId}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
