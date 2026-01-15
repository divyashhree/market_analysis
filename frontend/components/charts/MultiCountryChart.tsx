'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getCountryColor } from '../country/CountrySelector';

interface DataPoint {
  date: string;
  value: number;
  country: string;
  countryName: string;
}

interface MultiCountryChartProps {
  title: string;
  data: { [countryCode: string]: DataPoint[] };
  selectedCountries: string[];
  valueFormatter?: (value: number) => string;
  yAxisLabel?: string;
  height?: number;
}

export default function MultiCountryChart({
  title,
  data,
  selectedCountries,
  valueFormatter = (v) => v.toFixed(2),
  yAxisLabel = 'Value',
  height = 400,
}: MultiCountryChartProps) {
  // Transform data for Recharts
  const chartData = useMemo(() => {
    // Collect all dates
    const dateMap: { [date: string]: { [country: string]: number } } = {};

    selectedCountries.forEach((code) => {
      const countryData = data[code] || [];
      countryData.forEach((point) => {
        if (!dateMap[point.date]) {
          dateMap[point.date] = {};
        }
        dateMap[point.date][code] = point.value;
      });
    });

    // Convert to array and sort by date
    return Object.entries(dateMap)
      .map(([date, values]) => ({
        date,
        displayDate: new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        }),
        ...values,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data, selectedCountries]);

  // Get country names for legend
  const countryNames: { [code: string]: string } = useMemo(() => {
    const names: { [code: string]: string } = {};
    selectedCountries.forEach((code) => {
      const countryData = data[code];
      if (countryData && countryData.length > 0) {
        names[code] = countryData[0].countryName || code;
      } else {
        names[code] = code;
      }
    });
    return names;
  }, [data, selectedCountries]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available. Select countries to compare.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis
            dataKey="displayDate"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickLine={{ stroke: '#374151' }}
            axisLine={{ stroke: '#374151' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickLine={{ stroke: '#374151' }}
            axisLine={{ stroke: '#374151' }}
            tickFormatter={valueFormatter}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              fill: '#9ca3af',
              fontSize: 12,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '12px',
            }}
            labelStyle={{ color: '#f9fafb', fontWeight: 'bold', marginBottom: '8px' }}
            itemStyle={{ color: '#d1d5db' }}
            formatter={(value: number, name: string) => [
              valueFormatter(value),
              countryNames[name] || name,
            ]}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value: string) => (
              <span style={{ color: '#d1d5db' }}>{countryNames[value] || value}</span>
            )}
          />
          {selectedCountries.map((code, index) => (
            <Line
              key={code}
              type="monotone"
              dataKey={code}
              name={code}
              stroke={getCountryColor(code, index)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
