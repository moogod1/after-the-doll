// src/components/CommentSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from './AuthProvider';
import { createComment, getComments } from '@/lib/firestore';
import type { Comment, CommentType } from '@/types';

interface CommentSectionProps {
  entryId: string;
}

export default function CommentSection({ entryId }: CommentSectionProps) {
  const { user } = useAuthContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [commentType, setCommentType] = useState<CommentType>('comment');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [entryId]);

  const loadComments = async () => {
    const fetchedComments = await getComments(entryId);
    setComments(fetchedComments);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentBody.trim()) return;

    setSubmitting(true);
    try {
      await createComment(entryId, {
        authorUid: user.uid,
        authorUsername: user.username,
        type: commentType,
        body: commentBody,
        createdAt: new Date(),
      });
      setCommentBody('');
      setCommentType('comment');
      await loadComments();
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading comments...</div>;
  }

  return (
    <div className="mt-8 border-t border-gray-300 pt-8">
      <h3 className="text-xl font-bold mb-4">Discussion</h3>

      {/* Comment form - only show if user is logged in */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded border border-gray-300">
          <div className="mb-3">
            <label className="flex items-center gap-4 text-sm mb-2">
              <span className="font-medium">Type:</span>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="comment"
                  checked={commentType === 'comment'}
                  onChange={(e) => setCommentType(e.target.value as CommentType)}
                />
                Comment
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="question"
                  checked={commentType === 'question'}
                  onChange={(e) => setCommentType(e.target.value as CommentType)}
                />
                Question
              </label>
            </label>
          </div>
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder={commentType === 'question' ? 'Ask a question...' : 'Write a comment...'}
            className="w-full p-3 border border-gray-300 rounded resize-none"
            rows={3}
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting || !commentBody.trim()}
            className="mt-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.commentId}
              className={`p-4 rounded border ${
                comment.type === 'question'
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">@{comment.authorUsername}</span>
                  {comment.type === 'question' && (
                    <span className="px-2 py-1 bg-blue-200 text-blue-900 text-xs rounded font-medium">
                      QUESTION
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{comment.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
