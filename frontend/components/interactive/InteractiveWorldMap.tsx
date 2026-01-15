'use client';

import { useState, useMemo } from 'react';

interface Country {
  code: string;
  name: string;
  lat: number;
  lng: number;
  value: number;
  flag?: string;
}

interface InteractiveWorldMapProps {
  countries: Country[];
  selectedCountries: string[];
  onCountrySelect: (code: string) => void;
  colorScale?: 'inflation' | 'stocks' | 'currency';
  height?: number;
  className?: string;
}

export default function InteractiveWorldMap({
  countries,
  selectedCountries,
  onCountrySelect,
  colorScale = 'inflation',
  height = 400,
  className = '',
}: InteractiveWorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map projection: convert lat/lng to x/y (simple equirectangular)
  const project = (lat: number, lng: number, width: number, height: number) => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  // Get color based on value and scale
  const getColor = (value: number) => {
    if (colorScale === 'inflation') {
      if (value <= 2) return '#10B981'; // green
      if (value <= 5) return '#F59E0B'; // yellow
      if (value <= 10) return '#F97316'; // orange
      return '#EF4444'; // red
    }
    if (colorScale === 'stocks') {
      if (value >= 20) return '#10B981';
      if (value >= 0) return '#3B82F6';
      if (value >= -10) return '#F59E0B';
      return '#EF4444';
    }
    // currency - lower is stronger
    if (value <= -5) return '#10B981';
    if (value <= 0) return '#3B82F6';
    if (value <= 5) return '#F59E0B';
    return '#EF4444';
  };

  // SVG dimensions
  const width = 800;
  const svgHeight = height;

  // Calculate positions
  const countryPositions = useMemo(() => {
    return countries.map(country => ({
      ...country,
      ...project(country.lat, country.lng, width, svgHeight),
      color: getColor(country.value),
    }));
  }, [countries, width, svgHeight]);

  // Draw connection lines between selected countries
  const connectionLines = useMemo(() => {
    const selected = countryPositions.filter(c => selectedCountries.includes(c.code));
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    
    for (let i = 0; i < selected.length - 1; i++) {
      lines.push({
        x1: selected[i].x,
        y1: selected[i].y,
        x2: selected[i + 1].x,
        y2: selected[i + 1].y,
      });
    }
    
    return lines;
  }, [countryPositions, selectedCountries]);

  const handleMouseMove = (e: React.MouseEvent, country: Country) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 10,
      y: e.clientY - rect.top - 10,
    });
    setHoveredCountry(country.code);
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${svgHeight}`}
        className="w-full h-auto"
        style={{ maxHeight: height }}
      >
        {/* Background */}
        <rect width={width} height={svgHeight} fill="#1a1a2e" rx="8" />
        
        {/* Grid lines */}
        {[...Array(7)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={(i + 1) * (svgHeight / 8)}
            x2={width}
            y2={(i + 1) * (svgHeight / 8)}
            stroke="#2d2d44"
            strokeWidth="0.5"
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={(i + 1) * (width / 16)}
            y1={0}
            x2={(i + 1) * (width / 16)}
            y2={svgHeight}
            stroke="#2d2d44"
            strokeWidth="0.5"
          />
        ))}

        {/* Connection lines */}
        {connectionLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#6366F1"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
            className="animate-pulse"
          />
        ))}

        {/* Country dots */}
        {countryPositions.map((country) => {
          const isSelected = selectedCountries.includes(country.code);
          const isHovered = hoveredCountry === country.code;
          const baseRadius = isSelected ? 10 : 6;
          const radius = isHovered ? baseRadius + 3 : baseRadius;

          return (
            <g
              key={country.code}
              onClick={() => onCountrySelect(country.code)}
              onMouseMove={(e) => handleMouseMove(e, country)}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer"
            >
              {/* Glow effect for selected */}
              {isSelected && (
                <circle
                  cx={country.x}
                  cy={country.y}
                  r={radius + 5}
                  fill={country.color}
                  opacity="0.3"
                  className="animate-ping"
                  style={{ animationDuration: '2s' }}
                />
              )}
              
              {/* Main dot */}
              <circle
                cx={country.x}
                cy={country.y}
                r={radius}
                fill={country.color}
                stroke={isSelected ? '#fff' : 'transparent'}
                strokeWidth={isSelected ? 3 : 0}
                className="transition-all duration-200"
              />
              
              {/* Country code label for selected */}
              {isSelected && (
                <text
                  x={country.x}
                  y={country.y + radius + 14}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {country.code}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredCountry && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm z-10"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translateY(-100%)',
          }}
        >
          {(() => {
            const country = countries.find(c => c.code === hoveredCountry);
            if (!country) return null;
            return (
              <div className="flex items-center gap-2">
                <span className="text-lg">{country.flag}</span>
                <div>
                  <div className="font-semibold">{country.name}</div>
                  <div className="text-gray-300">
                    {colorScale === 'inflation' && `Inflation: ${country.value?.toFixed(1)}%`}
                    {colorScale === 'stocks' && `Return: ${country.value?.toFixed(1)}%`}
                    {colorScale === 'currency' && `Change: ${country.value?.toFixed(1)}%`}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
