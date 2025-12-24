'use client';

import Card from './Card';
import { calculateStatistics } from '@/lib/utils';
import { DataPoint } from '@/lib/types';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

interface StatisticalSummaryProps {
  cpiData: DataPoint[];
  usdinrData: DataPoint[];
  niftyData: DataPoint[];
}

export default function StatisticalSummary({ cpiData, usdinrData, niftyData }: StatisticalSummaryProps) {
  const cpiStats = calculateStatistics(cpiData.map(d => d.value));
  const usdinrStats = calculateStatistics(usdinrData.map(d => d.value));
  const niftyStats = calculateStatistics(niftyData.map(d => d.value));

  const datasets = [
    {
      name: 'CPI (Consumer Price Index)',
      stats: cpiStats,
      color: 'bg-red-500',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: Activity,
      dataPoints: cpiData.length,
    },
    {
      name: 'USD-INR Exchange Rate',
      stats: usdinrStats,
      color: 'bg-green-500',
      borderColor: 'border-green-200 dark:border-green-800',
      icon: TrendingUp,
      dataPoints: usdinrData.length,
    },
    {
      name: 'NIFTY 50 Index',
      stats: niftyStats,
      color: 'bg-blue-500',
      borderColor: 'border-blue-200 dark:border-blue-800',
      icon: BarChart3,
      dataPoints: niftyData.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Statistical Summary</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive statistics for all economic indicators
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {datasets.map((dataset) => {
          const Icon = dataset.icon;
          const range = dataset.stats.max - dataset.stats.min;
          const cv = (dataset.stats.std / dataset.stats.mean) * 100;

          return (
            <Card key={dataset.name} className={`border-l-4 ${dataset.borderColor}`}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{dataset.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {dataset.dataPoints} data points
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${dataset.color} bg-opacity-10`}>
                    <Icon className={`w-5 h-5 ${dataset.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-3">
                  {/* Mean */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mean</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {dataset.stats.mean.toFixed(2)}
                    </span>
                  </div>

                  {/* Median */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Median</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {dataset.stats.median.toFixed(2)}
                    </span>
                  </div>

                  {/* Standard Deviation */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Std Dev</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {dataset.stats.std.toFixed(2)}
                    </span>
                  </div>

                  {/* Min */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Minimum</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {dataset.stats.min.toFixed(2)}
                    </span>
                  </div>

                  {/* Max */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Maximum</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {dataset.stats.max.toFixed(2)}
                    </span>
                  </div>

                  {/* Range */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Range</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {range.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Coefficient of Variation */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      CV
                      <span className="text-xs ml-1">(Volatility)</span>
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {cv.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Interpretation Guide */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Understanding Statistics</h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p><strong>Mean:</strong> Average value across all data points</p>
          <p><strong>Median:</strong> Middle value when data is sorted (less affected by outliers)</p>
          <p><strong>Std Dev:</strong> Measure of data spread around the mean</p>
          <p><strong>Range:</strong> Difference between maximum and minimum values</p>
          <p><strong>CV (Coefficient of Variation):</strong> Relative volatility measure. Higher values indicate more volatility.</p>
        </div>
      </Card>
    </div>
  );
}
