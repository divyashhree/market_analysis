'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { PeriodComparison, CorrelationMatrix, Statistics } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatDate } from '@/lib/utils';

export default function ComparePage() {
  const [comparison, setComparison] = useState<PeriodComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [period1, setPeriod1] = useState({
    start: '2014-01-01',
    end: '2018-12-31',
  });

  const [period2, setPeriod2] = useState({
    start: '2019-01-01',
    end: '2024-12-31',
  });

  const handleCompare = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.comparePeriods(period1, period2);
      setComparison(result);
    } catch (err: any) {
      setError(err.message || 'Failed to compare periods');
      console.error('Error comparing periods:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStatsCard = (title: string, stats: Statistics, color: string) => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4" style={{ borderColor: color }}>
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{title}</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Mean:</span>
          <span className="font-medium text-gray-900 dark:text-white">{stats.mean.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Std Dev:</span>
          <span className="font-medium text-gray-900 dark:text-white">{stats.std.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Min:</span>
          <span className="font-medium text-gray-900 dark:text-white">{stats.min.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Max:</span>
          <span className="font-medium text-gray-900 dark:text-white">{stats.max.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Median:</span>
          <span className="font-medium text-gray-900 dark:text-white">{stats.median.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  const renderCorrelationComparison = (corr1: CorrelationMatrix, corr2: CorrelationMatrix) => {
    const pairs = [
      { key: 'cpi_nifty', label: 'CPI vs NIFTY 50' },
      { key: 'usdinr_nifty', label: 'USD-INR vs NIFTY 50' },
      { key: 'cpi_usdinr', label: 'CPI vs USD-INR' },
    ];

    return (
      <div className="space-y-4">
        {pairs.map(({ key, label }) => {
          const val1 = corr1[key as keyof CorrelationMatrix];
          const val2 = corr2[key as keyof CorrelationMatrix];
          const change = val2 - val1;
          const changePercent = Math.abs(val1) > 0 ? ((change / Math.abs(val1)) * 100) : 0;

          return (
            <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{label}</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Period 1</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{val1.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Period 2</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{val2.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Change</p>
                  <p className={`text-lg font-bold ${change > 0 ? 'text-green-600 dark:text-green-400' : change < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600'}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(3)}
                    <span className="text-sm ml-1">({changePercent.toFixed(1)}%)</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Period Comparison</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compare economic indicators and correlations across different time periods
        </p>
      </div>

      {/* Date Selection */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select Periods to Compare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Period 1 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Period 1</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={period1.start}
                  onChange={(e) => setPeriod1({ ...period1, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={period1.end}
                  onChange={(e) => setPeriod1({ ...period1, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Period 2 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Period 2</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={period2.start}
                  onChange={(e) => setPeriod2({ ...period2, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={period2.end}
                  onChange={(e) => setPeriod2({ ...period2, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading}
          className="mt-6 w-full md:w-auto px-8 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Comparing...' : 'Compare Periods'}
        </button>
      </Card>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center mb-8">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      )}

      {/* Comparison Results */}
      {!loading && comparison && (
        <div className="space-y-8">
          {/* Correlation Comparison */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Correlation Changes
            </h2>
            {renderCorrelationComparison(comparison.period1.correlations, comparison.period2.correlations)}
          </Card>

          {/* CPI Statistics */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              CPI (Consumer Price Index)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderStatsCard(
                `Period 1 (${comparison.period1.start} to ${comparison.period1.end})`,
                comparison.period1.stats.cpi,
                '#EF4444'
              )}
              {renderStatsCard(
                `Period 2 (${comparison.period2.start} to ${comparison.period2.end})`,
                comparison.period2.stats.cpi,
                '#EF4444'
              )}
            </div>
          </Card>

          {/* USD-INR Statistics */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              USD-INR Exchange Rate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderStatsCard(
                `Period 1 (${comparison.period1.start} to ${comparison.period1.end})`,
                comparison.period1.stats.usdinr,
                '#10B981'
              )}
              {renderStatsCard(
                `Period 2 (${comparison.period2.start} to ${comparison.period2.end})`,
                comparison.period2.stats.usdinr,
                '#10B981'
              )}
            </div>
          </Card>

          {/* NIFTY 50 Statistics */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              NIFTY 50 Index
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderStatsCard(
                `Period 1 (${comparison.period1.start} to ${comparison.period1.end})`,
                comparison.period1.stats.nifty,
                '#3B82F6'
              )}
              {renderStatsCard(
                `Period 2 (${comparison.period2.start} to ${comparison.period2.end})`,
                comparison.period2.stats.nifty,
                '#3B82F6'
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
