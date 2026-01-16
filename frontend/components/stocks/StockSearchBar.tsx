"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Stock } from '@/lib/types';
import { useDebounce } from '@/hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, X } from 'lucide-react';

interface StockSearchBarProps {
  onStockSelect: (stock: Stock) => void;
}

const StockSearchBar: React.FC<StockSearchBarProps> = ({ onStockSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      api.searchStocks(debouncedQuery)
        .then(data => {
          setResults(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSelect = (stock: Stock) => {
    setQuery('');
    setResults([]);
    onStockSelect(stock);
    setIsFocused(false);
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Search by name or symbol (e.g., AAPL)"
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
        ) : query && (
          <button onClick={clearQuery} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-5 w-5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && (query.length > 0 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {results.length > 0 ? (
              <ul>
                {results.map(stock => (
                  <li
                    key={stock.symbol}
                    onMouseDown={() => handleSelect(stock)}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{stock.symbol}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{stock.name}</p>
                    </div>
                    <span className="text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full">{stock.country}</span>
                  </li>
                ))}
              </ul>
            ) : !isLoading && query.length > 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No results found.
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockSearchBar;
