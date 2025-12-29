// src/types/index.ts

export type ThemePreset = 'vintage' | 'ocean' | 'forest' | 'sunset';

export type Visibility = 'public' | 'friends' | 'private';

export type CommentType = 'comment' | 'question';

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface User {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  themePreset: ThemePreset;
  createdAt: Date;
}

export interface JournalEntry {
  entryId: string;
  authorUid: string;
  authorUsername: string;
  title: string;
  body: string; // Markdown content
  tags: string[];
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  commentId: string;
  authorUid: string;
  authorUsername: string;
  type: CommentType;
  body: string;
  createdAt: Date;
}

export interface FriendRequest {
  requestId: string;
  fromUid: string;
  fromUsername: string;
  toUid: string;
  toUsername: string;
  status: FriendRequestStatus;
  createdAt: Date;
}

export interface Friend {
  friendUid: string;
  friendUsername: string;
  createdAt: Date;
}

export interface ForumCategory {
  categoryId: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface ForumThread {
  threadId: string;
  categoryId: string;
  title: string;
  body: string;
  authorUid: string;
  authorUsername: string;
  createdAt: Date;
  lastReplyAt: Date;
}

export interface ForumReply {
  replyId: string;
  body: string;
  authorUid: string;
  authorUsername: string;
  createdAt: Date;
}
