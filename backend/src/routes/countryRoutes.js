const express = require('express');
const router = express.Router();
const countryDataService = require('../services/countryDataService');
const { getCountriesByRegion, getCountryCodes, getCountry, getCountriesByGDP } = require('../config/countries');

/**
 * @route GET /api/countries
 * @desc Get all available countries with metadata
 */
router.get('/', async (req, res) => {
  try {
    const countries = countryDataService.getAllCountries();
    res.json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/regions
 * @desc Get all available regions
 */
router.get('/regions', async (req, res) => {
  try {
    const regions = countryDataService.getRegions();
    const byRegion = getCountriesByRegion();
    res.json({
      success: true,
      data: {
        regions,
        countriesByRegion: byRegion
      }
    });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/top-economies
 * @desc Get top economies by GDP
 */
router.get('/top-economies', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const data = await countryDataService.getTopEconomiesData(limit);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching top economies:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/global/inflation
 * @desc Get global inflation comparison for all countries
 */
router.get('/global/inflation', async (req, res) => {
  try {
    const data = await countryDataService.getGlobalInflationData();
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Error fetching global inflation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/global/stocks
 * @desc Get global stock market performance comparison
 */
router.get('/global/stocks', async (req, res) => {
  try {
    const data = await countryDataService.getGlobalStockPerformance();
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Error fetching global stocks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/global/currencies
 * @desc Get global currency strength comparison
 */
router.get('/global/currencies', async (req, res) => {
  try {
    const data = await countryDataService.getGlobalCurrencyData();
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Error fetching global currencies:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/compare
 * @desc Compare multiple countries
 * @query countries - Comma-separated country codes (e.g., US,GB,DE,JP)
 * @query type - Data type: all, inflation, cpi, stock, fx, gdp
 */
router.get('/compare', async (req, res) => {
  try {
    const { countries: countriesParam, type = 'all' } = req.query;
    
    if (!countriesParam) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide country codes (e.g., ?countries=US,GB,DE,JP)' 
      });
    }

    const countryCodes = countriesParam.split(',').map(c => c.trim().toUpperCase());
    
    // Validate country codes
    const validCodes = getCountryCodes();
    const invalidCodes = countryCodes.filter(c => !validCodes.includes(c));
    if (invalidCodes.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid country codes: ${invalidCodes.join(', ')}`,
        validCodes
      });
    }

    const data = await countryDataService.getMultipleCountriesData(countryCodes, type);
    res.json({
      success: true,
      countries: countryCodes,
      dataType: type,
      data
    });
  } catch (error) {
    console.error('Error comparing countries:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/region/:region
 * @desc Get comparison data for countries in a specific region
 */
router.get('/region/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const validRegions = countryDataService.getRegions();
    
    if (!validRegions.includes(region)) {
      return res.status(400).json({
        success: false,
        error: `Invalid region: ${region}`,
        validRegions
      });
    }

    const data = await countryDataService.getRegionalComparison(region);
    res.json({
      success: true,
      region,
      data
    });
  } catch (error) {
    console.error('Error fetching regional data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/:code
 * @desc Get comprehensive data for a single country
 */
router.get('/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const country = getCountry(code);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: `Country not found: ${code}`,
        availableCodes: getCountryCodes()
      });
    }

    const data = await countryDataService.getCountryData(code);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching country data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/:code/inflation
 * @desc Get inflation data for a specific country
 */
router.get('/:code/inflation', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const country = getCountry(code);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: `Country not found: ${code}`
      });
    }

    const data = await countryDataService.fetchWorldBankData(code, 'FP.CPI.TOTL.ZG');
    res.json({
      success: true,
      country: {
        code: country.code,
        name: country.name,
        flag: country.flag
      },
      data
    });
  } catch (error) {
    console.error('Error fetching inflation data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/:code/stock
 * @desc Get stock index data for a specific country
 */
router.get('/:code/stock', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const country = getCountry(code);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: `Country not found: ${code}`
      });
    }

    const data = await countryDataService.fetchStockIndex(code);
    res.json({
      success: true,
      country: {
        code: country.code,
        name: country.name,
        flag: country.flag,
        stockIndex: country.stockIndex
      },
      data
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/countries/:code/currency
 * @desc Get exchange rate data for a specific country
 */
router.get('/:code/currency', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const country = getCountry(code);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: `Country not found: ${code}`
      });
    }

    const data = await countryDataService.fetchExchangeRate(code);
    res.json({
      success: true,
      country: {
        code: country.code,
        name: country.name,
        flag: country.flag,
        currency: country.currency
      },
      data
    });
  } catch (error) {
    console.error('Error fetching currency data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
