'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { ChartDataPoint } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface ScatterPlotProps {
  data: ChartDataPoint[];
  title: string;
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
  color: string;
  correlation?: number;
}

export default function ScatterPlot({
  data,
  title,
  xKey,
  yKey,
  xLabel,
  yLabel,
  color,
  correlation,
}: ScatterPlotProps) {
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

  // Filter and format data
  const scatterData = data
    .filter(d => d[xKey] !== undefined && d[yKey] !== undefined)
    .map(d => ({
      x: Number(d[xKey]),
      y: Number(d[yKey]),
    }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {correlation !== undefined && (
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Correlation: </span>
            <span className={`font-bold ${
              correlation > 0.5 ? 'text-green-600' : 
              correlation < -0.5 ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {correlation.toFixed(3)}
            </span>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            type="number" 
            dataKey="x" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) => formatNumber(value, 0)}
          >
            <Label 
              value={xLabel} 
              position="insideBottom" 
              offset={-10}
              style={{ fill: '#9CA3AF' }}
            />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="y" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) => formatNumber(value, 0)}
          >
            <Label 
              value={yLabel} 
              angle={-90} 
              position="insideLeft"
              style={{ fill: '#9CA3AF' }}
            />
          </YAxis>
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            formatter={(value: any) => formatNumber(Number(value), 2)}
            labelFormatter={() => ''}
          />
          <Scatter 
            data={scatterData} 
            fill={color}
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
