"use client";

import React, { useState, useCallback } from 'react';
import StockSearchBar from '@/components/stocks/StockSearchBar';
import StockDetails from '@/components/stocks/StockDetails';
import { Stock, StockData } from '@/lib/types';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Search, BarChart3, Globe2, Zap } from 'lucide-react';

// Featured stocks for quick access
const FEATURED_STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', country: 'US', sector: 'Technology', industry: 'Consumer Electronics' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', country: 'US', sector: 'Technology', industry: 'Internet' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', country: 'US', sector: 'Technology', industry: 'Software' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', country: 'US', sector: 'Automotive', industry: 'Electric Vehicles' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', country: 'US', sector: 'Technology', industry: 'Semiconductors' },
  { symbol: 'AMZN', name: 'Amazon.com', country: 'US', sector: 'Consumer', industry: 'E-Commerce' },
];

const MarketDynamicsPage = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStockSelect = useCallback(async (stock: Stock) => {
    setSelectedStock(stock);
    setIsLoading(true);
    setError(null);
    setStockData(null);
    try {
      const data = await api.getStockData(stock.symbol);
      setStockData(data);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSelection = () => {
    setSelectedStock(null);
    setStockData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-600/5 dark:via-purple-600/5 dark:to-pink-600/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Real-time Stock Analysis
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
              Market Dynamics
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Explore real-time stock data, analyze performance trends, and gain deep insights into global markets with our powerful analytics platform.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <StockSearchBar onStockSelect={handleStockSelect} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedStock && !isLoading && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                  <TrendingUp className="h-10 w-10 mb-4 opacity-80" />
                  <h3 className="text-xl font-bold mb-2">Real-Time Data</h3>
                  <p className="text-blue-100">Live stock prices and market data updated in real-time.</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                  <BarChart3 className="h-10 w-10 mb-4 opacity-80" />
                  <h3 className="text-xl font-bold mb-2">Deep Analytics</h3>
                  <p className="text-purple-100">Historical charts, moving averages, and key metrics.</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
                  <Globe2 className="h-10 w-10 mb-4 opacity-80" />
                  <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
                  <p className="text-pink-100">Access stocks from US, Europe, Asia, and India.</p>
                </Card>
              </div>

              {/* Featured Stocks */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Search className="h-6 w-6 text-blue-500" />
                  Popular Stocks
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {FEATURED_STOCKS.map((stock) => (
                    <motion.button
                      key={stock.symbol}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStockSelect(stock)}
                      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all text-left group"
                    >
                      <p className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {stock.symbol}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {stock.name}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-pulse" />
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
              </div>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                Loading {selectedStock?.symbol} data...
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 dark:bg-red-900/20 rounded-2xl p-8"
            >
              <div className="text-6xl mb-4">😕</div>
              <p className="text-xl text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={clearSelection}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {stockData && !isLoading && (
            <motion.div
              key="data"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <StockDetails stockData={stockData} onClear={clearSelection} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MarketDynamicsPage;
