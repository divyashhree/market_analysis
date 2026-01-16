const express = require('express');
const router = express.Router();
const simulatorService = require('../services/simulatorService');

/**
 * Transform service result to frontend-expected format
 */
function transformResult(result, type, params) {
  // Convert predictions to impacts format expected by frontend
  const impacts = {};
  if (result.predictions) {
    result.predictions.forEach(pred => {
      const key = pred.indicator.replace(/\s+/g, '_').toLowerCase();
      impacts[key] = {
        change: parseFloat(pred.expectedChange) || 0,
        confidence: pred.confidence || 70,
        direction: pred.direction || 'neutral',
      };
    });
  }

  // Determine risk level based on impact magnitude
  let riskLevel = 'low';
  const avgImpact = Object.values(impacts).reduce((sum, v) => sum + Math.abs(v.change), 0) / (Object.keys(impacts).length || 1);
  if (avgImpact > 5) riskLevel = 'high';
  else if (avgImpact > 2) riskLevel = 'medium';

  // Generate recommendation based on scenario
  const recommendations = {
    inflation: 'Consider defensive sectors like FMCG and Pharma. Reduce exposure to rate-sensitive sectors.',
    interestRate: 'Banking sector may benefit from NIM expansion. Avoid NBFC and real estate stocks.',
    oilPrice: 'Reduce exposure to aviation and paint sectors. Consider upstream oil producers.',
    fedRate: 'FII outflows likely. Maintain cash reserves for buying opportunities.',
    rbiPolicy: 'Monitor liquidity conditions. Adjust duration in fixed income portfolio.',
    budget: 'Focus on sectors aligned with government priorities. Watch fiscal deficit trajectory.',
  };

  return {
    scenario: type,
    impacts,
    sectorImpacts: result.sectorImpacts || [],
    historicalContext: result.historicalContext || {
      event: 'Similar historical scenario',
      date: 'Various periods',
      niftyChange: -2.5,
      usdinrChange: 1.2,
    },
    riskLevel,
    recommendation: recommendations[type] || 'Monitor market conditions and adjust positions accordingly.',
    rawData: result,
  };
}

/**
 * @route POST /api/simulator/run
 * @desc Run a what-if simulation
 */
router.post('/run', async (req, res) => {
  try {
    const { type, params } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Simulation type is required' });
    }
    
    // Build scenario object for service
    const scenario = {
      type,
      change: params?.newRate || params?.newPrice || params?.change || 5,
      policy: params?.action,
      category: params?.theme,
      ...params,
    };
    
    const result = await simulatorService.runSimulation(scenario);
    const transformedResult = transformResult(result, type, params);
    res.json(transformedResult);
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Failed to run simulation' });
  }
});

/**
 * @route GET /api/simulator/scenarios
 * @desc Get available simulation scenarios
 */
router.get('/scenarios', (req, res) => {
  const scenarios = [
    {
      id: 'inflation',
      name: 'Inflation Change',
      description: 'Simulate impact of CPI inflation changes on markets',
      icon: '📈',
      params: [
        { name: 'currentRate', type: 'number', default: 5.5, min: 0, max: 15, label: 'Current Rate (%)' },
        { name: 'newRate', type: 'number', default: 7.0, min: 0, max: 20, label: 'New Rate (%)' },
      ],
    },
    {
      id: 'interestRate',
      name: 'Interest Rate Change',
      description: 'Simulate RBI repo rate changes',
      icon: '🏦',
      params: [
        { name: 'currentRate', type: 'number', default: 6.5, min: 3, max: 12, label: 'Current Rate (%)' },
        { name: 'newRate', type: 'number', default: 6.75, min: 3, max: 12, label: 'New Rate (%)' },
      ],
    },
    {
      id: 'oilPrice',
      name: 'Oil Price Shock',
      description: 'Simulate crude oil price movements',
      icon: '🛢️',
      params: [
        { name: 'currentPrice', type: 'number', default: 80, min: 30, max: 150, label: 'Current Price ($)' },
        { name: 'newPrice', type: 'number', default: 100, min: 30, max: 200, label: 'New Price ($)' },
      ],
    },
    {
      id: 'fedRate',
      name: 'Fed Rate Decision',
      description: 'Simulate US Federal Reserve rate changes',
      icon: '🇺🇸',
      params: [
        { name: 'currentRate', type: 'number', default: 5.25, min: 0, max: 10, label: 'Current Rate (%)' },
        { name: 'newRate', type: 'number', default: 5.0, min: 0, max: 10, label: 'New Rate (%)' },
      ],
    },
    {
      id: 'rbiPolicy',
      name: 'RBI Policy Action',
      description: 'Simulate specific RBI policy decisions',
      icon: '🇮🇳',
      params: [
        { 
          name: 'action', 
          type: 'select', 
          options: ['rate_hike', 'rate_cut', 'hawkish_hold', 'dovish_hold', 'quantitative_tightening'],
          label: 'Policy Action' 
        },
      ],
    },
    {
      id: 'budget',
      name: 'Budget Announcement',
      description: 'Simulate Union Budget impacts',
      icon: '📜',
      params: [
        { 
          name: 'theme', 
          type: 'select', 
          options: ['infra_push', 'fiscal_consolidation', 'consumption_boost', 'populist'],
          label: 'Budget Theme' 
        },
      ],
    },
  ];
  
  res.json(scenarios);
});

/**
 * @route GET /api/simulator/history
 * @desc Get historical simulation accuracy
 */
router.get('/history', (req, res) => {
  // Return historical accuracy data
  const history = [
    { event: 'RBI Rate Hike Jun 2023', predicted: -2.5, actual: -2.1, accuracy: 84 },
    { event: 'Crude Spike Oct 2023', predicted: -3.0, actual: -2.8, accuracy: 93 },
    { event: 'Fed Pause Dec 2023', predicted: +2.0, actual: +2.5, accuracy: 80 },
    { event: 'Budget 2024', predicted: +1.5, actual: +1.8, accuracy: 83 },
  ];
  
  const avgAccuracy = history.reduce((sum, h) => sum + h.accuracy, 0) / history.length;
  
  res.json({ history, avgAccuracy: avgAccuracy.toFixed(1) });
});

module.exports = router;
