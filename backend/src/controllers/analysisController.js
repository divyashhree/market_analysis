const analysisService = require('../services/analysisService');

/**
 * Analysis Controller - Handles HTTP requests for data analysis
 */
class AnalysisController {
  /**
   * GET /api/analysis/correlations
   * Get correlation coefficients between all variables
   */
  async getCorrelations(req, res, next) {
    try {
      const correlations = await analysisService.getCorrelations();
      res.json(correlations);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analysis/insights
   * Get auto-generated insights
   */
  async getInsights(req, res, next) {
    try {
      const insights = await analysisService.generateInsights();
      res.json(insights);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analysis/full
   * Get comprehensive analysis including correlations, statistics, and insights
   */
  async getFullAnalysis(req, res, next) {
    try {
      const analysis = await analysisService.getFullAnalysis();
      res.json(analysis);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analysis/compare?period1Start=...&period1End=...&period2Start=...&period2End=...
   * Compare statistics and correlations between two time periods
   */
  async comparePeriods(req, res, next) {
    try {
      const { period1Start, period1End, period2Start, period2End } = req.query;

      if (!period1Start || !period1End || !period2Start || !period2End) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'All date parameters are required: period1Start, period1End, period2Start, period2End'
        });
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const dates = [period1Start, period1End, period2Start, period2End];
      if (!dates.every(date => dateRegex.test(date))) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'All dates must be in YYYY-MM-DD format'
        });
      }

      const comparison = await analysisService.comparePeriods(
        period1Start,
        period1End,
        period2Start,
        period2End
      );
      
      res.json(comparison);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalysisController();
