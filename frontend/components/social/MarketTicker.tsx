'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useWebSocket } from '@/lib/useWebSocket';

interface MarketTickerProps {
  className?: string;
}

const defaultData = [
  { code: 'US', flag: '🇺🇸', name: 'S&P 500', change: 0.42, value: 5891.23 },
  { code: 'IN', flag: '🇮🇳', name: 'NIFTY 50', change: -0.28, value: 24620.45 },
  { code: 'GB', flag: '🇬🇧', name: 'FTSE 100', change: 0.15, value: 8234.12 },
  { code: 'JP', flag: '🇯🇵', name: 'Nikkei 225', change: 1.23, value: 39456.78 },
  { code: 'DE', flag: '🇩🇪', name: 'DAX', change: 0.67, value: 19234.56 },
  { code: 'CN', flag: '🇨🇳', name: 'Shanghai', change: -0.45, value: 3287.34 },
  { code: 'FR', flag: '🇫🇷', name: 'CAC 40', change: 0.33, value: 7645.23 },
  { code: 'BR', flag: '🇧🇷', name: 'Bovespa', change: -1.12, value: 127543.21 },
];

// Consistent number formatting to avoid hydration mismatch
const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export default function MarketTicker({ className = '' }: MarketTickerProps) {
  const { connected, marketUpdates } = useWebSocket();
  const [tickerData, setTickerData] = useState(defaultData);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure client-side only rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update with real-time data
  useEffect(() => {
    if (Object.keys(marketUpdates).length > 0) {
      setTickerData(prev =>
        prev.map(item => {
          const update = marketUpdates[item.code];
          if (update) {
            return {
              ...item,
              change: update.stockChange,
            };
          }
          return item;
        })
      );
    }
  }, [marketUpdates]);

  // Show loading placeholder until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-2 h-10 ${className}`}>
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10 flex items-center pl-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-xs text-gray-400 font-medium">LIVE</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-2 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Live indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10 flex items-center pl-3">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400 font-medium">LIVE</span>
        </div>
      </div>

      {/* Ticker content */}
      <div className={`flex ${isPaused ? '' : 'animate-ticker'}`}>
        {[...tickerData, ...tickerData].map((item, index) => (
          <div
            key={`${item.code}-${index}`}
            className="flex items-center gap-3 px-6 whitespace-nowrap"
          >
            <span className="text-lg">{item.flag}</span>
            <span className="text-white font-medium">{item.name}</span>
            <span className="text-gray-400">{formatNumber(item.value)}</span>
            <span className={`font-semibold ${
              item.change > 0 ? 'text-green-400' : item.change < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {item.change > 0 ? '▲' : item.change < 0 ? '▼' : '●'}
              {Math.abs(item.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10" />

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
