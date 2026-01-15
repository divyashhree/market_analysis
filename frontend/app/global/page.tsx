'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '@/lib/api';
import { 
  GlobalInflationEntry, 
  GlobalStockEntry, 
  GlobalCurrencyEntry,
  CountryComparisonData
} from '@/lib/types';
import CountrySelector, { getCountryColor } from '@/components/country/CountrySelector';
import GlobalRankingTable from '@/components/country/GlobalRankingTable';
import MultiCountryChart from '@/components/charts/MultiCountryChart';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

// Interactive components
import AnimatedNumber from '@/components/interactive/AnimatedNumber';
import TrendIndicator from '@/components/interactive/TrendIndicator';
import LiveIndicator from '@/components/interactive/LiveIndicator';
import InteractiveWorldMap from '@/components/interactive/InteractiveWorldMap';
import Sparkline from '@/components/interactive/Sparkline';
import AnimatedGlobeLoader from '@/components/interactive/AnimatedGlobeLoader';

type ViewMode = 'rankings' | 'compare' | 'map';
type DataType = 'inflation' | 'stocks' | 'currencies';

// Country coordinates for map
const countryCoordinates: { [key: string]: { lat: number; lng: number } } = {
  US: { lat: 40, lng: -100 },
  CA: { lat: 56, lng: -106 },
  MX: { lat: 23, lng: -102 },
  GB: { lat: 54, lng: -2 },
  DE: { lat: 51, lng: 10 },
  FR: { lat: 46, lng: 2 },
  IT: { lat: 42, lng: 12 },
  ES: { lat: 40, lng: -4 },
  NL: { lat: 52, lng: 5 },
  CH: { lat: 47, lng: 8 },
  SE: { lat: 62, lng: 15 },
  NO: { lat: 62, lng: 10 },
  PL: { lat: 52, lng: 20 },
  AT: { lat: 47, lng: 14 },
  BE: { lat: 51, lng: 4 },
  JP: { lat: 36, lng: 138 },
  CN: { lat: 35, lng: 105 },
  IN: { lat: 20, lng: 77 },
  KR: { lat: 37, lng: 128 },
  AU: { lat: -25, lng: 133 },
  SG: { lat: 1, lng: 104 },
  HK: { lat: 22, lng: 114 },
  TW: { lat: 24, lng: 121 },
  ID: { lat: -5, lng: 120 },
  TH: { lat: 15, lng: 100 },
  MY: { lat: 4, lng: 109 },
  PH: { lat: 13, lng: 122 },
  VN: { lat: 16, lng: 108 },
  NZ: { lat: -41, lng: 174 },
  AE: { lat: 24, lng: 54 },
  SA: { lat: 24, lng: 45 },
  IL: { lat: 31, lng: 35 },
  TR: { lat: 39, lng: 35 },
  QA: { lat: 25, lng: 51 },
  BR: { lat: -14, lng: -51 },
  AR: { lat: -34, lng: -64 },
  CL: { lat: -35, lng: -71 },
  CO: { lat: 4, lng: -72 },
  PE: { lat: -10, lng: -76 },
  ZA: { lat: -29, lng: 24 },
  NG: { lat: 10, lng: 8 },
  EG: { lat: 27, lng: 30 },
  KE: { lat: 0, lng: 38 },
  RU: { lat: 62, lng: 105 }
};

function getCountryLatLng(code: string): { lat: number; lng: number } {
  return countryCoordinates[code] || { lat: 0, lng: 0 };
}

