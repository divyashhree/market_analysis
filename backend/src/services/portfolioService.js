const cacheService = require('./cacheService');
const { v4: uuidv4 } = require('uuid');

/**
 * Portfolio Service
 * Manages user portfolios with macro alert capabilities
 */
class PortfolioService {
  constructor() {
    // In-memory storage (replace with database in production)
    this.portfolios = new Map();
    this.alerts = new Map();
    this.alertHistory = [];
    
    // Sector classifications for Indian stocks
    this.sectorMap = {
      // Technology
      'TCS.NS': 'Technology', 'INFY.NS': 'Technology', 'WIPRO.NS': 'Technology',
      'HCLTECH.NS': 'Technology', 'TECHM.NS': 'Technology', 'LTI.NS': 'Technology',
      
      // Banking
      'HDFCBANK.NS': 'Banking', 'ICICIBANK.NS': 'Banking', 'KOTAKBANK.NS': 'Banking',
      'SBIN.NS': 'Banking', 'AXISBANK.NS': 'Banking', 'INDUSINDBK.NS': 'Banking',
      
      // Financial Services
      'BAJFINANCE.NS': 'NBFC', 'BAJAJFINSV.NS': 'NBFC', 'HDFC.NS': 'NBFC',
      
      // Energy
      'RELIANCE.NS': 'Energy', 'ONGC.NS': 'Energy', 'BPCL.NS': 'Energy',
      'IOC.NS': 'Energy', 'COALINDIA.NS': 'Energy', 'POWERGRID.NS': 'Utilities',
      
      // Auto
      'MARUTI.NS': 'Auto', 'TATAMOTORS.NS': 'Auto', 'M&M.NS': 'Auto',
      'BAJAJ-AUTO.NS': 'Auto', 'HEROMOTOCO.NS': 'Auto', 'EICHERMOT.NS': 'Auto',
      
      // Pharma
      'SUNPHARMA.NS': 'Pharma', 'DRREDDY.NS': 'Pharma', 'CIPLA.NS': 'Pharma',
      'DIVISLAB.NS': 'Pharma', 'APOLLOHOSP.NS': 'Healthcare',
      
      // FMCG
      'HINDUNILVR.NS': 'FMCG', 'ITC.NS': 'FMCG', 'NESTLEIND.NS': 'FMCG',
      'BRITANNIA.NS': 'FMCG', 'DABUR.NS': 'FMCG', 'MARICO.NS': 'FMCG',
      
      // Metals
      'TATASTEEL.NS': 'Metals', 'JSWSTEEL.NS': 'Metals', 'HINDALCO.NS': 'Metals',
      'VEDL.NS': 'Metals', 'NMDC.NS': 'Metals',
      
      // Infrastructure
      'LT.NS': 'Infrastructure', 'ULTRACEMCO.NS': 'Cement', 'GRASIM.NS': 'Cement',
      'ADANIPORTS.NS': 'Infrastructure', 'ADANIENT.NS': 'Conglomerate',
      
      // Real Estate
      'DLF.NS': 'Real Estate', 'GODREJPROP.NS': 'Real Estate',
      
      // Telecom
      'BHARTIARTL.NS': 'Telecom',
    };

    // Macro sensitivity by sector
    this.sectorSensitivity = {
      Technology: { inflation: -0.3, interestRate: -0.4, fedRate: 0.5, oil: -0.2 },
      Banking: { inflation: -0.5, interestRate: 0.8, fedRate: -0.3, oil: -0.1 },
      NBFC: { inflation: -0.6, interestRate: -0.7, fedRate: -0.4, oil: -0.1 },
      Energy: { inflation: 0.2, interestRate: -0.3, fedRate: -0.2, oil: 0.7 },
      Auto: { inflation: -0.7, interestRate: -0.8, fedRate: -0.3, oil: -0.5 },
      Pharma: { inflation: -0.2, interestRate: -0.2, fedRate: 0.3, oil: -0.1 },
      FMCG: { inflation: -0.4, interestRate: -0.3, fedRate: -0.2, oil: -0.2 },
      Metals: { inflation: 0.3, interestRate: -0.4, fedRate: -0.4, oil: -0.3 },
      Infrastructure: { inflation: -0.4, interestRate: -0.6, fedRate: -0.3, oil: -0.4 },
      'Real Estate': { inflation: -0.5, interestRate: -0.9, fedRate: -0.4, oil: -0.2 },
      Cement: { inflation: -0.3, interestRate: -0.5, fedRate: -0.3, oil: -0.4 },
      Telecom: { inflation: -0.3, interestRate: -0.4, fedRate: -0.2, oil: -0.1 },
      Utilities: { inflation: -0.2, interestRate: -0.3, fedRate: -0.2, oil: -0.3 },
    };
  }

