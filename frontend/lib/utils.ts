import { format, parse, isValid } from 'date-fns';
import { DataPoint, ChartDataPoint } from './types';

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

/**
 * Check if date string is valid
 */
export function isValidDate(dateString: string): boolean {
  const date = parseDate(dateString);
  return isValid(date);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Download data as CSV
 */
export function downloadCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Merge multiple datasets by date
 */
export function mergeDataByDate(
  cpi: DataPoint[],
  usdinr: DataPoint[],
  nifty: DataPoint[]
): ChartDataPoint[] {
  const dateMap = new Map<string, ChartDataPoint>();

  cpi.forEach(point => {
    const date = point.date;
    if (!dateMap.has(date)) {
      dateMap.set(date, { date });
    }
    dateMap.get(date)!.cpi = point.value;
  });

  usdinr.forEach(point => {
    const date = point.date;
    if (!dateMap.has(date)) {
      dateMap.set(date, { date });
    }
    dateMap.get(date)!.usdinr = point.value;
  });

  nifty.forEach(point => {
    const date = point.date;
    if (!dateMap.has(date)) {
      dateMap.set(date, { date });
    }
    dateMap.get(date)!.nifty = point.value;
  });

  return Array.from(dateMap.values()).sort((a, b) => 
    a.date.localeCompare(b.date)
  );
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(data: number[], window: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(NaN);
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
  }
  
  return result;
}

/**
 * Calculate Pearson correlation coefficient
 */
export function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Get color based on correlation value
 */
export function getCorrelationColor(value: number): string {
  if (value > 0.5) return 'text-green-600 dark:text-green-400';
  if (value < -0.5) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Class name helper for conditional classes
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Calculate moving average for chart data
 */
export function calculateMovingAverageForChart(
  data: ChartDataPoint[],
  key: string,
  window: number
): ChartDataPoint[] {
  const values = data.map(d => d[key] as number || NaN);
  const ma = calculateMovingAverage(values, window);
  
  return data.map((d, i) => ({
    ...d,
    [`${key}_ma${window}`]: isNaN(ma[i]) ? null : ma[i],
  } as ChartDataPoint));
}

/**
 * Calculate rolling correlation
 */
export function calculateRollingCorrelation(
  x: number[],
  y: number[],
  window: number
): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < x.length; i++) {
    if (i < window - 1) {
      result.push(NaN);
    } else {
      const xWindow = x.slice(i - window + 1, i + 1);
      const yWindow = y.slice(i - window + 1, i + 1);
      result.push(calculateCorrelation(xWindow, yWindow));
    }
  }
  
  return result;
}

/**
 * Calculate standard deviation
 */
export function calculateStd(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  
  return Math.sqrt(variance);
}

/**
 * Calculate median
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Calculate statistics for a dataset
 */
export function calculateStatistics(values: number[]): {
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
} {
  if (values.length === 0) {
    return { mean: 0, std: 0, min: 0, max: 0, median: 0 };
  }
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const median = calculateMedian(values);
  const std = calculateStd(values);
  
  return { mean, std, min, max, median };
}
