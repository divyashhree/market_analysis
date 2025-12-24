const dataService = require('./dataService');

/**
 * Analysis Service - Performs statistical analysis on economic data
 */
class AnalysisService {
  /**
   * Calculate Pearson correlation coefficient
   */
  calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return numerator / denominator;
  }

  /**
   * Calculate basic statistics
   */
  calculateStatistics(values) {
    if (!values || values.length === 0) {
      return { mean: 0, std: 0, min: 0, max: 0, median: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(variance);

    return { mean, std, min, max, median };
  }

  /**
   * Align datasets by common dates
   */
  alignDatasets(datasets) {
    const dateMap = new Map();

    datasets.forEach((dataset, index) => {
      dataset.forEach(item => {
        if (!dateMap.has(item.date)) {
          dateMap.set(item.date, {});
        }
        dateMap.get(item.date)[`value${index}`] = parseFloat(item.value);
      });
    });

    // Filter to only include dates with all values
    const aligned = [];
    dateMap.forEach((values, date) => {
      if (Object.keys(values).length === datasets.length) {
        aligned.push({ date, ...values });
      }
    });

    aligned.sort((a, b) => a.date.localeCompare(b.date));
    return aligned;
  }

  /**
   * Calculate all correlations
   */
  async getCorrelations() {
    const data = await dataService.getAllData();
    const aligned = this.alignDatasets([data.cpi, data.usdinr, data.nifty]);

    const cpiValues = aligned.map(d => d.value0);
    const usdinrValues = aligned.map(d => d.value1);
    const niftyValues = aligned.map(d => d.value2);

    return {
      cpi_usdinr: this.calculateCorrelation(cpiValues, usdinrValues),
      cpi_nifty: this.calculateCorrelation(cpiValues, niftyValues),
      usdinr_nifty: this.calculateCorrelation(usdinrValues, niftyValues),
    };
  }

  /**
   * Calculate rolling correlation
   */
  calculateRollingCorrelation(x, y, window = 12) {
    const result = [];
    
    for (let i = window - 1; i < x.length; i++) {
      const xWindow = x.slice(i - window + 1, i + 1);
      const yWindow = y.slice(i - window + 1, i + 1);
      const correlation = this.calculateCorrelation(xWindow, yWindow);
      result.push(correlation);
    }
    
    return result;
  }

  /**
   * Generate automated insights
   */
  async generateInsights() {
    const data = await dataService.getAllData();
    const aligned = this.alignDatasets([data.cpi, data.usdinr, data.nifty]);
    
    const cpiValues = aligned.map(d => d.value0);
    const usdinrValues = aligned.map(d => d.value1);
    const niftyValues = aligned.map(d => d.value2);

    const insights = [];

    // Correlation insights
    const correlations = await this.getCorrelations();
    
    if (Math.abs(correlations.cpi_nifty) > 0.5) {
      insights.push({
        type: correlations.cpi_nifty > 0 ? 'positive' : 'negative',
        title: `${correlations.cpi_nifty > 0 ? 'Positive' : 'Negative'} CPI-NIFTY Correlation`,
        description: `Strong ${correlations.cpi_nifty > 0 ? 'positive' : 'negative'} correlation (${correlations.cpi_nifty.toFixed(3)}) between inflation and market performance.`,
        value: correlations.cpi_nifty
      });
    }

    // Volatility insights
    const niftyStats = this.calculateStatistics(niftyValues);
    const cv = (niftyStats.std / niftyStats.mean) * 100;
    
    insights.push({
      type: cv > 20 ? 'negative' : 'positive',
      title: `Market Volatility: ${cv > 20 ? 'High' : 'Moderate'}`,
      description: `Coefficient of variation is ${cv.toFixed(2)}%, indicating ${cv > 20 ? 'significant' : 'moderate'} market volatility.`,
      value: cv
    });

    // Trend insights
    const recentNifty = niftyValues.slice(-12);
    const recentTrend = ((recentNifty[recentNifty.length - 1] - recentNifty[0]) / recentNifty[0]) * 100;
    
    insights.push({
      type: recentTrend > 0 ? 'positive' : 'negative',
      title: `Recent Market Trend: ${recentTrend > 0 ? 'Upward' : 'Downward'}`,
      description: `NIFTY 50 has ${recentTrend > 0 ? 'gained' : 'lost'} ${Math.abs(recentTrend).toFixed(2)}% in the last 12 months.`,
      value: recentTrend
    });

    return insights;
  }

  /**
   * Get comprehensive analysis
   */
  async getFullAnalysis() {
    const data = await dataService.getAllData();
    const aligned = this.alignDatasets([data.cpi, data.usdinr, data.nifty]);
    
    const cpiValues = aligned.map(d => d.value0);
    const usdinrValues = aligned.map(d => d.value1);
    const niftyValues = aligned.map(d => d.value2);

    const correlations = await this.getCorrelations();
    const insights = await this.generateInsights();

    // Calculate rolling correlations
    const rollingCorr = [];
    const window = 12;
    
    for (let i = window - 1; i < aligned.length; i++) {
      const xCPI = cpiValues.slice(i - window + 1, i + 1);
      const xUSDINR = usdinrValues.slice(i - window + 1, i + 1);
      const xNifty = niftyValues.slice(i - window + 1, i + 1);
      
      rollingCorr.push({
        date: aligned[i].date,
        cpi_nifty: this.calculateCorrelation(xCPI, xNifty),
        usdinr_nifty: this.calculateCorrelation(xUSDINR, xNifty),
        cpi_usdinr: this.calculateCorrelation(xCPI, xUSDINR),
      });
    }

    return {
      correlations,
      statistics: {
        cpi: this.calculateStatistics(cpiValues),
        usdinr: this.calculateStatistics(usdinrValues),
        nifty: this.calculateStatistics(niftyValues),
      },
      rollingCorrelations: rollingCorr,
      insights,
    };
  }

  /**
   * Compare two time periods
   */
  async comparePeriods(period1Start, period1End, period2Start, period2End) {
    const period1Data = await dataService.getDataByRange(period1Start, period1End);
    const period2Data = await dataService.getDataByRange(period2Start, period2End);

    const aligned1 = this.alignDatasets([period1Data.cpi, period1Data.usdinr, period1Data.nifty]);
    const aligned2 = this.alignDatasets([period2Data.cpi, period2Data.usdinr, period2Data.nifty]);

    const period1Stats = {
      cpi: this.calculateStatistics(aligned1.map(d => d.value0)),
      usdinr: this.calculateStatistics(aligned1.map(d => d.value1)),
      nifty: this.calculateStatistics(aligned1.map(d => d.value2)),
    };

    const period2Stats = {
      cpi: this.calculateStatistics(aligned2.map(d => d.value0)),
      usdinr: this.calculateStatistics(aligned2.map(d => d.value1)),
      nifty: this.calculateStatistics(aligned2.map(d => d.value2)),
    };

    return {
      period1: {
        start: period1Start,
        end: period1End,
        stats: period1Stats,
        correlations: {
          cpi_usdinr: this.calculateCorrelation(aligned1.map(d => d.value0), aligned1.map(d => d.value1)),
          cpi_nifty: this.calculateCorrelation(aligned1.map(d => d.value0), aligned1.map(d => d.value2)),
          usdinr_nifty: this.calculateCorrelation(aligned1.map(d => d.value1), aligned1.map(d => d.value2)),
        }
      },
      period2: {
        start: period2Start,
        end: period2End,
        stats: period2Stats,
        correlations: {
          cpi_usdinr: this.calculateCorrelation(aligned2.map(d => d.value0), aligned2.map(d => d.value1)),
          cpi_nifty: this.calculateCorrelation(aligned2.map(d => d.value0), aligned2.map(d => d.value2)),
          usdinr_nifty: this.calculateCorrelation(aligned2.map(d => d.value1), aligned2.map(d => d.value2)),
        }
      }
    };
  }
}

module.exports = new AnalysisService();
