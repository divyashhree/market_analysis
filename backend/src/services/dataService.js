const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const { Readable } = require('stream');
const axios = require('axios');
const cacheService = require('./cacheService');

/**
 * Data Service - Handles fetching and parsing of economic data
 */
class DataService {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
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

        cacheService.set(cacheKey, data);
        return data;
      }
    } catch (error) {
      console.log('Yahoo Finance API failed, falling back to CSV');
    }

    // Fallback to CSV
    return await this.readCSV('nifty_data.csv');
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

        cacheService.set(cacheKey, data);
        return data;
      }
    } catch (error) {
      console.log('Yahoo Finance API failed, falling back to CSV');
    }

    // Fallback to CSV
    return await this.readCSV('usdinr_data.csv');
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
      const url = 'https://api.worldbank.org/v2/country/IND/indicator/FP.CPI.TOTL?format=json&date=2014:2024&per_page=200';
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
          cacheService.set(cacheKey, data);
          return data;
        }
      }
    } catch (error) {
      console.log('World Bank API failed, falling back to CSV');
    }

    // Fallback to CSV
    return await this.readCSV('cpi_data.csv');
  }

  /**
   * Get all data (CPI, USD-INR, NIFTY)
   */
  async getAllData() {
    const [cpi, usdinr, nifty] = await Promise.all([
      this.fetchCPIData(),
      this.fetchUSDINRData(),
      this.fetchNiftyData()
    ]);

    return { cpi, usdinr, nifty };
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
}

module.exports = new DataService();
