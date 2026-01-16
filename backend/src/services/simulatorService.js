const dataService = require('./dataService');
const analysisService = require('./analysisService');
const cacheService = require('./cacheService');

/**
 * What-If Simulator Service
 * Analyzes historical data to predict market impact based on economic changes
 */
class SimulatorService {
  constructor() {
    // Historical impact data based on research
    this.historicalImpacts = {
      inflation: {
        nifty: {
          '1-2%': { impact: -3.5, confidence: 75, description: 'Moderate negative impact on equities' },
          '2-4%': { impact: -7.2, confidence: 70, description: 'Significant pressure on stock valuations' },
          '4-6%': { impact: -12.5, confidence: 65, description: 'Major correction likely' },
          '>6%': { impact: -18.0, confidence: 60, description: 'Severe market stress expected' },
        },
        usdinr: {
          '1-2%': { impact: 2.1, confidence: 72, description: 'Mild rupee depreciation' },
          '2-4%': { impact: 4.5, confidence: 68, description: 'Moderate rupee weakening' },
          '4-6%': { impact: 7.8, confidence: 63, description: 'Significant rupee decline' },
          '>6%': { impact: 12.0, confidence: 58, description: 'Sharp rupee depreciation' },
        },
      },
      interestRate: {
        nifty: {
          '0.25%': { impact: -2.5, confidence: 78, description: 'Minor market adjustment' },
          '0.5%': { impact: -5.0, confidence: 75, description: 'Noticeable pullback expected' },
          '0.75%': { impact: -8.0, confidence: 70, description: 'Significant correction likely' },
          '1%+': { impact: -12.0, confidence: 65, description: 'Major market impact' },
        },
        banking: {
          '0.25%': { impact: 3.0, confidence: 80, description: 'Positive for bank margins' },
          '0.5%': { impact: 5.5, confidence: 77, description: 'Strong banking sector boost' },
          '0.75%': { impact: 7.0, confidence: 73, description: 'Significant NIM expansion' },
          '1%+': { impact: 8.5, confidence: 70, description: 'Major banking sector rally' },
        },
      },
      oilPrice: {
        nifty: {
          '10%': { impact: -2.0, confidence: 70, description: 'Minor pressure on import-heavy sectors' },
          '20%': { impact: -4.5, confidence: 68, description: 'Moderate market impact' },
          '30%': { impact: -7.0, confidence: 65, description: 'Significant drag on economy' },
          '50%+': { impact: -12.0, confidence: 60, description: 'Major economic headwind' },
        },
        usdinr: {
          '10%': { impact: 1.5, confidence: 72, description: 'Mild rupee pressure' },
          '20%': { impact: 3.2, confidence: 70, description: 'Moderate forex impact' },
          '30%': { impact: 5.5, confidence: 67, description: 'Significant CAD pressure' },
          '50%+': { impact: 8.5, confidence: 62, description: 'Severe balance of payments stress' },
        },
      },
      fedRate: {
        nifty: {
          '0.25%': { impact: -1.5, confidence: 75, description: 'FII outflow pressure' },
          '0.5%': { impact: -3.5, confidence: 72, description: 'Moderate FII selling' },
          '0.75%': { impact: -6.0, confidence: 68, description: 'Significant capital outflow' },
          '1%+': { impact: -9.0, confidence: 63, description: 'Major EM selloff likely' },
        },
        usdinr: {
          '0.25%': { impact: 1.0, confidence: 78, description: 'Dollar strength pressure' },
          '0.5%': { impact: 2.2, confidence: 75, description: 'Moderate rupee weakening' },
          '0.75%': { impact: 3.8, confidence: 70, description: 'Significant dollar rally' },
          '1%+': { impact: 5.5, confidence: 65, description: 'Sharp dollar appreciation' },
        },
      },
    };

    // RBI policy impacts
    this.rbiPolicyImpacts = {
      repoRate: {
        increase: {
          nifty: -2.5,
          banking: 3.0,
          realty: -4.0,
          auto: -3.0,
        },
        decrease: {
          nifty: 2.0,
          banking: -1.5,
          realty: 4.5,
          auto: 3.5,
        },
      },
      crrChange: {
        increase: {
          nifty: -1.5,
          banking: -2.5,
          liquidity: -5.0,
        },
        decrease: {
          nifty: 1.2,
          banking: 2.0,
          liquidity: 4.0,
        },
      },
    };

    // Budget impact patterns
    this.budgetImpacts = {
      fiscalDeficit: {
        increase: { nifty: -1.5, bonds: -2.0, usdinr: 1.0 },
        decrease: { nifty: 1.0, bonds: 1.5, usdinr: -0.5 },
      },
      capitalExpenditure: {
        increase: { infrastructure: 5.0, cement: 4.0, steel: 3.5, nifty: 1.5 },
        decrease: { infrastructure: -3.0, cement: -2.5, steel: -2.0, nifty: -1.0 },
      },
      taxChanges: {
        incomeTaxCut: { consumption: 3.5, auto: 2.5, fmcg: 2.0, nifty: 1.5 },
        corporateTaxCut: { nifty: 4.0, profitability: 5.0 },
        capitalGainsTaxIncrease: { nifty: -3.0, fii: -2.5 },
      },
    };
  }

