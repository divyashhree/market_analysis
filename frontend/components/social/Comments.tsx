'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  userId: string;
  userHandle: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  country?: string;
  indicator?: string;
}

interface CommentsProps {
  country?: string;
  indicator?: string;
  pageId?: string;
  className?: string;
}

export default function Comments({ country, indicator, pageId, className = '' }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId] = useState(() => 
    typeof window !== 'undefined' 
      ? localStorage.getItem('userId') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : 'anonymous'
  );

  // Save userId to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getComments(country, indicator, 50);
      if (response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  }, [country, indicator]);

  useEffect(() => {
    fetchComments();
    // Refresh comments every 30 seconds
    const interval = setInterval(fetchComments, 30000);
    return () => clearInterval(interval);
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const response = await api.postComment(userId, {
        country,
        indicator,
        text: newComment.trim(),
        pageId,
      });

      if (response.success) {
        setComments(prev => [response.data, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await api.addReaction(userId, commentId, 'like');
      setComments(prev =>
        prev.map(c =>
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
      );
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <h3 className="font-bold text-white">Discussion</h3>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white ml-auto">
            {comments.length} comments
          </span>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {userId.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your market insights..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {country && `Discussing ${country}`}
                {indicator && ` - ${indicator}`}
              </span>
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Posting...
                  </span>
                ) : (
                  'Post Comment'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <span className="text-4xl block mb-2">🗣️</span>
            <p>No comments yet</p>
            <p className="text-sm mt-1">Be the first to share your insights!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                    {comment.userAvatar || '🧑‍💼'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {comment.userHandle}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors text-sm"
                      >
                        <span className="hover:animate-bounce">❤️</span>
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-gray-500 hover:text-blue-500 transition-colors text-sm">
                        💬 Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
