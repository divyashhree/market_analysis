'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/lib/useWebSocket';

// Consistent date formatting to avoid hydration mismatch
const formatDate = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Unknown';
  }
};

interface MarketAlertsProps {
  className?: string;
}

export default function MarketAlerts({ className = '' }: MarketAlertsProps) {
  const { alerts, subscribeToAlert, connected } = useWebSocket();
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    country: 'US',
    type: 'stock_change',
    threshold: 1.0,
  });

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  ];

  const handleCreateAlert = () => {
    subscribeToAlert(newAlert);
    setShowForm(false);
    setNewAlert({ country: 'US', type: 'stock_change', threshold: 1.0 });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <h3 className="font-bold text-white">Market Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-300 animate-pulse' : 'bg-gray-300'}`} />
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {showForm ? 'Cancel' : '+ Add Alert'}
            </button>
          </div>
        </div>
      </div>

      {/* Create Alert Form */}
      {showForm && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Get notified when market moves exceed your threshold
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <select
                value={newAlert.country}
                onChange={(e) => setNewAlert({ ...newAlert, country: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alert Type
              </label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="stock_change">Stock Index Change</option>
                <option value="currency_change">Currency Change</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Threshold (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={newAlert.threshold}
                onChange={(e) => setNewAlert({ ...newAlert, threshold: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleCreateAlert}
              disabled={!connected}
              className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-600 hover:to-orange-600 transition-all"
            >
              Create Alert
            </button>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="max-h-[300px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <span className="text-4xl block mb-2">🔔</span>
            <p>No alerts triggered</p>
            <p className="text-sm mt-1">
              {connected 
                ? 'Set up alerts to get notified of major market moves' 
                : 'Connect to enable real-time alerts'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-red-50 dark:bg-red-900/20 animate-pulse-once"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚨</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(alert.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse-once {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-once {
          animation: pulse-once 0.5s ease-in-out 3;
        }
      `}</style>
    </div>
  );
}