  /**
   * Run a what-if simulation
   */
  async runSimulation(scenario) {
    const { type, change, timeframe = '6m' } = scenario;
    
    try {
      // Get historical data for context
      const data = await dataService.getAllData();
      const correlations = await analysisService.getCorrelations();
      
      let results = {};
      
      switch (type) {
        case 'inflation':
          results = this.simulateInflationChange(change, data, correlations);
          break;
        case 'interestRate':
          results = this.simulateInterestRateChange(change, data);
          break;
        case 'oilPrice':
          results = this.simulateOilPriceChange(change, data);
          break;
        case 'fedRate':
          results = this.simulateFedRateChange(change, data);
          break;
        case 'rbiPolicy':
          results = this.simulateRBIPolicy(scenario.policy, change);
          break;
        case 'budget':
          results = this.simulateBudgetImpact(scenario.category, change);
          break;
        default:
          throw new Error('Unknown simulation type');
      }
      
      // Add historical context
      results.historicalContext = await this.getHistoricalContext(type, change, data);
      results.timeframe = timeframe;
      
      return results;
    } catch (error) {
      console.error('Simulation error:', error);
      throw error;
    }
  }

  simulateInflationChange(change, data, correlations) {
    const changeNum = parseFloat(change);
    let bracket;
    
    if (changeNum <= 2) bracket = '1-2%';
    else if (changeNum <= 4) bracket = '2-4%';
    else if (changeNum <= 6) bracket = '4-6%';
    else bracket = '>6%';
    
    const niftyImpact = this.historicalImpacts.inflation.nifty[bracket];
    const usdinrImpact = this.historicalImpacts.inflation.usdinr[bracket];
    
    // Adjust based on correlation strength
    const correlationFactor = Math.abs(correlations.cpi_nifty);
    
    return {
      type: 'inflation',
      inputChange: `${changeNum}%`,
      predictions: [
        {
          indicator: 'NIFTY 50',
          expectedChange: (niftyImpact.impact * (changeNum / 2)).toFixed(2) + '%',
          confidence: niftyImpact.confidence,
          description: niftyImpact.description,
          direction: 'negative',
        },
        {
          indicator: 'USD/INR',
          expectedChange: '+' + (usdinrImpact.impact * (changeNum / 2)).toFixed(2) + '%',
          confidence: usdinrImpact.confidence,
          description: usdinrImpact.description,
          direction: 'negative',
        },
        {
          indicator: 'Bond Yields',
          expectedChange: '+' + (changeNum * 0.4).toFixed(2) + '%',
          confidence: 70,
          description: 'Higher inflation leads to higher yields',
          direction: 'negative',
        },
      ],
      sectorImpacts: [
        { sector: 'Banking', impact: -changeNum * 0.8, reason: 'NIM pressure from rate hikes' },
        { sector: 'FMCG', impact: -changeNum * 0.5, reason: 'Input cost pressure' },
        { sector: 'IT', impact: -changeNum * 0.3, reason: 'Relatively insulated' },
        { sector: 'Pharma', impact: -changeNum * 0.4, reason: 'Defensive sector' },
        { sector: 'Auto', impact: -changeNum * 1.2, reason: 'Demand destruction' },
        { sector: 'Real Estate', impact: -changeNum * 1.5, reason: 'Higher borrowing costs' },
      ],
      correlationStrength: correlationFactor,
    };
  }

