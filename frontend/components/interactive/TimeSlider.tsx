'use client';

import { useState, useEffect, useRef } from 'react';

interface TimeSliderProps {
  startYear: number;
  endYear: number;
  currentYear: number;
  onYearChange: (year: number) => void;
  autoPlay?: boolean;
  playSpeed?: number; // ms per year
  className?: string;
}

export default function TimeSlider({
  startYear,
  endYear,
  currentYear,
  onYearChange,
  autoPlay = false,
  playSpeed = 1000,
  className = '',
}: TimeSliderProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(playSpeed);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        // Calculate next year directly instead of using callback form
        const nextYear = currentYear + 1;
        if (nextYear > endYear) {
          setIsPlaying(false);
          onYearChange(startYear);
        } else {
          onYearChange(nextYear);
        }
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, endYear, startYear, onYearChange]);

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  const progress = ((currentYear - startYear) / (endYear - startYear)) * 100;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🕐</span> Time Machine
        </h4>
        <div className="flex items-center gap-2">
          {/* Speed control */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value={2000}>0.5x</option>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={250}>4x</option>
          </select>
          
          {/* Play/Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${isPlaying 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
              }
            `}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      </div>

      {/* Current year display */}
      <div className="text-center mb-4">
        <span className="text-5xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
          {currentYear}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative mb-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Year markers */}
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">{startYear}</span>
          <span className="text-xs text-gray-500">{endYear}</span>
        </div>
      </div>

      {/* Year slider */}
      <input
        type="range"
        min={startYear}
        max={endYear}
        value={currentYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="w-full h-2 bg-transparent cursor-pointer accent-blue-600"
      />

      {/* Quick year buttons */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {years.filter((_, i) => i % 5 === 0 || i === years.length - 1).map(year => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
              ${currentYear === year 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}
