'use client';

import { useState, useEffect } from 'react';

interface LiveIndicatorProps {
  lastUpdated?: Date;
  isLoading?: boolean;
  onRefresh?: () => void;
  autoRefreshInterval?: number; // in seconds
}

export default function LiveIndicator({
  lastUpdated,
  isLoading = false,
  onRefresh,
  autoRefreshInterval = 0,
}: LiveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('');
  const [countdown, setCountdown] = useState(autoRefreshInterval);

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastUpdated) return;
      
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
      
      if (diff < 60) {
        setTimeAgo(`${diff}s ago`);
      } else if (diff < 3600) {
        setTimeAgo(`${Math.floor(diff / 60)}m ago`);
      } else {
        setTimeAgo(`${Math.floor(diff / 3600)}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  useEffect(() => {
    if (autoRefreshInterval > 0 && onRefresh) {
      setCountdown(autoRefreshInterval);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            onRefresh();
            return autoRefreshInterval;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval, onRefresh]);

  return (
    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2">
      {/* Live Dot */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className={`
            animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
            ${isLoading ? 'bg-yellow-400' : 'bg-green-400'}
          `} />
          <span className={`
            relative inline-flex rounded-full h-3 w-3
            ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}
          `} />
        </span>
        <span className={`text-sm font-medium ${isLoading ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
          {isLoading ? 'Updating...' : 'Live'}
        </span>
      </div>

      {/* Last Updated */}
      {lastUpdated && !isLoading && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Updated {timeAgo}
        </span>
      )}

      {/* Auto-refresh countdown */}
      {autoRefreshInterval > 0 && !isLoading && (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Next update in {countdown}s
        </span>
      )}

      {/* Manual Refresh Button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`
            p-1.5 rounded-lg transition-all duration-200
            ${isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95'}
          `}
        >
          <svg 
            className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
      )}
    </div>
  );
}