  /**
   * Create or update a portfolio
   */
  createPortfolio(userId, holdings) {
    const portfolioId = this.portfolios.has(userId) 
      ? this.portfolios.get(userId).id 
      : uuidv4();
    
    const portfolio = {
      id: portfolioId,
      userId,
      holdings: holdings.map(h => ({
        ...h,
        sector: this.sectorMap[h.symbol] || 'Other',
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Calculate sector allocation
    portfolio.sectorAllocation = this.calculateSectorAllocation(portfolio.holdings);
    portfolio.riskMetrics = this.calculateRiskMetrics(portfolio);
    
    this.portfolios.set(userId, portfolio);
    return portfolio;
  }

  /**
   * Get portfolio by user ID
   */
  getPortfolio(userId) {
    return this.portfolios.get(userId) || null;
  }

  /**
   * Calculate sector allocation
   */
  calculateSectorAllocation(holdings) {
    const totalValue = holdings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);
    const sectorValues = {};
    
    holdings.forEach(h => {
      const value = h.quantity * h.avgPrice;
      const sector = h.sector || 'Other';
      sectorValues[sector] = (sectorValues[sector] || 0) + value;
    });
    
    return Object.entries(sectorValues).map(([sector, value]) => ({
      sector,
      value,
      percentage: ((value / totalValue) * 100).toFixed(2),
    })).sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * Calculate risk metrics for portfolio
   */
  calculateRiskMetrics(portfolio) {
    const { holdings, sectorAllocation } = portfolio;
    
    // Concentration risk
    const topSectorWeight = Math.max(...sectorAllocation.map(s => parseFloat(s.percentage)));
    const concentrationRisk = topSectorWeight > 40 ? 'High' : topSectorWeight > 25 ? 'Medium' : 'Low';
    
    // Macro sensitivity scores
    let inflationSensitivity = 0;
    let interestRateSensitivity = 0;
    let fedRateSensitivity = 0;
    let oilSensitivity = 0;
    
    sectorAllocation.forEach(({ sector, percentage }) => {
      const weight = parseFloat(percentage) / 100;
      const sensitivity = this.sectorSensitivity[sector] || { inflation: 0, interestRate: 0, fedRate: 0, oil: 0 };
      
      inflationSensitivity += weight * sensitivity.inflation;
      interestRateSensitivity += weight * sensitivity.interestRate;
      fedRateSensitivity += weight * sensitivity.fedRate;
      oilSensitivity += weight * sensitivity.oil;
    });
    
    return {
      concentrationRisk,
      topSector: sectorAllocation[0]?.sector || 'N/A',
      topSectorWeight: topSectorWeight.toFixed(1) + '%',
      macroSensitivity: {
        inflation: { score: inflationSensitivity.toFixed(2), risk: this.getRiskLevel(inflationSensitivity) },
        interestRate: { score: interestRateSensitivity.toFixed(2), risk: this.getRiskLevel(interestRateSensitivity) },
        fedRate: { score: fedRateSensitivity.toFixed(2), risk: this.getRiskLevel(fedRateSensitivity) },
        oil: { score: oilSensitivity.toFixed(2), risk: this.getRiskLevel(oilSensitivity) },
      },
      diversificationScore: this.calculateDiversificationScore(sectorAllocation),
    };
  }

  getRiskLevel(score) {
    const absScore = Math.abs(score);
    if (absScore > 0.6) return 'High';
    if (absScore > 0.3) return 'Medium';
    return 'Low';
  }

  calculateDiversificationScore(sectorAllocation) {
    // Herfindahl-Hirschman Index based
    const hhi = sectorAllocation.reduce((sum, s) => sum + Math.pow(parseFloat(s.percentage), 2), 0);
    const normalizedScore = Math.max(0, 100 - (hhi / 100));
    return Math.round(normalizedScore);
  }

  /**
   * Generate macro alerts for a portfolio
   */
  generateMacroAlerts(userId, macroEvent) {
    const portfolio = this.getPortfolio(userId);
    if (!portfolio) return [];
    
    const alerts = [];
    const { type, change, description } = macroEvent;
    
    portfolio.sectorAllocation.forEach(({ sector, percentage }) => {
      const sensitivity = this.sectorSensitivity[sector];
      if (!sensitivity) return;
      
      let impact = 0;
      let relevantFactor = '';
      
      switch (type) {
        case 'inflation':
          impact = sensitivity.inflation * change * parseFloat(percentage);
          relevantFactor = 'inflation';
          break;
        case 'interestRate':
          impact = sensitivity.interestRate * change * parseFloat(percentage);
          relevantFactor = 'interest rates';
          break;
        case 'fedRate':
          impact = sensitivity.fedRate * change * parseFloat(percentage);
          relevantFactor = 'Fed policy';
          break;
        case 'oil':
          impact = sensitivity.oil * change * parseFloat(percentage);
          relevantFactor = 'oil prices';
          break;
      }
      
      if (Math.abs(impact) > 1) {
        alerts.push({
          id: uuidv4(),
          severity: Math.abs(impact) > 5 ? 'high' : Math.abs(impact) > 2 ? 'medium' : 'low',
          sector,
          sectorWeight: percentage + '%',
          expectedImpact: impact.toFixed(2) + '%',
          message: `Your ${percentage}% allocation to ${sector} stocks may ${impact < 0 ? 'decline' : 'rise'} by ~${Math.abs(impact).toFixed(1)}% due to ${relevantFactor} changes.`,
          recommendation: this.getRecommendation(sector, impact, relevantFactor),
          timestamp: new Date().toISOString(),
        });
      }
    });
    
    // Sort by severity
    alerts.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    // Store alerts
    this.alertHistory.push(...alerts);
    
    return alerts;
  }

  getRecommendation(sector, impact, factor) {
    if (impact < -3) {
      return `Consider reducing ${sector} exposure or hedging with puts. Historical data suggests ${factor} headwinds.`;
    } else if (impact < 0) {
      return `Monitor ${sector} positions. Minor pressure expected from ${factor}.`;
    } else if (impact > 3) {
      return `${sector} may outperform. Consider adding exposure to benefit from ${factor} tailwinds.`;
    } else {
      return `${sector} relatively neutral to ${factor}. Maintain current allocation.`;
    }
  }

  /**
   * Get portfolio stress test results
   */
  stressTest(userId, scenarios) {
    const portfolio = this.getPortfolio(userId);
    if (!portfolio) return null;
    
    const results = scenarios.map(scenario => {
      let totalImpact = 0;
      const sectorImpacts = [];
      
      portfolio.sectorAllocation.forEach(({ sector, percentage, value }) => {
        const sensitivity = this.sectorSensitivity[sector] || {};
        let sectorImpact = 0;
        
        if (scenario.inflation) sectorImpact += (sensitivity.inflation || 0) * scenario.inflation;
        if (scenario.interestRate) sectorImpact += (sensitivity.interestRate || 0) * scenario.interestRate;
        if (scenario.fedRate) sectorImpact += (sensitivity.fedRate || 0) * scenario.fedRate;
        if (scenario.oil) sectorImpact += (sensitivity.oil || 0) * scenario.oil;
        
        const weightedImpact = sectorImpact * (parseFloat(percentage) / 100);
        totalImpact += weightedImpact;
        
        sectorImpacts.push({
          sector,
          weight: percentage,
          impact: (sectorImpact * 100).toFixed(2) + '%',
        });
      });
      
      return {
        scenario: scenario.name,
        portfolioImpact: (totalImpact * 100).toFixed(2) + '%',
        sectorBreakdown: sectorImpacts.sort((a, b) => parseFloat(a.impact) - parseFloat(b.impact)),
      };
    });
    
    return results;
  }

  /**
   * Get predefined stress scenarios
   */
  getStressScenarios() {
    return [
      {
        name: '2008 GFC Replay',
        description: 'Global financial crisis scenario',
        inflation: 3,
        interestRate: -2,
        fedRate: -1.5,
        oil: -50,
      },
      {
        name: 'Stagflation',
        description: 'High inflation with slow growth',
        inflation: 5,
        interestRate: 2,
        fedRate: 1,
        oil: 30,
      },
      {
        name: 'Fed Tightening',
        description: 'Aggressive Fed rate hikes',
        inflation: 1,
        interestRate: 1,
        fedRate: 1.5,
        oil: 10,
      },
      {
        name: 'Oil Shock',
        description: 'Major oil price surge',
        inflation: 2,
        interestRate: 0.5,
        fedRate: 0.25,
        oil: 50,
      },
      {
        name: 'Goldilocks',
        description: 'Ideal economic conditions',
        inflation: -1,
        interestRate: -0.25,
        fedRate: -0.25,
        oil: -10,
      },
    ];
  }

  /**
   * Get available stocks for portfolio
   */
  getAvailableStocks() {
    return Object.entries(this.sectorMap).map(([symbol, sector]) => ({
      symbol,
      name: symbol.replace('.NS', ''),
      sector,
    }));
  }
}

module.exports = new PortfolioService();
