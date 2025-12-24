const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// GET /api/analysis/correlations - Get correlation coefficients
router.get('/correlations', analysisController.getCorrelations);

// GET /api/analysis/insights - Get auto-generated insights
router.get('/insights', analysisController.getInsights);

// GET /api/analysis/full - Get comprehensive analysis
router.get('/full', analysisController.getFullAnalysis);

// GET /api/analysis/compare - Compare two time periods
router.get('/compare', analysisController.comparePeriods);

module.exports = router;
