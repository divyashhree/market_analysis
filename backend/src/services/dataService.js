const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const { Readable } = require('stream');
const axios = require('axios');
const cacheService = require('./cacheService');
const { getAllStocks, getStock } = require('../config/stocks');

/**
 * Data Service - Handles fetching and parsing of economic data
 */
class DataService {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
  }

  /**
   * Add metadata about data freshness and source
   */
  addFreshnessMetadata(data, source, status = 'live') {
    if (!data || data.length === 0) {
      return {
        data: [],
        metadata: {
          source: 'none',
          status: 'error',
          warning: 'No data available'
        }
      };
    }

    const latestDate = new Date(data[data.length - 1].date);
    const daysSinceUpdate = Math.floor((Date.now() - latestDate) / (1000 * 60 * 60 * 24));
    const isStale = daysSinceUpdate > 60; // Flag if data is older than 60 days
    
    return {
      data,
      metadata: {
        source: source, // 'api' or 'csv'
        status: status, // 'live', 'cached', 'stale'
        lastUpdate: latestDate.toISOString(),
        lastUpdateFormatted: latestDate.toLocaleDateString(),
        daysSinceUpdate,
        isStale,
        warning: isStale ? `⚠️ Data is ${daysSinceUpdate} days old. Real-time API may be unavailable. For educational purposes only.` : null,
        dataPoints: data.length
      }
    };
  }

  /**
   * Read CSV file and return parsed data
   */
  async readCSV(filename) {
    const filePath = path.join(this.dataDir, filename);
    const results = [];

    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      return new Promise((resolve, reject) => {
        const stream = Readable.from(fileContent);
        stream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
    } catch (error) {
      console.error(`Error reading CSV file ${filename}:`, error);
      throw new Error(`Failed to read ${filename}`);
    }
  }

  /**
   * Fetch NIFTY 50 data from Yahoo Finance API
   */
  async fetchNiftyData() {
    const cacheKey = 'nifty_data';
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      // Try Yahoo Finance API
      const url = 'https://query1.finance.yahoo.com/v8/finance/chart/^NSEI?interval=1mo&range=10y';
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.chart && response.data.chart.result) {
        const result = response.data.chart.result[0];
        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];
        
        const data = timestamps.map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          value: quotes.close[index] || quotes.open[index] || 0
        })).filter(item => item.value > 0);

        const result_with_metadata = this.addFreshnessMetadata(data, 'api', 'live');
        cacheService.set(cacheKey, result_with_metadata);
        return result_with_metadata;
      }
    } catch (error) {
      console.warn('⚠️ Yahoo Finance API failed, falling back to CSV:', error.message);
    }

    // Fallback to CSV with warning
    console.log('📁 Using fallback CSV data for NIFTY 50');
    const csvData = await this.readCSV('nifty_data.csv');
    return this.addFreshnessMetadata(csvData, 'csv', 'fallback');
  }

  /**
   * Fetch USD-INR data from Yahoo Finance API
   */
  async fetchUSDINRData() {
    const cacheKey = 'usdinr_data';
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      // Try Yahoo Finance API
      const url = 'https://query1.finance.yahoo.com/v8/finance/chart/INR=X?interval=1mo&range=10y';
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.chart && response.data.chart.result) {
        const result = response.data.chart.result[0];
        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];
        
        const data = timestamps.map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          value: quotes.close[index] || quotes.open[index] || 0
        })).filter(item => item.value > 0);

        const result_with_metadata = this.addFreshnessMetadata(data, 'api', 'live');
        cacheService.set(cacheKey, result_with_metadata);
        return result_with_metadata;
      }
    } catch (error) {
      console.warn('⚠️ Yahoo Finance API failed, falling back to CSV:', error.message);
    }

    // Fallback to CSV with warning
    console.log('📁 Using fallback CSV data for USD-INR');
    const csvData = await this.readCSV('usdinr_data.csv');
    return this.addFreshnessMetadata(csvData, 'csv', 'fallback');
  }

  /**
   * Fetch CPI data from World Bank API
   */
  async fetchCPIData() {
    const cacheKey = 'cpi_data';
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      // Try World Bank API
      const url = 'https://api.worldbank.org/v2/country/IND/indicator/FP.CPI.TOTL?format=json&date=2014:2026&per_page=200';
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && Array.isArray(response.data) && response.data[1]) {
        const data = response.data[1]
          .filter(item => item.value !== null)
          .map(item => ({
            date: `${item.date}-01-01`,
            value: parseFloat(item.value)
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        if (data.length > 0) {
          const result_with_metadata = this.addFreshnessMetadata(data, 'api', 'live');
          cacheService.set(cacheKey, result_with_metadata);
          return result_with_metadata;
        }
      }
    } catch (error) {
      console.warn('⚠️ World Bank API failed, falling back to CSV:', error.message);
    }

    // Fallback to CSV with warning
    console.log('📁 Using fallback CSV data for CPI');
    const csvData = await this.readCSV('cpi_data.csv');
    return this.addFreshnessMetadata(csvData, 'csv', 'fallback');
  }

  /**
   * Get all data (CPI, USD-INR, NIFTY)
   */
  async getAllData() {
    const cacheKey = 'all_data';
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const [cpiResult, usdinrResult, niftyResult] = await Promise.all([
      this.fetchCPIData(),
      this.fetchUSDINRData(),
      this.fetchNiftyData(),
    ]);
    
    const combinedData = {
      cpi: cpiResult.data || cpiResult,
      usdinr: usdinrResult.data || usdinrResult,
      nifty: niftyResult.data || niftyResult,
      metadata: {
        cpi: cpiResult.metadata,
        usdinr: usdinrResult.metadata,
        nifty: niftyResult.metadata,
        hasStaleData: cpiResult.metadata?.isStale || usdinrResult.metadata?.isStale || niftyResult.metadata?.isStale,
        hasFallbackData: cpiResult.metadata?.source === 'csv' || usdinrResult.metadata?.source === 'csv' || niftyResult.metadata?.source === 'csv'
      }
    };

    cacheService.set(cacheKey, combinedData);
    return combinedData;
  }

  /**
   * Filter data by date range
   */
  filterByDateRange(data, startDate, endDate) {
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    });
  }

  /**
   * Get data for specific date range
   */
  async getDataByRange(startDate, endDate) {
    const allData = await this.getAllData();
    
    return {
      cpi: this.filterByDateRange(allData.cpi, startDate, endDate),
      usdinr: this.filterByDateRange(allData.usdinr, startDate, endDate),
      nifty: this.filterByDateRange(allData.nifty, startDate, endDate),
    };
  }

  /**
   * Search for stocks by symbol or name.
   * @param {string} query - The search query.
   * @returns {Promise<Array>} - A list of matching stocks.
   */
  async searchStocks(query) {
    const lowerCaseQuery = query.toLowerCase();
    const allStocks = getAllStocks();

    const results = allStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(lowerCaseQuery) ||
      stock.name.toLowerCase().includes(lowerCaseQuery)
    );

    return results.slice(0, 15); // Return top 15 matches
  }

  /**
   * Fetches detailed data for a specific stock symbol from Yahoo Finance.
   * @param {string} symbol - The stock symbol (e.g., 'AAPL').
   * @param {string} [period='1y'] - The time period (e.g., '1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max').
   * @returns {Promise<Object>} - The stock data including profile and historical prices.
   */
  async fetchStockData(symbol, period = '1y') {
    const cacheKey = `stock_${symbol}_${period}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const stockInfo = getStock(symbol);
      if (!stockInfo) {
        throw new Error(`Stock with symbol ${symbol} not found in config.`);
      }

      // Fetch historical data
      const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${period}&interval=1d`;
      const chartResponse = await axios.get(chartUrl, { timeout: 10000 });

      let historicalData = [];
      if (chartResponse.data?.chart?.result?.[0]) {
        const result = chartResponse.data.chart.result[0];
        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];
        historicalData = timestamps.map((ts, i) => ({
          date: new Date(ts * 1000).toISOString().split('T')[0],
          open: quotes.open[i],
          high: quotes.high[i],
          low: quotes.low[i],
          close: quotes.close[i],
          volume: quotes.volume[i],
        })).filter(d => d.close !== null);
      }

      // Fetch quote summary for profile data
      const summaryUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price,summaryProfile,financialData,defaultKeyStatistics`;
      const summaryResponse = await axios.get(summaryUrl, { timeout: 10000 });
      
      const summary = summaryResponse.data?.quoteSummary?.result?.[0] || {};
      
      const profile = {
        ...stockInfo,
        currentPrice: summary.price?.regularMarketPrice?.raw,
        marketOpen: summary.price?.regularMarketOpen?.raw,
        dayHigh: summary.price?.regularMarketDayHigh?.raw,
        dayLow: summary.price?.regularMarketDayLow?.raw,
        previousClose: summary.price?.regularMarketPreviousClose?.raw,
        volume: summary.price?.regularMarketVolume?.raw,
        marketCap: summary.price?.marketCap?.raw,
        fiftyTwoWeekHigh: summary.summaryDetail?.fiftyTwoWeekHigh?.raw,
        fiftyTwoWeekLow: summary.summaryDetail?.fiftyTwoWeekLow?.raw,
        forwardPE: summary.summaryDetail?.forwardPE?.raw,
        dividendYield: summary.summaryDetail?.dividendYield?.raw,
        beta: summary.summaryDetail?.beta?.raw,
        longBusinessSummary: summary.summaryProfile?.longBusinessSummary,
        website: summary.summaryProfile?.website,
        sector: summary.summaryProfile?.sector,
        industry: summary.summaryProfile?.industry,
        fullTimeEmployees: summary.summaryProfile?.fullTimeEmployees,
        targetMeanPrice: summary.financialData?.targetMeanPrice?.raw,
        recommendationKey: summary.financialData?.recommendationKey,
      };

      const data = {
        profile,
        historicalData,
      };

      cacheService.set(cacheKey, data, 300); // Cache for 5 minutes
      return data;

    } catch (error) {
      console.error(`Failed to fetch data for stock ${symbol}:`, error.message);
      if (error.response) {
        console.error('Response Status:', error.response.status);
      }
      throw new Error(`Could not fetch data for ${symbol}. The stock may be delisted or the symbol invalid.`);
    }
  }
}

module.exports = new DataService();
