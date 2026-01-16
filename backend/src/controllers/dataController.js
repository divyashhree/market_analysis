const dataService = require('../services/dataService');

/**
 * Data Controller - Handles HTTP requests for economic data
 */
class DataController {
  /**
   * GET /api/data/all
   * Get all economic data (CPI, USD-INR, NIFTY 50)
   */
  async getAllData(req, res, next) {
    try {
      const data = await dataService.getAllData();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/cpi
   * Get CPI data only
   */
  async getCPIData(req, res, next) {
    try {
      const data = await dataService.fetchCPIData();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/usdinr
   * Get USD-INR exchange rate data
   */
  async getUSDINRData(req, res, next) {
    try {
      const data = await dataService.fetchUSDINRData();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/nifty
   * Get NIFTY 50 index data
   */
  async getNiftyData(req, res, next) {
    try {
      const data = await dataService.fetchNiftyData();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/range?start=YYYY-MM-DD&end=YYYY-MM-DD
   * Get data filtered by date range
   */
  async getDataByRange(req, res, next) {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Both start and end dates are required'
        });
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(start) || !dateRegex.test(end)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Dates must be in YYYY-MM-DD format'
        });
      }

      const data = await dataService.getDataByRange(start, end);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/stocks/search/:query
   * Search for stocks by symbol or name
   */
  async searchStocks(req, res, next) {
    try {
      const { query } = req.params;
      const results = await dataService.searchStocks(query);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/stocks/:symbol
   * Get historical and current data for a specific stock
   */
  async getStockData(req, res, next) {
    try {
      const { symbol } = req.params;
      const { period } = req.query; // e.g., '1y', '6m', 'max'
      const data = await dataService.fetchStockData(symbol.toUpperCase(), period);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DataController();