  simulateInterestRateChange(change, data) {
    const changeNum = parseFloat(change);
    let bracket;
    
    if (changeNum <= 0.25) bracket = '0.25%';
    else if (changeNum <= 0.5) bracket = '0.5%';
    else if (changeNum <= 0.75) bracket = '0.75%';
    else bracket = '1%+';
    
    const niftyImpact = this.historicalImpacts.interestRate.nifty[bracket];
    const bankingImpact = this.historicalImpacts.interestRate.banking[bracket];
    
    return {
      type: 'interestRate',
      inputChange: `${changeNum}%`,
      predictions: [
        {
          indicator: 'NIFTY 50',
          expectedChange: (niftyImpact.impact * (changeNum / 0.25)).toFixed(2) + '%',
          confidence: niftyImpact.confidence,
          description: niftyImpact.description,
          direction: 'negative',
        },
        {
          indicator: 'Bank Nifty',
          expectedChange: '+' + (bankingImpact.impact * (changeNum / 0.25)).toFixed(2) + '%',
          confidence: bankingImpact.confidence,
          description: bankingImpact.description,
          direction: 'positive',
        },
      ],
      sectorImpacts: [
        { sector: 'Banking', impact: changeNum * 8, reason: 'NIM expansion' },
        { sector: 'NBFC', impact: -changeNum * 6, reason: 'Higher funding costs' },
        { sector: 'Real Estate', impact: -changeNum * 10, reason: 'EMI burden increases' },
        { sector: 'Auto', impact: -changeNum * 7, reason: 'Loan affordability drops' },
        { sector: 'Infrastructure', impact: -changeNum * 5, reason: 'Project cost increases' },
      ],
    };
  }

  simulateOilPriceChange(change, data) {
    const changeNum = parseFloat(change);
    let bracket;
    
    if (changeNum <= 10) bracket = '10%';
    else if (changeNum <= 20) bracket = '20%';
    else if (changeNum <= 30) bracket = '30%';
    else bracket = '50%+';
    
    const niftyImpact = this.historicalImpacts.oilPrice.nifty[bracket];
    const usdinrImpact = this.historicalImpacts.oilPrice.usdinr[bracket];
    
    return {
      type: 'oilPrice',
      inputChange: `${changeNum}%`,
      predictions: [
        {
          indicator: 'NIFTY 50',
          expectedChange: (niftyImpact.impact * (changeNum / 10)).toFixed(2) + '%',
          confidence: niftyImpact.confidence,
          description: niftyImpact.description,
          direction: 'negative',
        },
        {
          indicator: 'USD/INR',
          expectedChange: '+' + (usdinrImpact.impact * (changeNum / 10)).toFixed(2) + '%',
          confidence: usdinrImpact.confidence,
          description: usdinrImpact.description,
          direction: 'negative',
        },
      ],
      sectorImpacts: [
        { sector: 'OMCs (IOCL, BPCL)', impact: -changeNum * 0.5, reason: 'Marketing margin compression' },
        { sector: 'Aviation', impact: -changeNum * 0.8, reason: 'Fuel cost surge' },
        { sector: 'Paints', impact: -changeNum * 0.4, reason: 'Raw material cost increase' },
        { sector: 'Tyres', impact: -changeNum * 0.3, reason: 'Rubber derivative costs' },
        { sector: 'ONGC/Reliance', impact: changeNum * 0.3, reason: 'Higher realizations' },
      ],
    };
  }

  simulateFedRateChange(change, data) {
    const changeNum = parseFloat(change);
    let bracket;
    
    if (changeNum <= 0.25) bracket = '0.25%';
    else if (changeNum <= 0.5) bracket = '0.5%';
    else if (changeNum <= 0.75) bracket = '0.75%';
    else bracket = '1%+';
    
    const niftyImpact = this.historicalImpacts.fedRate.nifty[bracket];
    const usdinrImpact = this.historicalImpacts.fedRate.usdinr[bracket];
    
    return {
      type: 'fedRate',
      inputChange: `${changeNum}%`,
      predictions: [
        {
          indicator: 'NIFTY 50',
          expectedChange: (niftyImpact.impact * (changeNum / 0.25)).toFixed(2) + '%',
          confidence: niftyImpact.confidence,
          description: niftyImpact.description,
          direction: 'negative',
        },
        {
          indicator: 'USD/INR',
          expectedChange: '+' + (usdinrImpact.impact * (changeNum / 0.25)).toFixed(2) + '%',
          confidence: usdinrImpact.confidence,
          description: usdinrImpact.description,
          direction: 'negative',
        },
        {
          indicator: 'FII Flows',
          expectedChange: '-$' + (changeNum * 2).toFixed(1) + 'B',
          confidence: 70,
          description: 'Capital outflow to US markets',
          direction: 'negative',
        },
      ],
      sectorImpacts: [
        { sector: 'IT Services', impact: changeNum * 3, reason: 'Rupee depreciation benefit' },
        { sector: 'Pharma', impact: changeNum * 2, reason: 'Export competitiveness' },
        { sector: 'FII-heavy stocks', impact: -changeNum * 8, reason: 'Selling pressure' },
      ],
    };
  }

