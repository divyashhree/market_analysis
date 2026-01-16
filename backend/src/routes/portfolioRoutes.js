const express = require('express');
const router = express.Router();
const portfolioService = require('../services/portfolioService');

/**
 * @route GET /api/portfolio/sectors/list
 * @desc Get available sectors
 * NOTE: Must be defined BEFORE /:userId routes to avoid being captured as userId
 */
router.get('/sectors/list', (req, res) => {
  const sectors = [
    { id: 'banking', name: 'Banking', icon: '🏦' },
    { id: 'it', name: 'IT Services', icon: '💻' },
    { id: 'pharma', name: 'Pharmaceuticals', icon: '💊' },
    { id: 'auto', name: 'Automobile', icon: '🚗' },
    { id: 'fmcg', name: 'FMCG', icon: '🛒' },
    { id: 'realty', name: 'Real Estate', icon: '🏠' },
    { id: 'infra', name: 'Infrastructure', icon: '🏗️' },
    { id: 'metal', name: 'Metals & Mining', icon: '⛏️' },
    { id: 'oil_gas', name: 'Oil & Gas', icon: '🛢️' },
    { id: 'telecom', name: 'Telecom', icon: '📱' },
  ];
  res.json(sectors);
});

/**
 * @route GET /api/portfolio/stocks/nse
 * @desc Get list of NSE stocks
 * NOTE: Must be defined BEFORE /:userId routes to avoid being captured as userId
 */
router.get('/stocks/nse', (req, res) => {
  const stocks = portfolioService.getAvailableStocks();
  res.json(stocks);
});

/**
 * @route POST /api/portfolio/create
 * @desc Create a new portfolio
 */
router.post('/create', async (req, res) => {
  try {
    const { userId, holdings } = req.body;
    
    if (!userId || !holdings || !Array.isArray(holdings)) {
      return res.status(400).json({ error: 'userId and holdings array are required' });
    }
    
    const portfolio = portfolioService.createPortfolio(userId, holdings);
    res.json(portfolio);
  } catch (error) {
    console.error('Portfolio creation error:', error);
    res.status(500).json({ error: 'Failed to create portfolio' });
  }
});

/**
 * @route GET /api/portfolio/:userId
 * @desc Get user's portfolio
 */
router.get('/:userId', (req, res) => {
  try {
    const portfolio = portfolioService.getPortfolio(req.params.userId);
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Failed to get portfolio' });
  }
});

/**
 * @route PUT /api/portfolio/:userId
 * @desc Update portfolio holdings
 */
router.put('/:userId', (req, res) => {
  try {
    const { holdings } = req.body;
    const portfolio = portfolioService.updatePortfolio(req.params.userId, holdings);
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

/**
 * @route GET /api/portfolio/:userId/alerts
 * @desc Get macro alerts for portfolio
 */
router.get('/:userId/alerts', (req, res) => {
  try {
    const portfolio = portfolioService.getPortfolio(req.params.userId);
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    const alerts = portfolioService.generateMacroAlerts(portfolio);
    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

/**
 * @route POST /api/portfolio/:userId/stress-test
 * @desc Run stress test on portfolio
 */
router.post('/:userId/stress-test', (req, res) => {
  try {
    const { scenario } = req.body;
    const portfolio = portfolioService.getPortfolio(req.params.userId);
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    const result = portfolioService.stressTest(portfolio, scenario);
    res.json(result);
  } catch (error) {
    console.error('Stress test error:', error);
    res.status(500).json({ error: 'Failed to run stress test' });
  }
});

module.exports = router;
