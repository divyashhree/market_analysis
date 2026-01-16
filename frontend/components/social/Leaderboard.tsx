'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface LeaderboardEntry {
  handle: string;
  avatar: string;
  score: number;
  stats: {
    comments: number;
    reactions: number;
    insightsShared: number;
  };
}

interface LeaderboardProps {
  className?: string;
  limit?: number;
}

export default function Leaderboard({ className = '', limit = 10 }: LeaderboardProps) {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60000);
    return () => clearInterval(interval);
  }, [limit]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.getLeaderboard(limit);
      if (response.success) {
        setLeaders(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 0: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 1: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 2: return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default: return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${rank + 1}`;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <h3 className="font-bold text-white">Top Analysts</h3>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            ))}
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <span className="text-4xl block mb-2">🏅</span>
            <p>No leaders yet</p>
            <p className="text-sm mt-1">Start contributing to climb the ranks!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, index) => (
              <div
                key={leader.handle}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02] ${
                  index < 3 ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700' : ''
                }`}
              >
                {/* Rank Badge */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getRankStyle(index)}`}>
                  {index < 3 ? getRankIcon(index) : index + 1}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                  {leader.avatar}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {leader.handle}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>💬 {leader.stats.comments}</span>
                    <span>💡 {leader.stats.insightsShared}</span>
                    <span>❤️ {leader.stats.reactions}</span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {leader.score}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
