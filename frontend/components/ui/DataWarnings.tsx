import { AlertTriangle, Info } from 'lucide-react';

interface InsufficientDataWarningProps {
  indicator: string;
  dataPoints: number;
  reason?: string;
}

/**
 * Warning component for when there's insufficient data for analysis
 */
export function InsufficientDataWarning({ indicator, dataPoints, reason }: InsufficientDataWarningProps) {
  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-1">
            Insufficient {indicator} Data
          </h4>
          <p className="text-sm text-orange-700 dark:text-orange-400 mb-2">
            Only {dataPoints} data point{dataPoints !== 1 ? 's' : ''} available in selected date range.
            {dataPoints === 0 && ' No statistics can be calculated.'}
            {dataPoints === 1 && ' Statistics require at least 2 data points.'}
            {dataPoints > 1 && dataPoints < 5 && ' More data points recommended for reliable statistics.'}
          </p>
          {reason && (
            <p className="text-xs text-orange-600 dark:text-orange-500 bg-orange-100 dark:bg-orange-900/30 rounded p-2">
              <strong>Note:</strong> {reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface DataFrequencyInfoProps {
  indicator: string;
  frequency: 'annual' | 'monthly' | 'daily';
  nextUpdate?: string;
}

/**
 * Information component explaining data frequency
 */
export function DataFrequencyInfo({ indicator, frequency, nextUpdate }: DataFrequencyInfoProps) {
  const frequencyText = {
    annual: 'updated once per year (typically January)',
    monthly: 'updated monthly (end of month)',
    daily: 'updated daily (market hours)'
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
      <div className="flex items-start gap-2">
        <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={16} />
        <div className="flex-1">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>{indicator}</strong> is {frequencyText[frequency]}.
            {nextUpdate && ` Next update expected: ${nextUpdate}.`}
          </p>
        </div>
      </div>
    </div>
  );
}

interface DataRangeRecommendationProps {
  indicator: string;
  recommended: string;
  current: string;
}

/**
 * Recommendation for better date range selection
 */
export function DataRangeRecommendation({ indicator, recommended, current }: DataRangeRecommendationProps) {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 mb-4">
      <div className="flex items-start gap-2">
        <Info className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" size={16} />
        <div className="flex-1">
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">
            <strong>Tip:</strong> For better {indicator} analysis, select a date range of at least <strong>{recommended}</strong>.
          </p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400">
            Current range: {current}
          </p>
        </div>
      </div>
    </div>
  );
}
