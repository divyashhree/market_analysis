'use client';

import { useState, useMemo } from 'react';
import { Country } from '@/lib/types';

interface InteractiveWorldMapProps {
  countries: Country[];
  selectedCountries: string[];
  onCountryClick: (code: string) => void;
  dataByCountry?: { [code: string]: number };
  dataLabel?: string;
  colorScale?: 'green-red' | 'blue' | 'heat';
}

// Simplified world map country positions (approximate center points)
const COUNTRY_POSITIONS: { [code: string]: { x: number; y: number; region: string } } = {
  // North America
  US: { x: 20, y: 35, region: 'North America' },
  CA: { x: 18, y: 25, region: 'North America' },
  MX: { x: 15, y: 42, region: 'North America' },
  
  // Europe
  GB: { x: 47, y: 27, region: 'Europe' },
  DE: { x: 52, y: 29, region: 'Europe' },
  FR: { x: 49, y: 32, region: 'Europe' },
  IT: { x: 53, y: 35, region: 'Europe' },
  ES: { x: 46, y: 36, region: 'Europe' },
  NL: { x: 50, y: 28, region: 'Europe' },
  CH: { x: 51, y: 32, region: 'Europe' },
  SE: { x: 55, y: 22, region: 'Europe' },
  PL: { x: 56, y: 28, region: 'Europe' },
  RU: { x: 70, y: 25, region: 'Europe' },
  
  // Asia-Pacific
  CN: { x: 78, y: 38, region: 'Asia-Pacific' },
  JP: { x: 88, y: 35, region: 'Asia-Pacific' },
  IN: { x: 72, y: 45, region: 'Asia-Pacific' },
  KR: { x: 85, y: 36, region: 'Asia-Pacific' },
  AU: { x: 87, y: 72, region: 'Asia-Pacific' },
  SG: { x: 78, y: 55, region: 'Asia-Pacific' },
  HK: { x: 82, y: 44, region: 'Asia-Pacific' },
  TW: { x: 84, y: 42, region: 'Asia-Pacific' },
  ID: { x: 80, y: 58, region: 'Asia-Pacific' },
  TH: { x: 77, y: 50, region: 'Asia-Pacific' },
  MY: { x: 77, y: 54, region: 'Asia-Pacific' },
  PH: { x: 84, y: 50, region: 'Asia-Pacific' },
  VN: { x: 79, y: 48, region: 'Asia-Pacific' },
  NZ: { x: 95, y: 78, region: 'Asia-Pacific' },
  
  // Middle East
  SA: { x: 62, y: 45, region: 'Middle East' },
  AE: { x: 65, y: 46, region: 'Middle East' },
  IL: { x: 58, y: 40, region: 'Middle East' },
  TR: { x: 58, y: 36, region: 'Middle East' },
  
  // South America
  BR: { x: 30, y: 60, region: 'South America' },
  AR: { x: 28, y: 75, region: 'South America' },
  CL: { x: 26, y: 72, region: 'South America' },
  CO: { x: 24, y: 52, region: 'South America' },
  
  // Africa
  ZA: { x: 56, y: 72, region: 'Africa' },
  NG: { x: 52, y: 52, region: 'Africa' },
  EG: { x: 57, y: 42, region: 'Africa' },
};

export default function InteractiveWorldMap({
  countries,
  selectedCountries,
  onCountryClick,
  dataByCountry = {},
  dataLabel = 'Value',
  colorScale = 'blue',
}: InteractiveWorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const { minValue, maxValue } = useMemo(() => {
    const values = Object.values(dataByCountry).filter(v => v !== null && v !== undefined);
    return {
      minValue: Math.min(...values, 0),
      maxValue: Math.max(...values, 1),
    };
  }, [dataByCountry]);

  const getColor = (code: string): string => {
    const value = dataByCountry[code];
    if (value === undefined || value === null) return '#94a3b8';

    const normalized = (value - minValue) / (maxValue - minValue);

    if (colorScale === 'green-red') {
      // Green (low) to Red (high)
      const r = Math.round(normalized * 255);
      const g = Math.round((1 - normalized) * 200);
      return `rgb(${r}, ${g}, 80)`;
    } else if (colorScale === 'heat') {
      // Yellow to Red
      const r = 255;
      const g = Math.round((1 - normalized) * 200);
      return `rgb(${r}, ${g}, 50)`;
    } else {
      // Blue scale
      const intensity = 0.3 + normalized * 0.7;
      return `rgba(59, 130, 246, ${intensity})`;
    }
  };

  const getSize = (code: string): number => {
    const isSelected = selectedCountries.includes(code);
    const isHovered = hoveredCountry === code;
    
    if (isHovered) return 20;
    if (isSelected) return 16;
    return 12;
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 relative overflow-hidden">
      {/* Map Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🗺️ Interactive World Map
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Click on a country to select/deselect
          </div>
          {/* Legend */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Low</span>
            <div className="w-20 h-2 rounded bg-gradient-to-r from-green-400 to-red-500" />
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <svg 
        viewBox="0 0 100 85" 
        className="w-full h-auto min-h-[300px]"
        style={{ background: 'transparent' }}
      >
        {/* Grid lines for reference */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.1" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="85" fill="url(#grid)" />

        {/* Connections between selected countries */}
        {selectedCountries.length > 1 && selectedCountries.map((code1, i) => 
          selectedCountries.slice(i + 1).map((code2) => {
            const pos1 = COUNTRY_POSITIONS[code1];
            const pos2 = COUNTRY_POSITIONS[code2];
            if (!pos1 || !pos2) return null;
            return (
              <line
                key={`${code1}-${code2}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke="#3b82f6"
                strokeWidth="0.3"
                strokeDasharray="1,1"
                opacity="0.5"
                className="animate-pulse"
              />
            );
          })
        )}

        {/* Country dots */}
        {countries.map((country) => {
          const pos = COUNTRY_POSITIONS[country.code];
          if (!pos) return null;

          const isSelected = selectedCountries.includes(country.code);
          const isHovered = hoveredCountry === country.code;
          const size = getSize(country.code);
          const color = getColor(country.code);

          return (
            <g key={country.code}>
              {/* Pulse ring for selected */}
              {isSelected && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size + 4}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="0.5"
                  opacity="0.5"
                  className="animate-ping"
                  style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                />
              )}
              
              {/* Main dot */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size / 2}
                fill={isSelected ? '#3b82f6' : color}
                stroke={isSelected ? '#1d4ed8' : isHovered ? '#374151' : 'transparent'}
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200"
                onClick={() => onCountryClick(country.code)}
                onMouseEnter={() => setHoveredCountry(country.code)}
                onMouseLeave={() => setHoveredCountry(null)}
                style={{
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${pos.x}px ${pos.y}px`,
                }}
              />

              {/* Country label (show on hover or selected) */}
              {(isHovered || isSelected) && (
                <text
                  x={pos.x}
                  y={pos.y - size / 2 - 2}
                  textAnchor="middle"
                  className="text-[3px] font-semibold fill-gray-800 dark:fill-gray-200 pointer-events-none"
                >
                  {country.flag} {country.code}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoveredCountry && (
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 z-10">
          {(() => {
            const country = countries.find(c => c.code === hoveredCountry);
            const value = dataByCountry[hoveredCountry];
            if (!country) return null;
            return (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{country.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {country.stockIndex.name}
                  </div>
                  {value !== undefined && (
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {dataLabel}: {value.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Selected count */}
      <div className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
        {selectedCountries.length} selected
      </div>
    </div>
  );
}
