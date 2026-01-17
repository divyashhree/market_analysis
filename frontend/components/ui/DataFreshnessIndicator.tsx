import { AlertTriangle, CheckCircle, Database } from 'lucide-react';

interface DataFreshnessIndicatorProps {
  metadata?: {
    source: 'api' | 'csv' | 'none';
    status: 'live' | 'cached' | 'stale' | 'fallback' | 'error';
    lastUpdate?: string;
    lastUpdateFormatted?: string;
    daysSinceUpdate?: number;
    isStale?: boolean;
    warning?: string;
    dataPoints?: number;
  };
  indicator?: string;
}

/**
 * Data Freshness Indicator Component
 * Shows users when data is stale or from fallback sources
 */
export function DataFreshnessIndicator({ metadata, indicator = 'data' }: DataFreshnessIndicatorProps) {
  if (!metadata) return null;

  const { source, status, lastUpdateFormatted, daysSinceUpdate, isStale, warning } = metadata;

  // Stale data warning (red)
  if (isStale && warning) {
    return (
      <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
              Data Freshness Warning
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
              {warning}
            </p>
            <div className="text-xs text-yellow-600 dark:text-yellow-500">
              Source: {source === 'csv' ? 'CSV Fallback' : 'API'} • 
              Last updated: {lastUpdateFormatted} ({daysSinceUpdate} days ago)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback data info (yellow/orange)
  if (source === 'csv' && !isStale) {
    return (
      <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex items-start gap-3">
          <Database className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={18} />
          <div className="flex-1">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Using cached data. Real-time API temporarily unavailable.
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Last updated: {lastUpdateFormatted}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Live data indicator (green) - compact version
  if (source === 'api' && status === 'live' && !isStale) {
    return (
      <div className="mb-3 text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5">
        <CheckCircle size={14} />
        <span>Live data • Updated {lastUpdateFormatted}</span>
      </div>
    );
  }

  return null;
}

interface GlobalDataStatusProps {
  metadata?: {
    hasStaleData?: boolean;
    hasFallbackData?: boolean;
    cpi?: any;
    usdinr?: any;
    nifty?: any;
  };
}

/**
 * Global Data Status Banner
 * Shows warning if any dataset has stale or fallback data
 */
export function GlobalDataStatus({ metadata }: GlobalDataStatusProps) {
  if (!metadata) return null;

  const { hasStaleData, hasFallbackData } = metadata;

  if (hasStaleData) {
    return (
      <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={24} />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 text-lg mb-2">
              ⚠️ Data Freshness Notice
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
              Some datasets are using cached fallback data as real-time APIs are temporarily unavailable. 
              This data is for <strong>educational purposes only</strong> and may not reflect current market conditions.
            </p>
            <div className="text-xs text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 rounded p-2 mt-2">
              <strong>Disclaimer:</strong> This tool is designed for learning and research. 
              Do not use for trading or investment decisions. Always verify data from official sources.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasFallbackData) {
    return (
      <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <Database size={16} />
          <span>Using cached data. Real-time APIs temporarily unavailable.</span>
        </div>
      </div>
    );
  }

  // All data is live and fresh
  return (
    <div className="mb-3 text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5">
      <CheckCircle size={14} />
      <span>All data sources are live and up-to-date</span>
    </div>
  );
}
