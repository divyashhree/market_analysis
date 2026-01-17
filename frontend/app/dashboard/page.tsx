'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Dataset } from '@/lib/types';
import { StatCard } from '@/components/ui/Card';
import LineChartComponent from '@/components/charts/LineChartComponent';
import LineChartWithMA from '@/components/charts/LineChartWithMA';
import DataTable from '@/components/ui/DataTable';
import DateRangePicker from '@/components/ui/DateRangePicker';
import StatisticalSummary from '@/components/ui/StatisticalSummary';
import { ChartSkeleton, StatCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { downloadCSV, mergeDataByDate, calculatePercentageChange } from '@/lib/utils';
import { GlobalDataStatus, DataFreshnessIndicator } from '@/components/ui/DataFreshnessIndicator';
import { InsufficientDataWarning, DataFrequencyInfo, DataRangeRecommendation } from '@/components/ui/DataWarnings';

// Social and real-time components
import ActivityFeed from '@/components/social/ActivityFeed';
import Comments from '@/components/social/Comments';
import InsightsFeed from '@/components/social/InsightsFeed';
import Leaderboard from '@/components/social/Leaderboard';

export default function DashboardPage() {
  const [data, setData] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '2014-01-01', end: '2024-12-31' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAllData();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getDataByRange(dateRange.start, dateRange.end);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data for date range');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!data) return;
    const merged = mergeDataByDate(data.cpi, data.usdinr, data.nifty);
    downloadCSV(merged, 'macro-market-data.csv');
  };

  // Calculate latest values and changes
  const getLatestStats = () => {
    if (!data) return null;

    const getLatest = (arr: any[]) => arr && arr.length > 0 ? arr[arr.length - 1] : null;
    const getPrevious = (arr: any[]) => arr && arr.length > 1 ? arr[arr.length - 2] : null;

    const latestCPI = getLatest(data.cpi);
    const prevCPI = getPrevious(data.cpi);
    const latestUSDINR = getLatest(data.usdinr);
    const prevUSDINR = getPrevious(data.usdinr);
    const latestNifty = getLatest(data.nifty);
    const prevNifty = getPrevious(data.nifty);

    return {
      cpi: {
        value: latestCPI?.value || 0,
        change: latestCPI && prevCPI ? calculatePercentageChange(prevCPI.value, latestCPI.value) : 0,
      },
      usdinr: {
        value: latestUSDINR?.value || 0,
        change: latestUSDINR && prevUSDINR ? calculatePercentageChange(prevUSDINR.value, latestUSDINR.value) : 0,
      },
      nifty: {
        value: latestNifty?.value || 0,
        change: latestNifty && prevNifty ? calculatePercentageChange(prevNifty.value, latestNifty.value) : 0,
      },
    };
  };

  const stats = getLatestStats();
  const mergedData = data ? mergeDataByDate(data.cpi, data.usdinr, data.nifty) : [];

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Data</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">India Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Live overview of economic indicators and market performance with social insights
        </p>
      </div>

      {/* Global Data Status Banner */}
      {data?.metadata && <GlobalDataStatus metadata={data.metadata} />}

      {/* Data Quality Warnings */}
      {data && (
        <>
          {data.cpi.length === 0 && (
            <InsufficientDataWarning 
              indicator="CPI" 
              dataPoints={0}
              reason="CPI is updated annually by World Bank. Select a date range of at least 1 year (e.g., 2024-01-01 to 2025-12-31) to see CPI data."
            />
          )}
          {data.cpi.length === 1 && (
            <>
              <InsufficientDataWarning 
                indicator="CPI" 
                dataPoints={1}
                reason="CPI is updated annually. Select a multi-year range for meaningful analysis."
              />
              <DataFrequencyInfo 
                indicator="CPI"
                frequency="annual"
                nextUpdate="typically January of each year"
              />
            </>
          )}
          {data.cpi.length > 1 && data.cpi.length < 5 && (
            <DataFrequencyInfo 
              indicator="CPI"
              frequency="annual"
            />
          )}
          {data.nifty.length < 3 && (
            <DataRangeRecommendation 
              indicator="NIFTY 50"
              recommended="3-6 months"
              current={`${Math.max(1, data.nifty.length)} month${data.nifty.length !== 1 ? 's' : ''}`}
            />
          )}
        </>
      )}

      {/* Date Range Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Data</h3>
          </div>
          <div className="flex gap-2">
            <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onStartDateChange={(date) => setDateRange({ ...dateRange, start: date })}
              onEndDateChange={(date) => setDateRange({ ...dateRange, end: date })}
              onApply={handleDateRangeChange}
            />
            <button
              onClick={handleExport}
              disabled={loading || !data}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatCard
              title="Consumer Price Index (CPI)"
              value={stats.cpi.value.toFixed(2)}
              change={stats.cpi.change}
              icon="📊"
              color="cpi"
            />
            <StatCard
              title="USD-INR Exchange Rate"
              value={stats.usdinr.value.toFixed(2)}
              change={stats.usdinr.change}
              icon="💱"
              color="usdinr"
            />
            <StatCard
              title="NIFTY 50 Index"
              value={stats.nifty.value.toFixed(2)}
              change={stats.nifty.change}
              icon="📈"
              color="nifty"
            />
          </>
        ) : null}
      </div>

      {/* Social & Real-time Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <InsightsFeed />
        </div>
        <div className="space-y-8">
          <ActivityFeed />
          <Leaderboard />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : data ? (
          <>
            <LineChartComponent
              data={data.cpi.map(item => ({ ...item, cpi: item.value }))}
              title="Consumer Price Index (CPI) - India"
              dataKey="cpi"
              color="#EF4444"
              yAxisLabel="Index Value"
            />
            <LineChartComponent
              data={data.usdinr.map(item => ({ ...item, usdinr: item.value }))}
              title="USD-INR Exchange Rate"
              dataKey="usdinr"
              color="#10B981"
              yAxisLabel="Exchange Rate"
            />
            <LineChartWithMA
              data={mergedData}
              dataKey="nifty"
              color="#3B82F6"
              title="NIFTY 50 Index"
              yAxisLabel="Index Value"
            />
          </>
        ) : null}
      </div>

      {/* Discussion Section */}
      <div className="mb-8">
        <Comments country="IN" pageId="dashboard" />
      </div>

      {/* Statistical Summary */}
      {loading ? (
        <ChartSkeleton />
      ) : data ? (
        <div className="mb-8">
          <StatisticalSummary
            cpiData={data.cpi}
            usdinrData={data.usdinr}
            niftyData={data.nifty}
          />
        </div>
      ) : null}

      {/* Data Table */}
      {loading ? (
        <ChartSkeleton />
      ) : data ? (
        <DataTable cpi={data.cpi} usdinr={data.usdinr} nifty={data.nifty} />
      ) : null}
    </div>
  );
}
