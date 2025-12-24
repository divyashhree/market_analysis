'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/lib/types';
import { calculateMovingAverageForChart } from '@/lib/utils';
import { useState } from 'react';

interface LineChartWithMAProps {
  data: ChartDataPoint[];
  dataKey: string;
  color: string;
  title: string;
  yAxisLabel: string;
}

export default function LineChartWithMA({ data, dataKey, color, title, yAxisLabel }: LineChartWithMAProps) {
  const [showMA3, setShowMA3] = useState(false);
  const [showMA6, setShowMA6] = useState(false);
  const [showMA12, setShowMA12] = useState(false);

  // Calculate moving averages
  let chartData = data;
  if (showMA3) {
    chartData = calculateMovingAverageForChart(chartData, dataKey, 3);
  }
  if (showMA6) {
    chartData = calculateMovingAverageForChart(chartData, dataKey, 6);
  }
  if (showMA12) {
    chartData = calculateMovingAverageForChart(chartData, dataKey, 12);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMA3}
              onChange={(e) => setShowMA3(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-gray-700 dark:text-gray-300">3M MA</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMA6}
              onChange={(e) => setShowMA6(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-gray-700 dark:text-gray-300">6M MA</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMA12}
              onChange={(e) => setShowMA12(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-gray-700 dark:text-gray-300">12M MA</span>
          </label>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'currentColor' }}
            className="text-gray-600 dark:text-gray-400 text-xs"
          />
          <YAxis
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            tick={{ fill: 'currentColor' }}
            className="text-gray-600 dark:text-gray-400 text-xs"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--tooltip-text)' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            name="Actual"
            connectNulls
          />
          {showMA3 && (
            <Line
              type="monotone"
              dataKey={`${dataKey}_ma3`}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              name="3M MA"
              opacity={0.7}
              connectNulls
            />
          )}
          {showMA6 && (
            <Line
              type="monotone"
              dataKey={`${dataKey}_ma6`}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="10 5"
              dot={false}
              name="6M MA"
              opacity={0.6}
              connectNulls
            />
          )}
          {showMA12 && (
            <Line
              type="monotone"
              dataKey={`${dataKey}_ma12`}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="15 5"
              dot={false}
              name="12M MA"
              opacity={0.8}
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
