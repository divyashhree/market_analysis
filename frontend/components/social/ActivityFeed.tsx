'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useWebSocket } from '@/lib/useWebSocket';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  className?: string;
  maxItems?: number;
}

export default function ActivityFeed({ className = '', maxItems = 15 }: ActivityFeedProps) {
  const { connected, activeUsers, activities } = useWebSocket();
  const [isExpanded, setIsExpanded] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_joined': return '👋';
      case 'new_comment': return '💬';
      case 'new_insight': return '💡';
      case 'reaction': return '❤️';
      case 'alert_triggered': return '🚨';
      default: return '📢';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_joined': return 'bg-green-100 dark:bg-green-900/30 border-green-500';
      case 'new_comment': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-500';
      case 'new_insight': return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500';
      case 'reaction': return 'bg-pink-100 dark:bg-pink-900/30 border-pink-500';
      case 'alert_triggered': return 'bg-red-100 dark:bg-red-900/30 border-red-500';
      default: return 'bg-gray-100 dark:bg-gray-800 border-gray-500';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📡</span>
          <h3 className="font-bold text-white">Live Activity</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-xs text-white/80">{connected ? 'Live' : 'Offline'}</span>
          </div>
          <div className="bg-white/20 px-2 py-0.5 rounded-full">
            <span className="text-xs text-white">👥 {activeUsers} online</span>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className={`overflow-y-auto transition-all duration-300 ${isExpanded ? 'max-h-[500px]' : 'max-h-[300px]'}`}>
        {activities.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <span className="text-4xl block mb-2">🌐</span>
            <p>Waiting for live activity...</p>
            <p className="text-sm mt-1">Connect to see real-time updates!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {activities.slice(0, maxItems).map((activity, index) => (
              <div
                key={activity.id || index}
                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                  animate-slide-in border-l-4 ${getActivityColor(activity.type)}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.timestamp && formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {activities.length} events
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
