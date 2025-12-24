'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/lib/utils';

interface HistogramProps {
  title: string;
  highInflationData: number[];
  lowInflationData: number[];
}

export default function Histogram({ title, highInflationData, lowInflationData }: HistogramProps) {
  // Create histogram bins
  const createHistogram = (data: number[], label: string) => {
    if (!data || data.length === 0) return [];
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binCount = 10;
    const binSize = (max - min) / binCount;
    
    const bins = Array(binCount).fill(0);
    data.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
      bins[binIndex]++;
    });
    
    return bins.map((count, index) => ({
      range: `${formatNumber(min + index * binSize, 0)}-${formatNumber(min + (index + 1) * binSize, 0)}`,
      [label]: count,
    }));
  };

  const highInflationHist = createHistogram(highInflationData, 'High Inflation');
  const lowInflationHist = createHistogram(lowInflationData, 'Low Inflation');

  // Merge histograms
  const mergedData = highInflationHist.map((item, index) => ({
    ...item,
    ...lowInflationHist[index],
  }));

  if (mergedData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Insufficient data for histogram
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={mergedData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="range" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend wrapperStyle={{ color: '#9CA3AF' }} />
          <Bar dataKey="High Inflation" fill="#EF4444" />
          <Bar dataKey="Low Inflation" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
