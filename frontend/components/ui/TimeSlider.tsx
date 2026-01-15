'use client';

import { useState, useEffect, useCallback } from 'react';

interface TimeSliderProps {
  startYear: number;
  endYear: number;
  value: number;
  onChange: (year: number) => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  playSpeed?: number;
}

export default function TimeSlider({
  startYear,
  endYear,
  value,
  onChange,
  isPlaying = false,
  onPlayPause,
  playSpeed = 1000,
}: TimeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const nextYear = value + 1;
        onChange(nextYear > endYear ? startYear : nextYear);
      }, playSpeed);
      return () => clearInterval(interval);
    }
  }, [isPlaying, endYear, startYear, onChange, playSpeed, value]);

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const progress = ((localValue - startYear) / (endYear - startYear)) * 100;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        {onPlayPause && (
          <button
            onClick={onPlayPause}
            className={`
              p-3 rounded-full transition-all duration-300
              ${isPlaying 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'}
            `}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}

        {/* Year Display */}
        <div className="min-w-[80px] text-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {localValue}
          </span>
        </div>

        {/* Slider */}
        <div className="flex-1 relative">
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Progress bar */}
            <div 
              className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <input
            type="range"
            min={startYear}
            max={endYear}
            value={localValue}
            onChange={handleSliderChange}
            className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
          />

          {/* Year markers */}
          <div className="flex justify-between mt-2">
            {years.filter((_, i) => i % Math.ceil(years.length / 6) === 0 || i === years.length - 1).map((year) => (
              <button
                key={year}
                onClick={() => onChange(year)}
                className={`
                  text-xs transition-all duration-200
                  ${year === localValue 
                    ? 'text-blue-600 dark:text-blue-400 font-bold scale-110' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
                `}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Speed:</span>
          <select 
            className="text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300"
            defaultValue="1000"
          >
            <option value="2000">0.5x</option>
            <option value="1000">1x</option>
            <option value="500">2x</option>
            <option value="250">4x</option>
          </select>
        </div>
      </div>
    </div>
  );
}
