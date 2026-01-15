'use client';

import { useState, useEffect, useCallback } from 'react';

interface LiveIndicatorProps {
  lastUpdated: Date;
  onRefresh?: () => void;
  autoRefreshInterval?: number; // seconds
  className?: string;
}

export default function LiveIndicator({
  lastUpdated,
  onRefresh,
  autoRefreshInterval = 0,
  className = '',
}: LiveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('just now');
  const [countdown, setCountdown] = useState(autoRefreshInterval);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Format time ago
  const formatTimeAgo = useCallback((date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }, []);

  // Update time ago every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(lastUpdated));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastUpdated, formatTimeAgo]);

  // Auto-refresh countdown
  useEffect(() => {
    if (autoRefreshInterval <= 0 || !onRefresh) return;

    setCountdown(autoRefreshInterval);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleRefresh();
          return autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [autoRefreshInterval, onRefresh, lastUpdated]);

  const handleRefresh = async () => {
    if (isRefreshing || !onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Pulsing live dot */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
        </div>
        <span className="text-sm font-medium text-green-600 dark:text-green-400">LIVE</span>
      </div>

      {/* Time ago */}
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Updated {timeAgo}
      </span>

      {/* Refresh button */}
      {onRefresh && (
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
            bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
            hover:bg-blue-200 dark:hover:bg-blue-900/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          `}
        >
          <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
          {autoRefreshInterval > 0 && !isRefreshing && (
            <span className="text-xs opacity-70">{countdown}s</span>
          )}
        </button>
      )}
    </div>
  );
}
