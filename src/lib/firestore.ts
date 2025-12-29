// src/lib/firestore.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  User,
  JournalEntry,
  Comment,
  FriendRequest,
  Friend,
  ForumCategory,
  ForumThread,
  ForumReply,
} from '@/types';

// Helper to convert Firestore timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// User functions
export async function createUser(user: User): Promise<void> {
  await setDoc(doc(db, 'users', user.uid), {
    ...user,
    createdAt: Timestamp.fromDate(user.createdAt),
  });
  // Reserve username
  await setDoc(doc(db, 'usernames', user.username), {
    uid: user.uid,
  });
}

export async function getUserByUid(uid: string): Promise<User | null> {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
  } as User;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const usernameDoc = await getDoc(doc(db, 'usernames', username));
  if (!usernameDoc.exists()) return null;
  const uid = usernameDoc.data().uid;
  return getUserByUid(uid);
}

export async function updateUser(uid: string, updates: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), updates);
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const docSnap = await getDoc(doc(db, 'usernames', username));
  return !docSnap.exists();
}

// Journal entry functions
export async function createEntry(entry: Omit<JournalEntry, 'entryId'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'entries'), {
    ...entry,
    createdAt: Timestamp.fromDate(entry.createdAt),
    updatedAt: Timestamp.fromDate(entry.updatedAt),
  });
  await updateDoc(docRef, { entryId: docRef.id });
  return docRef.id;
}

export async function getEntry(entryId: string): Promise<JournalEntry | null> {
  const docSnap = await getDoc(doc(db, 'entries', entryId));
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as JournalEntry;
}

export async function getEntriesByUser(
  authorUid: string,
  visibilityFilter?: string[]
): Promise<JournalEntry[]> {
  let q = query(
    collection(db, 'entries'),
    where('authorUid', '==', authorUid),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  let entries = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as JournalEntry;
  });

  if (visibilityFilter) {
    entries = entries.filter((e) => visibilityFilter.includes(e.visibility));
  }

  return entries;
}

export async function updateEntry(entryId: string, updates: Partial<JournalEntry>): Promise<void> {
  await updateDoc(doc(db, 'entries', entryId), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteEntry(entryId: string): Promise<void> {
  await deleteDoc(doc(db, 'entries', entryId));
}

// Comment functions
export async function createComment(
  entryId: string,
  comment: Omit<Comment, 'commentId'>
): Promise<string> {
  const docRef = await addDoc(collection(db, 'entries', entryId, 'comments'), {
    ...comment,
    createdAt: Timestamp.fromDate(comment.createdAt),
  });
  await updateDoc(docRef, { commentId: docRef.id });
  return docRef.id;
}

export async function getComments(entryId: string): Promise<Comment[]> {
  const q = query(
    collection(db, 'entries', entryId, 'comments'),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
    } as Comment;
  });
}

// Friend request functions
export async function createFriendRequest(
  request: Omit<FriendRequest, 'requestId'>
): Promise<string> {
  const docRef = await addDoc(collection(db, 'friendRequests'), {
    ...request,
    createdAt: Timestamp.fromDate(request.createdAt),
  });
  await updateDoc(docRef, { requestId: docRef.id });
  return docRef.id;
}

export async function getFriendRequests(uid: string): Promise<FriendRequest[]> {
  const q = query(
    collection(db, 'friendRequests'),
    where('toUid', '==', uid),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
    } as FriendRequest;
  });
}

export async function updateFriendRequest(
  requestId: string,
  status: 'accepted' | 'declined'
): Promise<void> {
  await updateDoc(doc(db, 'friendRequests', requestId), { status });
}

export async function addFriend(uid: string, friend: Friend): Promise<void> {
  await setDoc(doc(db, 'friends', uid, 'list', friend.friendUid), {
    ...friend,
    createdAt: Timestamp.fromDate(friend.createdAt),
  });
}

export async function getFriends(uid: string): Promise<Friend[]> {
  const snapshot = await getDocs(collection(db, 'friends', uid, 'list'));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
    } as Friend;
  });
}

export async function areFriends(uid1: string, uid2: string): Promise<boolean> {
  const docSnap = await getDoc(doc(db, 'friends', uid1, 'list', uid2));
  return docSnap.exists();
}

// Forum functions
export async function getForumCategories(): Promise<ForumCategory[]> {
  const q = query(collection(db, 'forumCategories'), orderBy('sortOrder', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as ForumCategory);
}

export async function getForumCategory(categoryId: string): Promise<ForumCategory | null> {
  const docSnap = await getDoc(doc(db, 'forumCategories', categoryId));
  if (!docSnap.exists()) return null;
  return docSnap.data() as ForumCategory;
}

export async function createForumThread(
  thread: Omit<ForumThread, 'threadId'>
): Promise<string> {
  const docRef = await addDoc(collection(db, 'forumThreads'), {
    ...thread,
    createdAt: Timestamp.fromDate(thread.createdAt),
    lastReplyAt: Timestamp.fromDate(thread.lastReplyAt),
  });
  await updateDoc(docRef, { threadId: docRef.id });
  return docRef.id;
}

export async function getForumThread(threadId: string): Promise<ForumThread | null> {
  const docSnap = await getDoc(doc(db, 'forumThreads', threadId));
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    lastReplyAt: timestampToDate(data.lastReplyAt),
  } as ForumThread;
}

export async function getThreadsByCategory(categoryId: string): Promise<ForumThread[]> {
  const q = query(
    collection(db, 'forumThreads'),
    where('categoryId', '==', categoryId),
    orderBy('lastReplyAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      lastReplyAt: timestampToDate(data.lastReplyAt),
    } as ForumThread;
  });
}

export async function createForumReply(
  threadId: string,
  reply: Omit<ForumReply, 'replyId'>
): Promise<string> {
  const docRef = await addDoc(collection(db, 'forumThreads', threadId, 'replies'), {
    ...reply,
    createdAt: Timestamp.fromDate(reply.createdAt),
  });
  await updateDoc(docRef, { replyId: docRef.id });

  // Update thread's lastReplyAt
  await updateDoc(doc(db, 'forumThreads', threadId), {
    lastReplyAt: Timestamp.fromDate(reply.createdAt),
  });

  return docRef.id;
}

export async function getForumReplies(threadId: string): Promise<ForumReply[]> {
  const q = query(
    collection(db, 'forumThreads', threadId, 'replies'),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
    } as ForumReply;
  });
}
