'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartDataPoint } from '@/lib/types';
import { calculateRollingCorrelation, mergeDataByDate } from '@/lib/utils';
import { useState } from 'react';

interface RollingCorrelationChartProps {
  data: ChartDataPoint[];
}

export default function RollingCorrelationChart({ data }: RollingCorrelationChartProps) {
  const [window, setWindow] = useState(12);
  const [showCpiNifty, setShowCpiNifty] = useState(true);
  const [showUsdinrNifty, setShowUsdinrNifty] = useState(true);
  const [showCpiUsdinr, setShowCpiUsdinr] = useState(false);

  // Extract values and calculate rolling correlations
  const cpiValues = data.map(d => Number(d.cpi) || 0).filter(v => v > 0);
  const usdinrValues = data.map(d => Number(d.usdinr) || 0).filter(v => v > 0);
  const niftyValues = data.map(d => Number(d.nifty) || 0).filter(v => v > 0);

  const minLength = Math.min(cpiValues.length, usdinrValues.length, niftyValues.length);
  const alignedCPI = cpiValues.slice(0, minLength);
  const alignedUSDINR = usdinrValues.slice(0, minLength);
  const alignedNifty = niftyValues.slice(0, minLength);

  const cpiNiftyCorr = calculateRollingCorrelation(alignedCPI, alignedNifty, window);
  const usdinrNiftyCorr = calculateRollingCorrelation(alignedUSDINR, alignedNifty, window);
  const cpiUsdinrCorr = calculateRollingCorrelation(alignedCPI, alignedUSDINR, window);

  const chartData = data.slice(0, minLength).map((d, i) => ({
    date: d.date,
    cpi_nifty: isNaN(cpiNiftyCorr[i]) ? null : cpiNiftyCorr[i],
    usdinr_nifty: isNaN(usdinrNiftyCorr[i]) ? null : usdinrNiftyCorr[i],
    cpi_usdinr: isNaN(cpiUsdinrCorr[i]) ? null : cpiUsdinrCorr[i],
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rolling Correlation Analysis</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            See how correlations change over time
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Window:</label>
            <select
              value={window}
              onChange={(e) => setWindow(Number(e.target.value))}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
              <option value={24}>24 Months</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCpiNifty}
            onChange={(e) => setShowCpiNifty(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-red-500"></span>
            <span className="text-gray-700 dark:text-gray-300">CPI vs NIFTY</span>
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUsdinrNifty}
            onChange={(e) => setShowUsdinrNifty(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-green-500"></span>
            <span className="text-gray-700 dark:text-gray-300">USD-INR vs NIFTY</span>
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCpiUsdinr}
            onChange={(e) => setShowCpiUsdinr(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-blue-500"></span>
            <span className="text-gray-700 dark:text-gray-300">CPI vs USD-INR</span>
          </span>
        </label>
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
            domain={[-1, 1]}
            label={{ value: 'Correlation Coefficient', angle: -90, position: 'insideLeft' }}
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
            formatter={(value: any) => value?.toFixed(3) || 'N/A'}
          />
          <Legend />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
          <ReferenceLine y={0.5} stroke="#888" strokeDasharray="1 1" strokeOpacity={0.3} />
          <ReferenceLine y={-0.5} stroke="#888" strokeDasharray="1 1" strokeOpacity={0.3} />
          
          {showCpiNifty && (
            <Line
              type="monotone"
              dataKey="cpi_nifty"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              name="CPI vs NIFTY"
              connectNulls
            />
          )}
          {showUsdinrNifty && (
            <Line
              type="monotone"
              dataKey="usdinr_nifty"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="USD-INR vs NIFTY"
              connectNulls
            />
          )}
          {showCpiUsdinr && (
            <Line
              type="monotone"
              dataKey="cpi_usdinr"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name="CPI vs USD-INR"
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <p>• Values close to +1 indicate strong positive correlation</p>
        <p>• Values close to -1 indicate strong negative correlation</p>
        <p>• Values close to 0 indicate weak or no correlation</p>
        <p>• Rolling window: {window} months</p>
      </div>
    </div>
  );
}
