'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface Insight {
  id: string;
  userId: string;
  userHandle: string;
  userAvatar: string;
  title?: string;
  content: string;
  countries: string[];
  indicators: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: string;
  likes: number;
  shares: number;
  views: number;
}

interface InsightsFeedProps {
  className?: string;
  limit?: number;
}

export default function InsightsFeed({ className = '', limit = 10 }: InsightsFeedProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newInsight, setNewInsight] = useState<{ title: string; content: string; sentiment: 'bullish' | 'bearish' | 'neutral' }>({ title: '', content: '', sentiment: 'neutral' });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');

  const [userId] = useState(() => 
    typeof window !== 'undefined' 
      ? localStorage.getItem('userId') || `user_${Date.now()}`
      : 'anonymous'
  );

  useEffect(() => {
    fetchInsights();
    const interval = setInterval(fetchInsights, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [filter]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const filters = filter !== 'all' ? { sentiment: filter } : {};
      const response = await api.getSocialInsights(limit, filters);
      if (response.success) {
        setInsights(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsight.content.trim() || submitting) return;

    try {
      setSubmitting(true);
      const response = await api.shareInsight(userId, {
        title: newInsight.title,
        content: newInsight.content,
        sentiment: newInsight.sentiment,
      });

      if (response.success) {
        setInsights(prev => [response.data, ...prev]);
        setNewInsight({ title: '', content: '', sentiment: 'neutral' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to share insight:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'bearish': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '🐂';
      case 'bearish': return '🐻';
      default: return '⚖️';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h3 className="font-bold text-white">Market Insights</h3>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {showForm ? 'Cancel' : '+ Share Insight'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex gap-2 overflow-x-auto">
        {(['all', 'bullish', 'bearish', 'neutral'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f === 'all' ? '📊 All' : `${getSentimentIcon(f)} ${f.charAt(0).toUpperCase() + f.slice(1)}`}
          </button>
        ))}
      </div>

      {/* New Insight Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={newInsight.title}
            onChange={(e) => setNewInsight({ ...newInsight, title: e.target.value })}
            placeholder="Title (optional)"
            className="w-full px-4 py-2 mb-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <textarea
            value={newInsight.content}
            onChange={(e) => setNewInsight({ ...newInsight, content: e.target.value })}
            placeholder="Share your market analysis or prediction..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              {(['bullish', 'neutral', 'bearish'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewInsight({ ...newInsight, sentiment: s })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    newInsight.sentiment === s
                      ? getSentimentColor(s) + ' ring-2 ring-offset-2 ring-blue-500'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {getSentimentIcon(s)} {s}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={!newInsight.content.trim() || submitting}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-pink-700 transition-all"
            >
              {submitting ? 'Sharing...' : 'Share Insight'}
            </button>
          </div>
        </form>
      )}

      {/* Insights List */}
      <div className="max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading insights...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <span className="text-4xl block mb-2">💭</span>
            <p>No insights yet</p>
            <p className="text-sm mt-1">Be the first to share your market analysis!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-2xl flex-shrink-0">
                    {insight.userAvatar || '🧑‍💼'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {insight.userHandle}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(insight.sentiment)}`}>
                        {getSentimentIcon(insight.sentiment)} {insight.sentiment}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    {insight.title && (
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {insight.title}
                      </h4>
                    )}
                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                      {insight.content}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors text-sm">
                        ❤️ <span>{insight.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors text-sm">
                        🔄 <span>{insight.shares}</span>
                      </button>
                      <span className="flex items-center gap-1 text-gray-400 text-sm">
                        👁️ <span>{insight.views}</span>
                      </span>
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
