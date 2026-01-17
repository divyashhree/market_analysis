'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Dataset, CorrelationMatrix } from '@/lib/types';
import DualAxisChart from '@/components/charts/DualAxisChart';
import ScatterPlot from '@/components/charts/ScatterPlot';
import CorrelationHeatmap from '@/components/charts/CorrelationHeatmap';
import RollingCorrelationChart from '@/components/charts/RollingCorrelationChart';
import PercentageChangeHeatmap from '@/components/charts/PercentageChangeHeatmap';
import LineChartWithEvents from '@/components/charts/LineChartWithEvents';
import { Card } from '@/components/ui/Card';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import { GlobalDataStatus } from '@/components/ui/DataFreshnessIndicator';
import { mergeDataByDate, calculateCorrelation } from '@/lib/utils';
import { getEventsInRange } from '@/lib/economicEvents';

export default function AnalysisPage() {
  const [data, setData] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeft, setSelectedLeft] = useState('cpi');
  const [selectedRight, setSelectedRight] = useState('nifty');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAllData();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate correlations
  const calculateCorrelations = (): CorrelationMatrix | null => {
    if (!data) return null;

    const merged = mergeDataByDate(data.cpi, data.usdinr, data.nifty);
    const cpiValues = merged.filter(d => d.cpi !== undefined).map(d => Number(d.cpi));
    const usdinrValues = merged.filter(d => d.usdinr !== undefined).map(d => Number(d.usdinr));
    const niftyValues = merged.filter(d => d.nifty !== undefined).map(d => Number(d.nifty));

    // Align arrays to same length
    const minLength = Math.min(cpiValues.length, usdinrValues.length, niftyValues.length);
    const alignedCPI = cpiValues.slice(0, minLength);
    const alignedUSDINR = usdinrValues.slice(0, minLength);
    const alignedNifty = niftyValues.slice(0, minLength);

    return {
      cpi_usdinr: calculateCorrelation(alignedCPI, alignedUSDINR),
      cpi_nifty: calculateCorrelation(alignedCPI, alignedNifty),
      usdinr_nifty: calculateCorrelation(alignedUSDINR, alignedNifty),
    };
  };

  const correlations = calculateCorrelations();
  const mergedData = data ? mergeDataByDate(data.cpi, data.usdinr, data.nifty) : [];

  const colorMap: { [key: string]: string } = {
    cpi: '#EF4444',
    usdinr: '#10B981',
    nifty: '#3B82F6',
  };

  const labelMap: { [key: string]: string } = {
    cpi: 'CPI',
    usdinr: 'USD-INR',
    nifty: 'NIFTY 50',
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Data</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Advanced correlation analysis and comparative visualizations
        </p>
      </div>

      {/* Global Data Status Banner */}
      {data?.metadata && <GlobalDataStatus metadata={data.metadata} />}

      {/* Dual Axis Chart Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Compare Two Variables
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Left Axis
            </label>
            <select
              value={selectedLeft}
              onChange={(e) => setSelectedLeft(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="cpi">CPI</option>
              <option value="usdinr">USD-INR</option>
              <option value="nifty">NIFTY 50</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Right Axis
            </label>
            <select
              value={selectedRight}
              onChange={(e) => setSelectedRight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="cpi">CPI</option>
              <option value="usdinr">USD-INR</option>
              <option value="nifty">NIFTY 50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dual Axis Chart */}
      <div className="mb-8">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <DualAxisChart
            data={mergedData}
            title={`${labelMap[selectedLeft]} vs ${labelMap[selectedRight]}`}
            leftDataKey={selectedLeft}
            rightDataKey={selectedRight}
            leftColor={colorMap[selectedLeft]}
            rightColor={colorMap[selectedRight]}
            leftLabel={labelMap[selectedLeft]}
            rightLabel={labelMap[selectedRight]}
          />
        )}
      </div>

      {/* Correlation Heatmap */}
      <div className="mb-8">
        {loading ? (
          <ChartSkeleton />
        ) : correlations ? (
          <CorrelationHeatmap correlations={correlations} />
        ) : null}
      </div>

      {/* Scatter Plots */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Correlation Scatter Plots
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <ScatterPlot
              data={mergedData}
              title="CPI vs NIFTY 50"
              xKey="cpi"
              yKey="nifty"
              xLabel="CPI"
              yLabel="NIFTY 50"
              color="#3B82F6"
              correlation={correlations?.cpi_nifty}
            />
            <ScatterPlot
              data={mergedData}
              title="USD-INR vs NIFTY 50"
              xKey="usdinr"
              yKey="nifty"
              xLabel="USD-INR"
              yLabel="NIFTY 50"
              color="#10B981"
              correlation={correlations?.usdinr_nifty}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <ScatterPlot
            data={mergedData}
            title="CPI vs USD-INR"
            xKey="cpi"
            yKey="usdinr"
            xLabel="CPI"
            yLabel="USD-INR"
            color="#EF4444"
            correlation={correlations?.cpi_usdinr}
          />
        )}
      </div>

      {/* Rolling Correlation Analysis */}
      {loading ? (
        <ChartSkeleton />
      ) : data ? (
        <Card className="mt-8">
          <RollingCorrelationChart data={mergedData} />
        </Card>
      ) : null}

      {/* Percentage Change Heatmaps */}
      {loading ? (
        <ChartSkeleton />
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <Card>
            <PercentageChangeHeatmap data={data.cpi} title="CPI Monthly Changes" colorScale="red" />
          </Card>
          <Card>
            <PercentageChangeHeatmap data={data.usdinr} title="USD-INR Monthly Changes" colorScale="green" />
          </Card>
          <Card>
            <PercentageChangeHeatmap data={data.nifty} title="NIFTY 50 Monthly Changes" colorScale="blue" />
          </Card>
        </div>
      ) : null}

      {/* Event-Annotated Charts */}
      {loading ? (
        <ChartSkeleton />
      ) : data ? (
        <div className="grid grid-cols-1 gap-8 mt-8">
          <Card>
            <LineChartWithEvents
              data={data.nifty.map(d => ({ date: d.date, value: d.value }))}
              dataKey="value"
              color="#3B82F6"
              title="NIFTY 50 with Economic Events"
              yAxisLabel="Index Value"
              events={getEventsInRange('2014-01-01', '2024-12-31')}
            />
          </Card>
        </div>
      ) : null}

      {/* Interpretation Guide */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          Understanding Correlations
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li>• <strong>Strong Positive (0.7 to 1.0):</strong> Variables move together in the same direction</li>
          <li>• <strong>Moderate Positive (0.3 to 0.7):</strong> Variables tend to move together</li>
          <li>• <strong>Weak (-0.3 to 0.3):</strong> Little to no linear relationship</li>
          <li>• <strong>Moderate Negative (-0.7 to -0.3):</strong> Variables tend to move in opposite directions</li>
          <li>• <strong>Strong Negative (-1.0 to -0.7):</strong> Variables move in opposite directions</li>
        </ul>
      </div>
    </div>
  );
}
