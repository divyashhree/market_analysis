'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Dataset, Insight, InsightType } from '@/lib/types';
import Histogram from '@/components/charts/Histogram';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import { calculateCorrelation, mergeDataByDate } from '@/lib/utils';

export default function InsightsPage() {
  const [data, setData] = useState<Dataset | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.getAllData();
      setData(result);
      generateInsights(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (dataset: Dataset) => {
    const merged = mergeDataByDate(dataset.cpi, dataset.usdinr, dataset.nifty);
    const generatedInsights: Insight[] = [];

    // Calculate correlations
    const cpiValues = merged.filter(d => d.cpi !== undefined).map(d => Number(d.cpi));
    const usdinrValues = merged.filter(d => d.usdinr !== undefined).map(d => Number(d.usdinr));
    const niftyValues = merged.filter(d => d.nifty !== undefined).map(d => Number(d.nifty));

    const minLength = Math.min(cpiValues.length, usdinrValues.length, niftyValues.length);
    const alignedCPI = cpiValues.slice(0, minLength);
    const alignedUSDINR = usdinrValues.slice(0, minLength);
    const alignedNifty = niftyValues.slice(0, minLength);

    const corr_cpi_nifty = calculateCorrelation(alignedCPI, alignedNifty);
    const corr_usdinr_nifty = calculateCorrelation(alignedUSDINR, alignedNifty);
    const corr_cpi_usdinr = calculateCorrelation(alignedCPI, alignedUSDINR);

    // Insight 1: CPI-NIFTY correlation
    if (Math.abs(corr_cpi_nifty) > 0.5) {
      generatedInsights.push({
        id: '1',
        type: corr_cpi_nifty > 0 ? 'positive' : 'negative',
        title: `${corr_cpi_nifty > 0 ? 'Positive' : 'Negative'} Correlation: CPI & NIFTY 50`,
        description: `The correlation coefficient between CPI and NIFTY 50 is ${corr_cpi_nifty.toFixed(3)}, indicating a ${Math.abs(corr_cpi_nifty) > 0.7 ? 'strong' : 'moderate'} ${corr_cpi_nifty > 0 ? 'positive' : 'negative'} relationship. ${corr_cpi_nifty > 0 ? 'When inflation rises, the market tends to rise as well.' : 'When inflation rises, the market tends to decline.'}`,
        value: corr_cpi_nifty,
      });
    } else {
      generatedInsights.push({
        id: '1',
        type: 'neutral',
        title: 'Weak Correlation: CPI & NIFTY 50',
        description: `The correlation coefficient between CPI and NIFTY 50 is ${corr_cpi_nifty.toFixed(3)}, suggesting a weak linear relationship. Other factors may have stronger influence on market performance.`,
        value: corr_cpi_nifty,
      });
    }

    // Insight 2: USD-INR-NIFTY correlation
    if (Math.abs(corr_usdinr_nifty) > 0.5) {
      generatedInsights.push({
        id: '2',
        type: corr_usdinr_nifty > 0 ? 'positive' : 'negative',
        title: `${corr_usdinr_nifty > 0 ? 'Positive' : 'Negative'} Correlation: USD-INR & NIFTY 50`,
        description: `The correlation coefficient between USD-INR and NIFTY 50 is ${corr_usdinr_nifty.toFixed(3)}, showing a ${Math.abs(corr_usdinr_nifty) > 0.7 ? 'strong' : 'moderate'} ${corr_usdinr_nifty > 0 ? 'positive' : 'negative'} relationship. ${corr_usdinr_nifty > 0 ? 'Rupee depreciation coincides with market gains.' : 'Rupee depreciation coincides with market declines.'}`,
        value: corr_usdinr_nifty,
      });
    }

    // Insight 3: CPI-USD-INR correlation
    if (Math.abs(corr_cpi_usdinr) > 0.5) {
      generatedInsights.push({
        id: '3',
        type: corr_cpi_usdinr > 0 ? 'neutral' : 'neutral',
        title: `CPI & USD-INR Relationship`,
        description: `Inflation and exchange rate show a correlation of ${corr_cpi_usdinr.toFixed(3)}. ${corr_cpi_usdinr > 0 ? 'Higher inflation tends to be associated with rupee depreciation.' : 'The relationship suggests complex economic dynamics.'}`,
        value: corr_cpi_usdinr,
      });
    }

    // Insight 4: Volatility analysis
    const niftyStd = calculateStd(alignedNifty);
    const niftyMean = alignedNifty.reduce((a, b) => a + b, 0) / alignedNifty.length;
    const cv = (niftyStd / niftyMean) * 100;

    generatedInsights.push({
      id: '4',
      type: cv > 20 ? 'negative' : 'positive',
      title: `Market Volatility: ${cv > 20 ? 'High' : 'Moderate'}`,
      description: `NIFTY 50 shows a coefficient of variation of ${cv.toFixed(2)}%, indicating ${cv > 20 ? 'significant' : 'moderate'} volatility over the period. Mean value: ${niftyMean.toFixed(2)}, Standard deviation: ${niftyStd.toFixed(2)}.`,
      value: cv,
    });

    // Insight 5: Recent trends
    const recentData = alignedNifty.slice(-12);
    const recentTrend = (recentData[recentData.length - 1] - recentData[0]) / recentData[0] * 100;

    generatedInsights.push({
      id: '5',
      type: recentTrend > 0 ? 'positive' : 'negative',
      title: `Recent Market Trend: ${recentTrend > 0 ? 'Upward' : 'Downward'}`,
      description: `Over the last 12 months, NIFTY 50 has ${recentTrend > 0 ? 'gained' : 'lost'} ${Math.abs(recentTrend).toFixed(2)}%. ${recentTrend > 10 ? 'This represents strong positive momentum.' : recentTrend < -10 ? 'This represents significant bearish pressure.' : 'Market shows relatively stable movement.'}`,
      value: recentTrend,
    });

    // Insight 6: Inflation trends
    const cpiMean = alignedCPI.reduce((a, b) => a + b, 0) / alignedCPI.length;
    const recentCPI = alignedCPI.slice(-12).reduce((a, b) => a + b, 0) / 12;
    
    generatedInsights.push({
      id: '6',
      type: recentCPI > cpiMean ? 'negative' : 'positive',
      title: `Inflation Trend Analysis`,
      description: `Recent average CPI (${recentCPI.toFixed(2)}) is ${recentCPI > cpiMean ? 'higher' : 'lower'} than the overall period average (${cpiMean.toFixed(2)}). ${recentCPI > cpiMean ? 'Inflation has been elevated recently.' : 'Inflation has been relatively controlled.'}`,
      value: recentCPI,
    });

    // Insight 7: Exchange rate stability
    const usdinrStd = calculateStd(alignedUSDINR);
    const usdinrMean = alignedUSDINR.reduce((a, b) => a + b, 0) / alignedUSDINR.length;

    generatedInsights.push({
      id: '7',
      type: 'neutral',
      title: `Exchange Rate Dynamics`,
      description: `USD-INR has averaged ${usdinrMean.toFixed(2)} over the period with a standard deviation of ${usdinrStd.toFixed(2)}. ${usdinrStd < 5 ? 'The rupee has shown relative stability.' : 'Notable exchange rate fluctuations observed.'}`,
      value: usdinrMean,
    });

    setInsights(generatedInsights);
  };

  const calculateStd = (values: number[]): number => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(variance);
  };

  // Generate histogram data
  const getHistogramData = () => {
    if (!data) return { highInflation: [], lowInflation: [] };

    const merged = mergeDataByDate(data.cpi, data.usdinr, data.nifty);
    const cpiValues = merged.filter(d => d.cpi !== undefined).map(d => Number(d.cpi));
    const niftyReturns = merged
      .filter((d, i) => i > 0 && d.nifty !== undefined && merged[i - 1].nifty !== undefined)
      .map((d, i) => ((Number(d.nifty) - Number(merged[i].nifty)) / Number(merged[i].nifty)) * 100);

    const cpiMean = cpiValues.reduce((a, b) => a + b, 0) / cpiValues.length;
    const cpiStd = calculateStd(cpiValues);

    const highInflationReturns: number[] = [];
    const lowInflationReturns: number[] = [];

    merged.forEach((d, i) => {
      if (i > 0 && d.cpi !== undefined && d.nifty !== undefined && merged[i - 1].nifty !== undefined) {
        const cpi = Number(d.cpi);
        const returnVal = ((Number(d.nifty) - Number(merged[i - 1].nifty)) / Number(merged[i - 1].nifty)) * 100;
        
        if (cpi > cpiMean + 0.5 * cpiStd) {
          highInflationReturns.push(returnVal);
        } else if (cpi < cpiMean - 0.5 * cpiStd) {
          lowInflationReturns.push(returnVal);
        }
      }
    });

    return { highInflation: highInflationReturns, lowInflation: lowInflationReturns };
  };

  const histogramData = getHistogramData();

  const getInsightIcon = (type: InsightType): string => {
    switch (type) {
      case 'positive': return '✓';
      case 'negative': return '⚠';
      case 'neutral': return 'ℹ';
    }
  };

  const getInsightColor = (type: InsightType): string => {
    switch (type) {
      case 'positive': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'negative': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'neutral': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getTextColor = (type: InsightType): string => {
    switch (type) {
      case 'positive': return 'text-green-900 dark:text-green-200';
      case 'negative': return 'text-red-900 dark:text-red-200';
      case 'neutral': return 'text-blue-900 dark:text-blue-200';
    }
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Insights</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Auto-generated findings and key observations from the data
        </p>
      </div>

      {/* Key Insights */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Findings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))
          ) : (
            insights.map((insight) => (
              <div
                key={insight.id}
                className={`rounded-lg border p-6 ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start">
                  <div className={`text-2xl mr-3 ${getTextColor(insight.type)}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${getTextColor(insight.type)}`}>
                      {insight.title}
                    </h3>
                    <p className={`text-sm ${getTextColor(insight.type).replace('900', '800').replace('200', '300')}`}>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Distribution Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Return Distribution Analysis
        </h2>
        {loading ? (
          <ChartSkeleton />
        ) : (
          <Histogram
            title="NIFTY 50 Monthly Returns: High vs Low Inflation Periods"
            highInflationData={histogramData.highInflation}
            lowInflationData={histogramData.lowInflation}
          />
        )}
        <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> This histogram compares monthly returns during periods of high inflation (CPI {'>'} mean + 0.5×std) 
            versus low inflation (CPI {'<'} mean - 0.5×std). The distribution patterns can reveal whether market performance 
            differs significantly across inflation regimes.
          </p>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          About These Insights
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
          Insights are automatically generated based on statistical analysis of the data including:
        </p>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300 list-disc list-inside">
          <li>Pearson correlation coefficients between variables</li>
          <li>Volatility measurements (standard deviation and coefficient of variation)</li>
          <li>Trend analysis using recent data windows</li>
          <li>Comparison of recent values against historical averages</li>
        </ul>
        <p className="text-sm text-blue-800 dark:text-blue-300 mt-3">
          These insights are for educational purposes only and should not be used for investment decisions.
        </p>
      </div>
    </div>
  );
}
