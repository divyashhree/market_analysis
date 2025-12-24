'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface DualAxisChartProps {
  data: ChartDataPoint[];
  title: string;
  leftDataKey: string;
  rightDataKey: string;
  leftColor: string;
  rightColor: string;
  leftLabel: string;
  rightLabel: string;
}

export default function DualAxisChart({
  data,
  title,
  leftDataKey,
  rightDataKey,
  leftColor,
  rightColor,
  leftLabel,
  rightLabel,
}: DualAxisChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  // Filter data to only include points with both values
  const filteredData = data.filter(d => d[leftDataKey] !== undefined && d[rightDataKey] !== undefined);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData} margin={{ top: 5, right: 50, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`;
            }}
          />
          <YAxis 
            yAxisId="left"
            stroke={leftColor}
            tick={{ fill: '#9CA3AF' }}
            label={{ value: leftLabel, angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            tickFormatter={(value) => formatNumber(value, 2)}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke={rightColor}
            tick={{ fill: '#9CA3AF' }}
            label={{ value: rightLabel, angle: 90, position: 'insideRight', fill: '#9CA3AF' }}
            tickFormatter={(value) => formatNumber(value, 2)}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            labelStyle={{ color: '#F3F4F6' }}
            formatter={(value: any) => formatNumber(Number(value), 2)}
          />
          <Legend wrapperStyle={{ color: '#9CA3AF' }} />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey={leftDataKey} 
            stroke={leftColor} 
            strokeWidth={2}
            dot={false}
            name={leftLabel}
            activeDot={{ r: 6 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey={rightDataKey} 
            stroke={rightColor} 
            strokeWidth={2}
            dot={false}
            name={rightLabel}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
