'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartDataPoint } from '@/lib/types';
import { EconomicEvent } from '@/lib/economicEvents';

interface LineChartWithEventsProps {
  data: ChartDataPoint[];
  dataKey: string;
  color: string;
  title: string;
  yAxisLabel: string;
  events: EconomicEvent[];
}

export default function LineChartWithEvents({
  data,
  dataKey,
  color,
  title,
  yAxisLabel,
  events,
}: LineChartWithEventsProps) {
  // Custom tooltip to show events
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const event = events.find(e => e.date === label);

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {payload[0].name}: <span className="font-semibold">{payload[0].value.toFixed(2)}</span>
        </p>
        {event && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-primary">{event.title}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Vertical lines mark major economic events. Hover for details.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Event markers */}
          {events.map((event) => (
            <ReferenceLine
              key={event.date}
              x={event.date}
              stroke={
                event.type === 'positive'
                  ? '#10B981'
                  : event.type === 'negative'
                  ? '#EF4444'
                  : '#6B7280'
              }
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: event.title.substring(0, 15),
                position: 'top',
                fill: 'currentColor',
                fontSize: 10,
                angle: -45,
              }}
            />
          ))}

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            name={title}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Event Legend */}
      {events.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Events in This Period</h4>
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.date} className="flex items-start gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                  event.type === 'positive'
                    ? 'bg-green-500'
                    : event.type === 'negative'
                    ? 'bg-red-500'
                    : 'bg-gray-500'
                }`}></span>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{event.date}</span>
                  <span className="text-gray-600 dark:text-gray-400"> - {event.title}: {event.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
