'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Country } from '@/lib/types';

interface CountrySelectorProps {
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
  maxSelection?: number;
}

// Color palette for charts
export const COUNTRY_COLORS: { [key: string]: string } = {
  US: '#3b82f6',  // Blue
  GB: '#ef4444',  // Red
  DE: '#f59e0b',  // Amber
  FR: '#8b5cf6',  // Purple
  JP: '#ec4899',  // Pink
  CN: '#ef4444',  // Red
  IN: '#f97316',  // Orange
  BR: '#22c55e',  // Green
  AU: '#14b8a6',  // Teal
  CA: '#dc2626',  // Red
  KR: '#6366f1',  // Indigo
  MX: '#059669',  // Emerald
  RU: '#1d4ed8',  // Blue
  IT: '#16a34a',  // Green
  ES: '#eab308',  // Yellow
  NL: '#ea580c',  // Orange
  CH: '#dc2626',  // Red
  SE: '#0284c7',  // Sky
  PL: '#dc2626',  // Red
  TR: '#dc2626',  // Red
  SA: '#16a34a',  // Green
  AE: '#000000',  // Black
  IL: '#0ea5e9',  // Sky
  SG: '#dc2626',  // Red
  HK: '#dc2626',  // Red
  TW: '#0284c7',  // Sky
  ID: '#dc2626',  // Red
  TH: '#1e40af',  // Blue
  MY: '#1e40af',  // Blue
  PH: '#0284c7',  // Sky
  VN: '#dc2626',  // Red
  NZ: '#000000',  // Black
  ZA: '#16a34a',  // Green
  NG: '#16a34a',  // Green
  EG: '#000000',  // Black
  AR: '#6366f1',  // Indigo
  CL: '#0284c7',  // Sky
  CO: '#f59e0b',  // Amber
};

export function getCountryColor(code: string, index: number = 0): string {
  if (COUNTRY_COLORS[code]) {
    return COUNTRY_COLORS[code];
  }
  // Fallback colors
  const fallbackColors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
  ];
  return fallbackColors[index % fallbackColors.length];
}

export default function CountrySelector({
  selectedCountries,
  onSelectionChange,
  maxSelection = 10
}: CountrySelectorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const [countriesRes, regionsRes] = await Promise.all([
        api.getAllCountries(),
        api.getRegions()
      ]);
      setCountries(countriesRes.data);
      setRegions(['All', ...regionsRes.data.regions]);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCountry = (code: string) => {
    if (selectedCountries.includes(code)) {
      onSelectionChange(selectedCountries.filter(c => c !== code));
    } else if (selectedCountries.length < maxSelection) {
      onSelectionChange([...selectedCountries, code]);
    }
  };

  const selectAll = () => {
    const filtered = filteredCountries.slice(0, maxSelection);
    onSelectionChange(filtered.map(c => c.code));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-64" />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Select Countries to Compare
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selected: {selectedCountries.length} / {maxSelection}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            Select First {maxSelection}
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Countries Tags */}
      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          {selectedCountries.map((code, index) => {
            const country = countries.find(c => c.code === code);
            return (
              <span
                key={code}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: getCountryColor(code, index) }}
              >
                <span>{country?.flag}</span>
                <span>{country?.name || code}</span>
                <button
                  onClick={() => toggleCountry(code)}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Country Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-96 overflow-y-auto">
        {filteredCountries.map((country, index) => {
          const isSelected = selectedCountries.includes(country.code);
          const isDisabled = !isSelected && selectedCountries.length >= maxSelection;

          return (
            <button
              key={country.code}
              onClick={() => !isDisabled && toggleCountry(country.code)}
              disabled={isDisabled}
              className={`
                flex items-center gap-2 p-3 rounded-lg text-left transition-all
                ${isSelected 
                  ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500 dark:border-blue-400' 
                  : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-xl">{country.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {country.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {country.stockIndex.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No countries match your search
        </div>
      )}
    </div>
  );
}
