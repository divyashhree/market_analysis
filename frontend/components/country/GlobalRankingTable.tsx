'use client';

import { useState } from 'react';
import { GlobalInflationEntry, GlobalStockEntry, GlobalCurrencyEntry } from '@/lib/types';
import { getCountryColor } from '../country/CountrySelector';
import TrendIndicator from '../interactive/TrendIndicator';

// Consistent number formatting to avoid hydration mismatch
const formatValue = (num: number | null, maxDecimals: number = 2): string => {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: maxDecimals }).format(num);
};

interface GlobalRankingTableProps {
  type: 'inflation' | 'stocks' | 'currencies';
  inflationData?: GlobalInflationEntry[];
  stockData?: GlobalStockEntry[];
  currencyData?: GlobalCurrencyEntry[];
}

export default function GlobalRankingTable({
  type,
  inflationData,
  stockData,
  currencyData,
}: GlobalRankingTableProps) {
  const [sortBy, setSortBy] = useState<string>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting helper
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <th 
      onClick={() => handleSort(column)}
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
    >
      <div className="flex items-center gap-1">
        {children}
        <span className={`transition-transform duration-200 ${sortBy === column ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
          {sortBy === column && sortOrder === 'desc' ? '↓' : '↑'}
        </span>
      </div>
    </th>
  );

  if (type === 'inflation' && inflationData) {
    // Filter by search
    let filteredData = inflationData.filter(entry => 
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort data
    if (sortBy !== 'default') {
      filteredData = [...filteredData].sort((a, b) => {
        let aVal: any, bVal: any;
        switch (sortBy) {
          case 'name': aVal = a.name; bVal = b.name; break;
          case 'inflation': aVal = a.latestInflation ?? 0; bVal = b.latestInflation ?? 0; break;
          case 'region': aVal = a.region; bVal = b.region; break;
          default: return 0;
        }
        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                🌍 Global Inflation Rates
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Annual inflation rate (% change) - Source: World Bank
              </p>
            </div>
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200 w-full sm:w-64"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                <SortHeader column="name">Country</SortHeader>
                <SortHeader column="region">Region</SortHeader>
                <SortHeader column="inflation">Inflation Rate</SortHeader>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trend</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((entry, index) => (
                <tr 
                  key={entry.code} 
                  className={`transition-all duration-200 cursor-pointer ${
                    hoveredRow === entry.code 
                      ? 'bg-blue-50 dark:bg-blue-900/20 transform scale-[1.01]' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onMouseEnter={() => setHoveredRow(entry.code)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index < 3 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl transform transition-transform duration-200 hover:scale-125">{entry.flag}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {entry.region}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className={`font-semibold text-lg ${
                      entry.latestInflation !== null && entry.latestInflation > 5 
                        ? 'text-red-600 dark:text-red-400' 
                        : entry.latestInflation !== null && entry.latestInflation < 2 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-900 dark:text-white'
                    }`}>
                      {entry.latestInflation !== null ? `${entry.latestInflation.toFixed(2)}%` : 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {entry.latestInflation !== null && (
                      <TrendIndicator 
                        value={entry.latestInflation > 5 ? 10 : entry.latestInflation > 2 ? 0 : -10} 
                        size="sm" 
                        showLabel={false}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                    {entry.latestYear || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Results count */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredData.length} of {inflationData.length} countries
          </p>
        </div>
      </div>
    );
  }

  if (type === 'stocks' && stockData) {
    // Filter and sort
    let filteredData = stockData.filter(entry => 
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.indexName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy !== 'default') {
      filteredData = [...filteredData].sort((a, b) => {
        let aVal: any, bVal: any;
        switch (sortBy) {
          case 'name': aVal = a.name; bVal = b.name; break;
          case 'value': aVal = a.latestValue ?? 0; bVal = b.latestValue ?? 0; break;
          case 'ytd': aVal = a.ytdReturn ?? 0; bVal = b.ytdReturn ?? 0; break;
          case '1y': aVal = a.oneYearReturn ?? 0; bVal = b.oneYearReturn ?? 0; break;
          default: return 0;
        }
        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📈 Global Stock Market Performance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stock index performance - Source: Yahoo Finance
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200 w-full sm:w-64"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                <SortHeader column="name">Country</SortHeader>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Index</th>
                <SortHeader column="value">Latest Value</SortHeader>
                <SortHeader column="ytd">YTD Return</SortHeader>
                <SortHeader column="1y">1Y Return</SortHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((entry, index) => (
                <tr 
                  key={entry.code} 
                  className={`transition-all duration-200 cursor-pointer ${
                    hoveredRow === entry.code 
                      ? 'bg-green-50 dark:bg-green-900/20 transform scale-[1.01]' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onMouseEnter={() => setHoveredRow(entry.code)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index < 3 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl transform transition-transform duration-200 hover:scale-125">{entry.flag}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {entry.indexName}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-gray-900 dark:text-white">
                    {formatValue(entry.latestValue)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`font-semibold ${
                        entry.ytdReturn !== null && entry.ytdReturn > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : entry.ytdReturn !== null && entry.ytdReturn < 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-500'
                      }`}>
                        {entry.ytdReturn !== null ? `${entry.ytdReturn > 0 ? '+' : ''}${entry.ytdReturn.toFixed(2)}%` : 'N/A'}
                      </span>
                      {entry.ytdReturn !== null && (
                        <TrendIndicator value={entry.ytdReturn} size="sm" showLabel={false} invertColors />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`font-semibold ${
                        entry.oneYearReturn !== null && entry.oneYearReturn > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : entry.oneYearReturn !== null && entry.oneYearReturn < 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-500'
                      }`}>
                        {entry.oneYearReturn !== null ? `${entry.oneYearReturn > 0 ? '+' : ''}${entry.oneYearReturn.toFixed(2)}%` : 'N/A'}
                      </span>
                      {entry.oneYearReturn !== null && (
                        <TrendIndicator value={entry.oneYearReturn} size="sm" showLabel={false} invertColors />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredData.length} of {stockData.length} markets
          </p>
        </div>
      </div>
    );
  }

  if (type === 'currencies' && currencyData) {
    // Filter and sort
    let filteredData = currencyData.filter(entry => 
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.currency?.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy !== 'default') {
      filteredData = [...filteredData].sort((a, b) => {
        let aVal: any, bVal: any;
        switch (sortBy) {
          case 'name': aVal = a.name; bVal = b.name; break;
          case 'rate': aVal = a.latestRate ?? 0; bVal = b.latestRate ?? 0; break;
          case 'change': aVal = a.yearChange ?? 0; bVal = b.yearChange ?? 0; break;
          default: return 0;
        }
        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                💱 Currency Exchange Rates (vs USD)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Exchange rate changes - Source: Yahoo Finance
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200 w-full sm:w-64"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                <SortHeader column="name">Country</SortHeader>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Currency</th>
                <SortHeader column="rate">Exchange Rate</SortHeader>
                <SortHeader column="change">1Y Change</SortHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((entry, index) => (
                <tr 
                  key={entry.code} 
                  className={`transition-all duration-200 cursor-pointer ${
                    hoveredRow === entry.code 
                      ? 'bg-purple-50 dark:bg-purple-900/20 transform scale-[1.01]' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onMouseEnter={() => setHoveredRow(entry.code)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index < 3 
                        ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl transform transition-transform duration-200 hover:scale-125">{entry.flag}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-bold rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                        {entry.currency?.code}
                      </span>
                      <span className="text-gray-400 text-lg">{entry.currency?.symbol}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-gray-900 dark:text-white text-lg">
                    {entry.latestRate !== null ? entry.latestRate.toFixed(4) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`font-semibold ${
                        entry.yearChange !== null && entry.yearChange < 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : entry.yearChange !== null && entry.yearChange > 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-500'
                      }`}>
                        {entry.yearChange !== null 
                          ? `${Math.abs(entry.yearChange).toFixed(2)}%` 
                          : 'N/A'}
                      </span>
                      {entry.yearChange !== null && (
                        <div className="flex items-center gap-1">
                          <TrendIndicator value={-entry.yearChange} size="sm" showLabel={false} invertColors />
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            entry.yearChange < 0 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {entry.yearChange < 0 ? 'Stronger' : 'Weaker'}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredData.length} of {currencyData.length} currencies
          </p>
        </div>
      </div>
    );
  }

  return null;
}
