// src/app/friends/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  getFriendRequests,
  updateFriendRequest,
  addFriend,
  getFriends,
  createFriendRequest,
  getUserByUsername,
} from '@/lib/firestore';
import type { FriendRequest, Friend } from '@/types';

function FriendsContent() {
  const { user } = useAuthContext();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const [friendsList, requestsList] = await Promise.all([
      getFriends(user.uid),
      getFriendRequests(user.uid),
    ]);
    setFriends(friendsList);
    setRequests(requestsList);
    setLoading(false);
  };

  const handleAcceptRequest = async (request: FriendRequest) => {
    if (!user) return;

    try {
      await updateFriendRequest(request.requestId, 'accepted');

      // Add bidirectional friendship
      await addFriend(user.uid, {
        friendUid: request.fromUid,
        friendUsername: request.fromUsername,
        createdAt: new Date(),
      });
      await addFriend(request.fromUid, {
        friendUid: user.uid,
        friendUsername: user.username,
        createdAt: new Date(),
      });

      await loadData();
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept friend request');
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await updateFriendRequest(requestId, 'declined');
      await loadData();
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Failed to decline friend request');
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !searchUsername.trim()) return;

    setSendingRequest(true);
    try {
      const targetUser = await getUserByUsername(searchUsername.toLowerCase());
      if (!targetUser) {
        alert('User not found');
        setSendingRequest(false);
        return;
      }

      if (targetUser.uid === user.uid) {
        alert('You cannot send a friend request to yourself');
        setSendingRequest(false);
        return;
      }

      await createFriendRequest({
        fromUid: user.uid,
        fromUsername: user.username,
        toUid: targetUser.uid,
        toUsername: targetUser.username,
        status: 'pending',
        createdAt: new Date(),
      });

      setSearchUsername('');
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send friend request');
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Friends</h1>

      {/* Send friend request */}
      <div className="bg-white border border-gray-300 rounded p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Send Friend Request</h2>
        <form onSubmit={handleSendRequest} className="flex gap-2">
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Enter username..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            type="submit"
            disabled={sendingRequest}
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
          >
            {sendingRequest ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </div>

      {/* Pending requests */}
      {requests.length > 0 && (
        <div className="bg-white border border-gray-300 rounded p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.requestId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <Link
                    href={`/u/${request.fromUsername}`}
                    className="font-medium hover:underline"
                  >
                    @{request.fromUsername}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(request.requestId)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      <div className="bg-white border border-gray-300 rounded p-6">
        <h2 className="text-xl font-bold mb-4">Your Friends ({friends.length})</h2>
        {friends.length === 0 ? (
          <p className="text-gray-600">
            You haven't added any friends yet. Send a friend request to get started!
          </p>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.friendUid}
                className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
              >
                <Link href={`/u/${friend.friendUsername}`} className="font-medium hover:underline">
                  @{friend.friendUsername}
                </Link>
                <span className="text-sm text-gray-600">
                  Friends since {new Date(friend.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FriendsPage() {
  return (
    <ProtectedRoute>
      <FriendsContent />
    </ProtectedRoute>
  );
}