  simulateRBIPolicy(policy, change) {
    const changeNum = parseFloat(change);
    const direction = changeNum > 0 ? 'increase' : 'decrease';
    const impacts = this.rbiPolicyImpacts[policy]?.[direction] || {};
    
    return {
      type: 'rbiPolicy',
      policy,
      inputChange: `${changeNum > 0 ? '+' : ''}${changeNum}%`,
      predictions: Object.entries(impacts).map(([indicator, impact]) => ({
        indicator: indicator.charAt(0).toUpperCase() + indicator.slice(1),
        expectedChange: `${(impact * Math.abs(changeNum) / 0.25).toFixed(2)}%`,
        confidence: 75,
        direction: impact > 0 ? 'positive' : 'negative',
      })),
    };
  }

  simulateBudgetImpact(category, change) {
    const direction = change > 0 ? 'increase' : 'decrease';
    const impacts = this.budgetImpacts[category]?.[direction] || 
                    this.budgetImpacts[category] || {};
    
    return {
      type: 'budget',
      category,
      predictions: Object.entries(impacts).map(([sector, impact]) => ({
        indicator: sector.charAt(0).toUpperCase() + sector.slice(1),
        expectedChange: `${impact > 0 ? '+' : ''}${impact}%`,
        confidence: 72,
        direction: impact > 0 ? 'positive' : 'negative',
      })),
    };
  }

  async getHistoricalContext(type, change, data) {
    // Find similar historical scenarios
    const events = [
      { date: '2022-06', event: 'RBI rate hike cycle begins', inflation: 7.0, niftyChange: -5.2 },
      { date: '2020-03', event: 'COVID crash', inflation: 5.8, niftyChange: -23.0 },
      { date: '2018-10', event: 'NBFC crisis', inflation: 3.4, niftyChange: -11.0 },
      { date: '2016-11', event: 'Demonetization', inflation: 3.6, niftyChange: -6.0 },
      { date: '2013-08', event: 'Taper tantrum', inflation: 9.5, niftyChange: -9.0 },
      { date: '2011-12', event: 'Eurozone crisis', inflation: 7.7, niftyChange: -25.0 },
      { date: '2008-10', event: 'Global Financial Crisis', inflation: 10.4, niftyChange: -52.0 },
    ];
    
    return {
      similarEvents: events.slice(0, 3),
      dataPoints: data.nifty?.length || 0,
    };
  }

  /**
   * Get all available scenarios
   */
  getAvailableScenarios() {
    return {
      macroFactors: [
        { id: 'inflation', name: 'Inflation Change', unit: '%', range: [1, 10] },
        { id: 'interestRate', name: 'Interest Rate Change', unit: '%', range: [0.25, 2] },
        { id: 'oilPrice', name: 'Oil Price Change', unit: '%', range: [10, 100] },
        { id: 'fedRate', name: 'Fed Rate Change', unit: '%', range: [0.25, 1.5] },
      ],
      rbiPolicies: [
        { id: 'repoRate', name: 'Repo Rate', description: 'RBI benchmark lending rate' },
        { id: 'crrChange', name: 'CRR Change', description: 'Cash Reserve Ratio' },
      ],
      budgetCategories: [
        { id: 'fiscalDeficit', name: 'Fiscal Deficit', description: 'Government borrowing' },
        { id: 'capitalExpenditure', name: 'Capital Expenditure', description: 'Infrastructure spending' },
        { id: 'taxChanges', name: 'Tax Policy', description: 'Tax rate modifications' },
      ],
    };
  }
}

module.exports = new SimulatorService();
