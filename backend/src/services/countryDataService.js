const axios = require('axios');
const cacheService = require('./cacheService');
const { countries, getCountry, WORLD_BANK_INDICATORS } = require('../config/countries');

/**
 * Multi-Country Data Service
 * Fetches economic data from official sources for 30+ countries
 * 
 * Data Sources:
 * - World Bank API: CPI, Inflation, GDP data
 * - Yahoo Finance: Stock indices, Exchange rates
 */
class CountryDataService {
  constructor() {
    this.timeout = 15000;
    this.yearRange = '2010:2025';
  }

  /**
   * Fetch CPI/Inflation data from World Bank API
   * Official source: https://data.worldbank.org/
   */
  async fetchWorldBankData(countryCode, indicator = 'FP.CPI.TOTL') {
    const country = getCountry(countryCode);
    if (!country) throw new Error(`Country not found: ${countryCode}`);

    const cacheKey = `wb_${countryCode}_${indicator}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://api.worldbank.org/v2/country/${country.worldBankCode}/indicator/${indicator}?format=json&date=${this.yearRange}&per_page=100`;
      const response = await axios.get(url, { timeout: this.timeout });

      if (response.data && Array.isArray(response.data) && response.data[1]) {
        const data = response.data[1]
          .filter(item => item.value !== null)
          .map(item => ({
            date: `${item.date}-01-01`,
            value: parseFloat(item.value),
            country: countryCode,
            countryName: country.name,
            indicator: indicator
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        if (data.length > 0) {
          cacheService.set(cacheKey, data, 86400); // Cache for 24 hours
          return data;
        }
      }
      return [];
    } catch (error) {
      console.error(`World Bank API error for ${countryCode}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch stock index data from Yahoo Finance
   */
  async fetchStockIndex(countryCode) {
    const country = getCountry(countryCode);
    if (!country || !country.stockIndex.yahooSymbol) {
      return [];
    }

    const cacheKey = `stock_${countryCode}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const symbol = encodeURIComponent(country.stockIndex.yahooSymbol);
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1mo&range=10y`;
      
      const response = await axios.get(url, { 
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data?.chart?.result?.[0]) {
        const result = response.data.chart.result[0];
        const timestamps = result.timestamp || [];
        const quotes = result.indicators?.quote?.[0] || {};

        const data = timestamps.map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          value: quotes.close?.[index] || quotes.open?.[index] || 0,
          country: countryCode,
          countryName: country.name,
          indexName: country.stockIndex.name
        })).filter(item => item.value > 0);

        if (data.length > 0) {
          cacheService.set(cacheKey, data, 3600); // Cache for 1 hour
          return data;
        }
      }
      return [];
    } catch (error) {
      console.error(`Yahoo Finance error for ${countryCode} stock:`, error.message);
      return [];
    }
  }

  /**
   * Fetch currency exchange rate from Yahoo Finance
   */
  async fetchExchangeRate(countryCode) {
    const country = getCountry(countryCode);
    if (!country || !country.exchangeRate.yahooSymbol) {
      // US Dollar is the base, return 1
      if (countryCode === 'US') {
        const data = [{
          date: new Date().toISOString().split('T')[0],
          value: 1,
          country: 'US',
          countryName: 'United States',
          pair: 'USDUSD'
        }];
        return data;
      }
      return [];
    }

    const cacheKey = `fx_${countryCode}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const symbol = encodeURIComponent(country.exchangeRate.yahooSymbol);
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1mo&range=10y`;
      
      const response = await axios.get(url, { 
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data?.chart?.result?.[0]) {
        const result = response.data.chart.result[0];
        const timestamps = result.timestamp || [];
        const quotes = result.indicators?.quote?.[0] || {};

        const data = timestamps.map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          value: quotes.close?.[index] || quotes.open?.[index] || 0,
          country: countryCode,
          countryName: country.name,
          pair: country.exchangeRate.pair
        })).filter(item => item.value > 0);

        if (data.length > 0) {
          cacheService.set(cacheKey, data, 3600); // Cache for 1 hour
          return data;
        }
      }
      return [];
    } catch (error) {
      console.error(`Yahoo Finance error for ${countryCode} FX:`, error.message);
      return [];
    }
  }

  /**
   * Get comprehensive data for a single country
   */
  async getCountryData(countryCode) {
    const country = getCountry(countryCode);
    if (!country) throw new Error(`Country not found: ${countryCode}`);

    const [cpi, inflation, gdpGrowth, stockIndex, exchangeRate] = await Promise.all([
      this.fetchWorldBankData(countryCode, WORLD_BANK_INDICATORS.CPI),
      this.fetchWorldBankData(countryCode, WORLD_BANK_INDICATORS.INFLATION),
      this.fetchWorldBankData(countryCode, WORLD_BANK_INDICATORS.GDP_GROWTH),
      this.fetchStockIndex(countryCode),
      this.fetchExchangeRate(countryCode)
    ]);

    return {
      country: {
        code: country.code,
        name: country.name,
        flag: country.flag,
        region: country.region,
        currency: country.currency,
        stockIndex: country.stockIndex,
        gdpRank: country.gdpRank
      },
      data: {
        cpi,
        inflation,
        gdpGrowth,
        stockIndex,
        exchangeRate
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        sources: ['World Bank API', 'Yahoo Finance']
      }
    };
  }

  /**
   * Get data for multiple countries (for comparison)
   */
  async getMultipleCountriesData(countryCodes, dataType = 'all') {
    const results = {};

    await Promise.all(
      countryCodes.map(async (code) => {
        try {
          if (dataType === 'all') {
            results[code] = await this.getCountryData(code);
          } else if (dataType === 'inflation') {
            const country = getCountry(code);
            results[code] = {
              country: { code, name: country?.name, flag: country?.flag },
              data: await this.fetchWorldBankData(code, WORLD_BANK_INDICATORS.INFLATION)
            };
          } else if (dataType === 'cpi') {
            const country = getCountry(code);
            results[code] = {
              country: { code, name: country?.name, flag: country?.flag },
              data: await this.fetchWorldBankData(code, WORLD_BANK_INDICATORS.CPI)
            };
          } else if (dataType === 'stock') {
            const country = getCountry(code);
            results[code] = {
              country: { code, name: country?.name, flag: country?.flag },
              data: await this.fetchStockIndex(code)
            };
          } else if (dataType === 'fx') {
            const country = getCountry(code);
            results[code] = {
              country: { code, name: country?.name, flag: country?.flag },
              data: await this.fetchExchangeRate(code)
            };
          } else if (dataType === 'gdp') {
            const country = getCountry(code);
            results[code] = {
              country: { code, name: country?.name, flag: country?.flag },
              data: await this.fetchWorldBankData(code, WORLD_BANK_INDICATORS.GDP_GROWTH)
            };
          }
        } catch (error) {
          console.error(`Error fetching data for ${code}:`, error.message);
          results[code] = { error: error.message };
        }
      })
    );

    return results;
  }

  /**
   * Get global inflation comparison for all available countries
   */
  async getGlobalInflationData() {
    const cacheKey = 'global_inflation';
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const countryCodes = Object.keys(countries);
    const results = [];

    await Promise.all(
      countryCodes.map(async (code) => {
        try {
          const data = await this.fetchWorldBankData(code, WORLD_BANK_INDICATORS.INFLATION);
          if (data.length > 0) {
            const country = getCountry(code);
            const latestYear = data[data.length - 1];
            results.push({
              code,
              name: country.name,
              flag: country.flag,
              region: country.region,
              latestInflation: latestYear?.value || null,
              latestYear: latestYear?.date?.split('-')[0] || null,
              historicalData: data
            });
          }
        } catch (error) {
          console.error(`Error fetching inflation for ${code}:`, error.message);
        }
      })
    );

    // Sort by inflation rate
    results.sort((a, b) => (b.latestInflation || 0) - (a.latestInflation || 0));
    
    cacheService.set(cacheKey, results, 86400); // Cache for 24 hours
    return results;
  }

  /**
   * Get global stock market performance comparison
   */
  async getGlobalStockPerformance() {
    const cacheKey = 'global_stocks';
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const countryCodes = Object.keys(countries);
    const results = [];

    await Promise.all(
      countryCodes.map(async (code) => {
        try {
          const data = await this.fetchStockIndex(code);
          if (data.length > 2) {
            const country = getCountry(code);
            const latest = data[data.length - 1];
            const previous = data[data.length - 2];
            const oneYearAgo = data[Math.max(0, data.length - 13)];
            const yearStart = data[0];
            
            const ytdReturn = latest && yearStart ? 
              ((latest.value - yearStart.value) / yearStart.value * 100) : null;
            const oneYearReturn = latest && oneYearAgo ?
              ((latest.value - oneYearAgo.value) / oneYearAgo.value * 100) : null;
            
            // Calculate latest change (month-over-month)
            const latestChange = latest && previous ?
              ((latest.value - previous.value) / previous.value * 100) : 0;

            results.push({
              code,
              name: country.name,
              flag: country.flag,
              region: country.region,
              indexName: country.stockIndex.name,
              latestValue: latest?.value || null,
              latestChange: parseFloat(latestChange.toFixed(2)),
              ytdReturn,
              oneYearReturn,
              historicalData: data
            });
          }
        } catch (error) {
          console.error(`Error fetching stock for ${code}:`, error.message);
        }
      })
    );

    // Sort by YTD return
    results.sort((a, b) => (b.ytdReturn || -999) - (a.ytdReturn || -999));
    
    cacheService.set(cacheKey, results, 3600); // Cache for 1 hour
    return results;
  }

  /**
   * Get currency strength comparison
   */
  async getGlobalCurrencyData() {
    const cacheKey = 'global_fx';
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const countryCodes = Object.keys(countries);
    const results = [];

    await Promise.all(
      countryCodes.map(async (code) => {
        try {
          const data = await this.fetchExchangeRate(code);
          if (data.length > 2) {
            const country = getCountry(code);
            const latest = data[data.length - 1];
            const oneYearAgo = data[Math.max(0, data.length - 13)];
            
            const yearChange = latest && oneYearAgo ?
              ((latest.value - oneYearAgo.value) / oneYearAgo.value * 100) : null;

            results.push({
              code,
              name: country.name,
              flag: country.flag,
              currency: country.currency,
              latestRate: latest?.value || null,
              yearChange, // Positive = currency weakened vs USD
              historicalData: data
            });
          }
        } catch (error) {
          console.error(`Error fetching FX for ${code}:`, error.message);
        }
      })
    );

    // Sort by year change
    results.sort((a, b) => (a.yearChange || 0) - (b.yearChange || 0));
    
    cacheService.set(cacheKey, results, 3600); // Cache for 1 hour
    return results;
  }

  /**
   * Get regional comparison data
   */
  async getRegionalComparison(region) {
    const countryCodes = Object.keys(countries).filter(code => 
      countries[code].region === region
    );

    return this.getMultipleCountriesData(countryCodes);
  }

  /**
   * Get top economies data (by GDP rank)
   */
  async getTopEconomiesData(limit = 20) {
    const sortedCountries = Object.values(countries)
      .sort((a, b) => a.gdpRank - b.gdpRank)
      .slice(0, limit);

    const countryCodes = sortedCountries.map(c => c.code);
    return this.getMultipleCountriesData(countryCodes);
  }

  /**
   * Get all available countries with metadata
   */
  getAllCountries() {
    return Object.values(countries).map(country => ({
      code: country.code,
      name: country.name,
      flag: country.flag,
      region: country.region,
      currency: country.currency,
      stockIndex: {
        name: country.stockIndex.name,
        description: country.stockIndex.description
      },
      gdpRank: country.gdpRank
    }));
  }

  /**
   * Get available regions
   */
  getRegions() {
    const regions = new Set(Object.values(countries).map(c => c.region));
    return Array.from(regions).sort();
  }
}

module.exports = new CountryDataService();
