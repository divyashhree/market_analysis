'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  minDate?: string;
  maxDate?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  minDate = '2014-01-01',
  maxDate = '2024-12-31',
}: DateRangePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const presets = [
    { label: 'Last 1 Year', months: 12 },
    { label: 'Last 3 Years', months: 36 },
    { label: 'Last 5 Years', months: 60 },
    { label: 'All Time', months: -1 },
  ];

  const applyPreset = (months: number) => {
    if (months === -1) {
      onStartDateChange(minDate);
      onEndDateChange(maxDate);
    } else {
      const end = new Date(maxDate);
      const start = new Date(end);
      start.setMonth(start.getMonth() - months);
      
      onStartDateChange(start.toISOString().split('T')[0]);
      onEndDateChange(maxDate);
    }
    onApply();
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        <span>{startDate} to {endDate}</span>
      </button>

      {showPicker && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 min-w-[320px]">
          <div className="space-y-4">
            {/* Quick Presets */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Quick Select</h4>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset.months)}
                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Range */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Custom Range</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  onApply();
                  setShowPicker(false);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-lg transition-colors"
              >
                Apply
              </button>
              <button
                onClick={() => setShowPicker(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
