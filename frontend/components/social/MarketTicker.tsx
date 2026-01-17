'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useWebSocket } from '@/lib/useWebSocket';

interface MarketTickerProps {
  className?: string;
}

interface TickerItem {
  code: string;
  flag: string;
  name: string;
  change: number;
  value: number;
}

// Consistent number formatting to avoid hydration mismatch
const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// Stock index info mapping
const STOCK_INFO: Record<string, { flag: string; name: string }> = {
  US: { flag: '🇺🇸', name: 'S&P 500' },
  IN: { flag: '🇮🇳', name: 'NIFTY 50' },
  GB: { flag: '🇬🇧', name: 'FTSE 100' },
  JP: { flag: '🇯🇵', name: 'Nikkei 225' },
  DE: { flag: '🇩🇪', name: 'DAX' },
  CN: { flag: '🇨🇳', name: 'Shanghai' },
  FR: { flag: '🇫🇷', name: 'CAC 40' },
  BR: { flag: '🇧🇷', name: 'Bovespa' },
};

export default function MarketTicker({ className = '' }: MarketTickerProps) {
  const { connected, marketUpdates } = useWebSocket();
  const [tickerData, setTickerData] = useState<TickerItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ensure client-side only rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real stock data on mount
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await api.getGlobalStocks();
        if (response.success && response.data && Array.isArray(response.data)) {
          const formattedData: TickerItem[] = response.data
            .filter(item => STOCK_INFO[item.code])
            .map(item => ({
              code: item.code,
              flag: STOCK_INFO[item.code]?.flag || '🌍',
              name: item.indexName || STOCK_INFO[item.code]?.name || item.code,
              change: item.latestChange || 0,
              value: item.latestValue || 0,
            }));
          
          if (formattedData.length > 0) {
            setTickerData(formattedData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
        // Keep empty state - will show loading or use WebSocket updates
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  // Update with real-time WebSocket data
  useEffect(() => {
    if (Object.keys(marketUpdates).length > 0) {
      setTickerData(prev => {
        if (prev.length === 0) {
          // Create initial data from WebSocket updates
          return Object.entries(marketUpdates).map(([code, update]) => ({
            code,
            flag: STOCK_INFO[code]?.flag || '🌍',
            name: STOCK_INFO[code]?.name || code,
            change: update.stockChange || 0,
            value: update.value || 0,
          }));
        }
        
        // Update existing data with WebSocket values
        return prev.map(item => {
          const update = marketUpdates[item.code];
          if (update) {
            return {
              ...item,
              change: update.stockChange || item.change,
              value: update.value || item.value,
            };
          }
          return item;
        });
      });
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

  // Show loading state while fetching data
  if (loading && tickerData.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-2 h-10 ${className}`}>
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10 flex items-center pl-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">LOADING</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-400 text-sm">Fetching market data...</span>
        </div>
      </div>
    );
  }

  // Show message if no data available
  if (tickerData.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-2 h-10 ${className}`}>
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10 flex items-center pl-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-400 font-medium">LIVE</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-400 text-sm">Waiting for market data...</span>
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