export default function GlobalPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('rankings');
  const [dataType, setDataType] = useState<DataType>('inflation');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Global rankings data
  const [inflationData, setInflationData] = useState<GlobalInflationEntry[]>([]);
  const [stockData, setStockData] = useState<GlobalStockEntry[]>([]);
  const [currencyData, setCurrencyData] = useState<GlobalCurrencyEntry[]>([]);

  // Comparison data
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'GB', 'DE', 'JP', 'IN']);
  const [comparisonData, setComparisonData] = useState<CountryComparisonData | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  
  // Map data
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Prepare map data
  const mapCountries = useMemo(() => {
    const countries: any[] = [];
    
    inflationData.forEach(item => {
      countries.push({
        code: item.code,
        name: item.name,
        lat: getCountryLatLng(item.code).lat,
        lng: getCountryLatLng(item.code).lng,
        value: item.latestInflation,
        flag: item.flag
      });
    });
    
    return countries;
  }, [inflationData]);

  // Handle map country selection
  const handleMapCountrySelect = useCallback((code: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(code)) {
        return prev.filter(c => c !== code);
      }
      if (prev.length >= 10) {
        return [...prev.slice(1), code];
      }
      return [...prev, code];
    });
  }, []);

  useEffect(() => {
    fetchGlobalData();
  }, []);

  useEffect(() => {
    if (viewMode === 'compare' && selectedCountries.length > 0) {
      fetchComparisonData();
    }
  }, [viewMode, selectedCountries]);

  const fetchGlobalData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [inflationRes, stocksRes, currenciesRes] = await Promise.all([
        api.getGlobalInflation(),
        api.getGlobalStocks(),
        api.getGlobalCurrencies()
      ]);

      setInflationData(inflationRes.data || []);
      setStockData(stocksRes.data || []);
      setCurrencyData(currenciesRes.data || []);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch global data');
      console.error('Error fetching global data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh from LiveIndicator
  const handleRefresh = useCallback(() => {
    fetchGlobalData();
  }, []);

  const fetchComparisonData = async () => {
    if (selectedCountries.length === 0) return;

    try {
      setComparisonLoading(true);
      const response = await api.compareCountries(selectedCountries, 'all');
      setComparisonData(response.data);
    } catch (err: any) {
      console.error('Error fetching comparison data:', err);
    } finally {
      setComparisonLoading(false);
    }
  };

  // Transform comparison data for charts
  const chartDataByType = useMemo(() => {
    if (!comparisonData) return { inflation: {}, stock: {}, fx: {} };

    const inflation: { [code: string]: any[] } = {};
    const stock: { [code: string]: any[] } = {};
    const fx: { [code: string]: any[] } = {};

    Object.entries(comparisonData).forEach(([code, countryData]: [string, any]) => {
      if (countryData.error) return;
      
      if (countryData.data?.inflation) {
        inflation[code] = countryData.data.inflation;
      }
      if (countryData.data?.stockIndex) {
        stock[code] = countryData.data.stockIndex;
      }
      if (countryData.data?.exchangeRate) {
        fx[code] = countryData.data.exchangeRate;
      }
    });

    return { inflation, stock, fx };
  }, [comparisonData]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Data</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchGlobalData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Live Indicator */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🌍 Global Economic Comparison
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Compare economic indicators across 30+ countries using official data from World Bank and major financial exchanges.
            </p>
          </div>
          <LiveIndicator 
            lastUpdated={lastUpdated} 
            onRefresh={handleRefresh}
            autoRefreshInterval={300}
          />
        </div>
        
        {/* Quick Stats Summary */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
              <p className="text-blue-100 text-sm">Countries Tracked</p>
              <p className="text-3xl font-bold">
                <AnimatedNumber value={inflationData.length} duration={1000} />
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
              <p className="text-green-100 text-sm">Avg. Global Inflation</p>
              <p className="text-3xl font-bold">
                <AnimatedNumber 
                  value={inflationData.length > 0 
                    ? inflationData.reduce((sum, d) => sum + (d.latestInflation || 0), 0) / inflationData.filter(d => d.latestInflation).length 
                    : 0} 
                  decimals={1}
                  suffix="%"
                  duration={1200}
                />
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
              <p className="text-purple-100 text-sm">Best Stock Return (1Y)</p>
              <p className="text-3xl font-bold">
                <AnimatedNumber 
                  value={stockData.length > 0 ? Math.max(...stockData.map(d => d.oneYearReturn || 0)) : 0} 
                  decimals={1}
                  suffix="%"
                  duration={1400}
                />
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
              <p className="text-orange-100 text-sm">Selected to Compare</p>
              <p className="text-3xl font-bold">
                <AnimatedNumber value={selectedCountries.length} duration={500} />
              </p>
            </div>
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('rankings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              viewMode === 'rankings'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            📊 Global Rankings
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              viewMode === 'map'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🗺️ World Map
          </button>
          <button
            onClick={() => setViewMode('compare')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              viewMode === 'compare'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            📈 Compare Countries
          </button>
        </div>

        {viewMode === 'rankings' && (
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setDataType('inflation')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dataType === 'inflation'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🔥 Inflation
            </button>
            <button
              onClick={() => setDataType('stocks')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dataType === 'stocks'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📈 Stock Markets
            </button>
            <button
              onClick={() => setDataType('currencies')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dataType === 'currencies'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              💱 Currencies
            </button>
          </div>
        )}
      </div>

      {/* Data Sources Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📡</span>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-200">Official Data Sources</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Inflation & GDP:</strong> World Bank Open Data (data.worldbank.org) • 
              <strong> Stock Indices:</strong> Yahoo Finance • 
              <strong> Exchange Rates:</strong> Yahoo Finance
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <AnimatedGlobeLoader 
          size={140}
          text="Fetching global economic data..."
        />
      ) : viewMode === 'map' ? (
        /* Interactive World Map View */
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🗺️ Interactive Global Economic Map
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Click on countries to add them to your comparison. Hover for quick stats.
            </p>
            <InteractiveWorldMap
              countries={mapCountries}
              selectedCountries={selectedCountries}
              onCountrySelect={handleMapCountrySelect}
              colorScale="inflation"
              height={500}
            />
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Low Inflation (&lt;2%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Moderate (2-5%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">High (&gt;5%)</span>
              </div>
            </div>
          </div>

          {/* Selected Countries Panel */}
          {selectedCountries.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Selected Countries ({selectedCountries.length}/10)
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((code, idx) => {
                  const country = inflationData.find(d => d.code === code);
                  return (
                    <div 
                      key={code}
                      onClick={() => handleMapCountrySelect(code)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer
                                 bg-gradient-to-r from-blue-500 to-purple-500 text-white
                                 hover:from-blue-600 hover:to-purple-600 transition-all duration-300
                                 transform hover:scale-105 shadow-md"
                    >
                      <span>{country?.flag || '🏳️'}</span>
                      <span className="font-medium">{country?.name || code}</span>
                      <span className="text-white/80 text-sm ml-1">
                        {country?.latestInflation?.toFixed(1)}%
                      </span>
                      <button className="ml-1 hover:text-red-200">✕</button>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setViewMode('compare')}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg
                           hover:from-green-600 hover:to-emerald-700 transition-all duration-300
                           transform hover:scale-105 shadow-lg font-medium"
              >
                📈 Compare Selected Countries
              </button>
            </div>
          )}
        </div>
      ) : viewMode === 'rankings' ? (
        /* Global Rankings View */
        <div className="space-y-6">
          {dataType === 'inflation' && (
            <GlobalRankingTable type="inflation" inflationData={inflationData} />
          )}
          {dataType === 'stocks' && (
            <GlobalRankingTable type="stocks" stockData={stockData} />
          )}
          {dataType === 'currencies' && (
            <GlobalRankingTable type="currencies" currencyData={currencyData} />
          )}
        </div>
      ) : (
        /* Country Comparison View */
        <div className="space-y-6">
          <CountrySelector
            selectedCountries={selectedCountries}
            onSelectionChange={setSelectedCountries}
            maxSelection={10}
          />

          {comparisonLoading ? (
            <div className="space-y-6">
              <ChartSkeleton />
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          ) : selectedCountries.length > 0 && comparisonData ? (
            <div className="space-y-6">
              {/* Inflation Comparison Chart */}
              <MultiCountryChart
                title="📊 Inflation Rate Comparison (%)"
                data={chartDataByType.inflation}
                selectedCountries={selectedCountries}
                valueFormatter={(v) => `${v.toFixed(2)}%`}
                yAxisLabel="Inflation Rate (%)"
              />

              {/* Stock Index Comparison Chart */}
              <MultiCountryChart
                title="📈 Stock Index Performance (Normalized)"
                data={chartDataByType.stock}
                selectedCountries={selectedCountries}
                valueFormatter={(v) => v.toLocaleString()}
                yAxisLabel="Index Value"
                height={450}
              />

              {/* Exchange Rate Comparison Chart */}
              <MultiCountryChart
                title="💱 Exchange Rate vs USD"
                data={chartDataByType.fx}
                selectedCountries={selectedCountries}
                valueFormatter={(v) => v.toFixed(4)}
                yAxisLabel="Exchange Rate"
              />

              {/* Summary Stats */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📋 Country Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCountries.map((code, index) => {
                    const countryInfo = comparisonData[code] as any;
                    if (!countryInfo || countryInfo.error) return null;
                    
                    const country = countryInfo.country;
                    const inflationHistory = countryInfo.data?.inflation || [];
                    const latestInflation = inflationHistory.slice(-1)[0]?.value;
                    const prevInflation = inflationHistory.slice(-2, -1)[0]?.value;
                    const inflationChange = latestInflation && prevInflation 
                      ? ((latestInflation - prevInflation) / Math.abs(prevInflation)) * 100 
                      : 0;
                    
                    const stockHistory = countryInfo.data?.stockIndex || [];
                    const latestStock = stockHistory.slice(-1)[0]?.value;
                    const stockChange = stockHistory.length >= 2
                      ? ((latestStock - stockHistory[0].value) / stockHistory[0].value) * 100
                      : 0;
                    
                    const latestFx = countryInfo.data?.exchangeRate?.slice(-1)[0]?.value;

                    return (
                      <div 
                        key={code} 
                        className="p-4 rounded-lg border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        style={{ borderColor: getCountryColor(code, index) }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{country?.flag}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {country?.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              GDP Rank: #{country?.gdpRank}
                            </p>
                          </div>
                        </div>
                        
                        {/* Mini Sparklines */}
                        {inflationHistory.length > 0 && (
                          <div className="mb-3">
                            <Sparkline
                              data={inflationHistory.map((d: any) => d.value)}
                              color={latestInflation > 5 ? '#EF4444' : latestInflation > 2 ? '#F59E0B' : '#10B981'}
                              height={40}
                              showDots={false}
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Index:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {country?.stockIndex?.name}
                            </span>
                          </div>
                          {latestInflation !== undefined && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Inflation:</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${latestInflation > 5 ? 'text-red-600' : 'text-green-600'}`}>
                                  <AnimatedNumber value={latestInflation} decimals={2} suffix="%" duration={800} />
                                </span>
                                {inflationChange !== 0 && (
                                  <TrendIndicator value={inflationChange} size="sm" showLabel={false} />
                                )}
                              </div>
                            </div>
                          )}
                          {latestStock !== undefined && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Index Value:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  <AnimatedNumber value={latestStock} decimals={0} duration={1000} />
                                </span>
                                {stockChange !== 0 && (
                                  <TrendIndicator value={stockChange} size="sm" showLabel={false} invertColors />
                                )}
                              </div>
                            </div>
                          )}
                          {latestFx !== undefined && code !== 'US' && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">vs USD:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                <AnimatedNumber value={latestFx} decimals={4} duration={600} />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Select countries above to compare their economic data
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>⚠️ Disclaimer:</strong> This tool is for educational and research purposes only. 
          Data is sourced from World Bank and Yahoo Finance APIs. Exchange rates and stock values 
          may be delayed. Not intended for trading or investment decisions.
        </p>
      </div>
    </div>
  );
}
