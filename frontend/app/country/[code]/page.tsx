'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CountryData } from '@/lib/types';
import LineChartComponent from '@/components/charts/LineChartComponent';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import { getCountryColor } from '@/components/country/CountrySelector';

export default function CountryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const countryCode = (params.code as string)?.toUpperCase();
  
  const [data, setData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countryCode) {
      fetchCountryData();
    }
  }, [countryCode]);

  const fetchCountryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCountryData(countryCode);
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch country data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
        <div className="space-y-6">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Error Loading Country Data
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Country not found'}</p>
          <button 
            onClick={() => router.push('/global')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Global View
          </button>
        </div>
      </div>
    );
  }

  const { country, data: countryData, meta } = data;
  const color = getCountryColor(country.code);

  // Format chart data
  const formatChartData = (dataPoints: any[], valueKey: string = 'value') => {
    return dataPoints.map(d => ({
      date: d.date,
      [valueKey]: d.value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/global')}
        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Global View
      </button>

      {/* Country Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{country.flag}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {country.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {country.region} • GDP Rank #{country.gdpRank}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Currency</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {country.currency.code} ({country.currency.symbol})
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Stock Index</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {country.stockIndex.name}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 col-span-2 md:col-span-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Data Sources</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {meta.sources.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Latest Inflation */}
        {countryData.inflation.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Latest Inflation</p>
            <p className={`text-3xl font-bold ${
              countryData.inflation.slice(-1)[0]?.value > 5 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`}>
              {countryData.inflation.slice(-1)[0]?.value?.toFixed(2) || 'N/A'}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Year: {countryData.inflation.slice(-1)[0]?.date?.split('-')[0] || 'N/A'}
            </p>
          </div>
        )}

        {/* Latest Stock Index */}
        {countryData.stockIndex.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{country.stockIndex.name}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {countryData.stockIndex.slice(-1)[0]?.value?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Latest available
            </p>
          </div>
        )}

        {/* Exchange Rate */}
        {countryData.exchangeRate.length > 0 && country.code !== 'US' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">USD to {country.currency.code}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {countryData.exchangeRate.slice(-1)[0]?.value?.toFixed(4) || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Exchange Rate
            </p>
          </div>
        )}

        {/* GDP Growth */}
        {countryData.gdpGrowth.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">GDP Growth</p>
            <p className={`text-3xl font-bold ${
              countryData.gdpGrowth.slice(-1)[0]?.value > 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {countryData.gdpGrowth.slice(-1)[0]?.value?.toFixed(2) || 'N/A'}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Year: {countryData.gdpGrowth.slice(-1)[0]?.date?.split('-')[0] || 'N/A'}
            </p>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Inflation Chart */}
        {countryData.inflation.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Inflation Rate History
            </h3>
            <LineChartComponent
              data={formatChartData(countryData.inflation, 'Inflation')}
              dataKey="Inflation"
              color={color}
              title=""
              yAxisLabel="Inflation Rate (%)"
              valueFormatter={(v) => `${v.toFixed(2)}%`}
            />
          </div>
        )}

        {/* Stock Index Chart */}
        {countryData.stockIndex.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📈 {country.stockIndex.name} History
            </h3>
            <LineChartComponent
              data={formatChartData(countryData.stockIndex, 'Index')}
              dataKey="Index"
              color={color}
              title=""
              yAxisLabel="Index Value"
              valueFormatter={(v) => v.toLocaleString()}
            />
          </div>
        )}

        {/* Exchange Rate Chart */}
        {countryData.exchangeRate.length > 0 && country.code !== 'US' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💱 USD to {country.currency.code} Exchange Rate
            </h3>
            <LineChartComponent
              data={formatChartData(countryData.exchangeRate, 'Rate')}
              dataKey="Rate"
              color={color}
              title=""
              yAxisLabel="Exchange Rate"
              valueFormatter={(v) => v.toFixed(4)}
            />
          </div>
        )}

        {/* GDP Growth Chart */}
        {countryData.gdpGrowth.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📉 GDP Growth Rate
            </h3>
            <LineChartComponent
              data={formatChartData(countryData.gdpGrowth, 'GDP Growth')}
              dataKey="GDP Growth"
              color={color}
              title=""
              yAxisLabel="Growth Rate (%)"
              valueFormatter={(v) => `${v.toFixed(2)}%`}
            />
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Last updated: {new Date(meta.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
