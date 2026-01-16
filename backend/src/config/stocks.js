/**
 * Configuration for major global stocks
 * This list includes top companies from various key markets.
 * Yahoo Finance tickers are used for data fetching.
 */

const STOCKS = {
  // US Tech Giants
  'AAPL': { name: 'Apple Inc.', country: 'US', sector: 'Technology', industry: 'Consumer Electronics' },
  'MSFT': { name: 'Microsoft Corp.', country: 'US', sector: 'Technology', industry: 'Software—Infrastructure' },
  'GOOGL': { name: 'Alphabet Inc.', country: 'US', sector: 'Communication Services', industry: 'Internet Content & Information' },
  'AMZN': { name: 'Amazon.com, Inc.', country: 'US', sector: 'Consumer Cyclical', industry: 'Internet Retail' },
  'NVDA': { name: 'NVIDIA Corp.', country: 'US', sector: 'Technology', industry: 'Semiconductors' },
  'META': { name: 'Meta Platforms, Inc.', country: 'US', sector: 'Communication Services', industry: 'Internet Content & Information' },
  'TSLA': { name: 'Tesla, Inc.', country: 'US', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },

  // US Financials & Healthcare
  'JPM': { name: 'JPMorgan Chase & Co.', country: 'US', sector: 'Financial Services', industry: 'Banks—Diversified' },
  'V': { name: 'Visa Inc.', country: 'US', sector: 'Financial Services', industry: 'Credit Services' },
  'JNJ': { name: 'Johnson & Johnson', country: 'US', sector: 'Healthcare', industry: 'Drug Manufacturers—General' },

  // European Giants
  'NVO': { name: 'Novo Nordisk A/S', country: 'DK', sector: 'Healthcare', industry: 'Biotechnology' },
  'ASML': { name: 'ASML Holding N.V.', country: 'NL', sector: 'Technology', industry: 'Semiconductor Equipment & Materials' },
  'LVMUY': { name: 'LVMH Moët Hennessy Louis Vuitton SE', country: 'FR', sector: 'Consumer Cyclical', industry: 'Luxury Goods' },
  'SAP': { name: 'SAP SE', country: 'DE', sector: 'Technology', industry: 'Software—Application' },
  'SIE.DE': { name: 'Siemens AG', country: 'DE', sector: 'Industrials', industry: 'Conglomerates' },

  // Asian Titans
  'TSM': { name: 'Taiwan Semiconductor Manufacturing Co.', country: 'TW', sector: 'Technology', industry: 'Semiconductors' },
  'TM': { name: 'Toyota Motor Corp.', country: 'JP', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
  'SONY': { name: 'Sony Group Corp.', country: 'JP', sector: 'Technology', industry: 'Consumer Electronics' },
  'BABA': { name: 'Alibaba Group Holding Ltd.', country: 'CN', sector: 'Consumer Cyclical', industry: 'Internet Retail' },
  'TCEHY': { name: 'Tencent Holdings Ltd.', country: 'CN', sector: 'Communication Services', industry: 'Internet Content & Information' },
  'SSNLF': { name: 'Samsung Electronics Co., Ltd.', country: 'KR', sector: 'Technology', industry: 'Consumer Electronics' },

  // Indian Leaders
  'RELIANCE.NS': { name: 'Reliance Industries Ltd.', country: 'IN', sector: 'Energy', industry: 'Oil & Gas Refining & Marketing' },
  'TCS.NS': { name: 'Tata Consultancy Services Ltd.', country: 'IN', sector: 'Technology', industry: 'Information Technology Services' },
  'HDB': { name: 'HDFC Bank Ltd.', country: 'IN', sector: 'Financial Services', industry: 'Banks—Regional' },
  'INFY': { name: 'Infosys Ltd.', country: 'IN', sector: 'Technology', industry: 'Information Technology Services' },
};

const getStock = (symbol) => STOCKS[symbol.toUpperCase()];

const getAllStocks = () => Object.entries(STOCKS).map(([symbol, details]) => ({
  symbol,
  ...details
}));

module.exports = {
  STOCKS,
  getStock,
  getAllStocks,
};
