/**
 * Multi-Country Configuration
 * Contains official data sources and identifiers for 30+ countries
 * 
 * Data Sources:
 * - World Bank API (https://data.worldbank.org/) - CPI/Inflation data
 * - Yahoo Finance - Stock indices and currency exchange rates
 * - IMF (https://www.imf.org/) - Economic indicators reference
 * - OECD (https://data.oecd.org/) - Economic data reference
 */

const countries = {
  // ============ NORTH AMERICA ============
  US: {
    name: 'United States',
    code: 'US',
    region: 'North America',
    currency: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$'
    },
    stockIndex: {
      name: 'S&P 500',
      yahooSymbol: '^GSPC',
      description: 'Standard & Poor\'s 500 Index'
    },
    exchangeRate: {
      pair: 'USDUSD',
      yahooSymbol: null, // Base currency
      description: 'Base currency (USD)'
    },
    worldBankCode: 'USA',
    flag: '🇺🇸',
    gdpRank: 1
  },
  
  CA: {
    name: 'Canada',
    code: 'CA',
    region: 'North America',
    currency: {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$'
    },
    stockIndex: {
      name: 'S&P/TSX Composite',
      yahooSymbol: '^GSPTSE',
      description: 'Toronto Stock Exchange Composite Index'
    },
    exchangeRate: {
      pair: 'USDCAD',
      yahooSymbol: 'CAD=X',
      description: 'USD to Canadian Dollar'
    },
    worldBankCode: 'CAN',
    flag: '🇨🇦',
    gdpRank: 9
  },

  MX: {
    name: 'Mexico',
    code: 'MX',
    region: 'North America',
    currency: {
      code: 'MXN',
      name: 'Mexican Peso',
      symbol: 'MX$'
    },
    stockIndex: {
      name: 'IPC Mexico',
      yahooSymbol: '^MXX',
      description: 'Índice de Precios y Cotizaciones'
    },
    exchangeRate: {
      pair: 'USDMXN',
      yahooSymbol: 'MXN=X',
      description: 'USD to Mexican Peso'
    },
    worldBankCode: 'MEX',
    flag: '🇲🇽',
    gdpRank: 14
  },

  // ============ EUROPE ============
  GB: {
    name: 'United Kingdom',
    code: 'GB',
    region: 'Europe',
    currency: {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£'
    },
    stockIndex: {
      name: 'FTSE 100',
      yahooSymbol: '^FTSE',
      description: 'Financial Times Stock Exchange 100 Index'
    },
    exchangeRate: {
      pair: 'USDGBP',
      yahooSymbol: 'GBP=X',
      description: 'USD to British Pound'
    },
    worldBankCode: 'GBR',
    flag: '🇬🇧',
    gdpRank: 6
  },

  DE: {
    name: 'Germany',
    code: 'DE',
    region: 'Europe',
    currency: {
      code: 'EUR',
      name: 'Euro',
      symbol: '€'
    },
    stockIndex: {
      name: 'DAX',
      yahooSymbol: '^GDAXI',
      description: 'Deutscher Aktienindex'
    },
    exchangeRate: {
      pair: 'USDEUR',
      yahooSymbol: 'EUR=X',
      description: 'USD to Euro'
    },
    worldBankCode: 'DEU',
    flag: '🇩🇪',
    gdpRank: 3
  },

  FR: {
    name: 'France',
    code: 'FR',
    region: 'Europe',
    currency: {
      code: 'EUR',
      name: 'Euro',
      symbol: '€'
    },
    stockIndex: {
      name: 'CAC 40',
      yahooSymbol: '^FCHI',
      description: 'Cotation Assistée en Continu 40'
    },
    exchangeRate: {
      pair: 'USDEUR',
      yahooSymbol: 'EUR=X',
      description: 'USD to Euro'
    },
    worldBankCode: 'FRA',
    flag: '🇫🇷',
    gdpRank: 7
  },

  IT: {
    name: 'Italy',
    code: 'IT',
    region: 'Europe',
    currency: {
      code: 'EUR',
      name: 'Euro',
      symbol: '€'
    },
    stockIndex: {
      name: 'FTSE MIB',
      yahooSymbol: 'FTSEMIB.MI',
      description: 'Milano Italia Borsa'
    },
    exchangeRate: {
      pair: 'USDEUR',
      yahooSymbol: 'EUR=X',
      description: 'USD to Euro'
    },
    worldBankCode: 'ITA',
    flag: '🇮🇹',
    gdpRank: 8
  },

  ES: {
    name: 'Spain',
    code: 'ES',
    region: 'Europe',
    currency: {
      code: 'EUR',
      name: 'Euro',
      symbol: '€'
    },
    stockIndex: {
      name: 'IBEX 35',
      yahooSymbol: '^IBEX',
      description: 'Índice Bursátil Español'
    },
    exchangeRate: {
      pair: 'USDEUR',
      yahooSymbol: 'EUR=X',
      description: 'USD to Euro'
    },
    worldBankCode: 'ESP',
    flag: '🇪🇸',
    gdpRank: 15
  },

  NL: {
    name: 'Netherlands',
    code: 'NL',
    region: 'Europe',
    currency: {
      code: 'EUR',
      name: 'Euro',
      symbol: '€'
    },
    stockIndex: {
      name: 'AEX',
      yahooSymbol: '^AEX',
      description: 'Amsterdam Exchange Index'
    },
    exchangeRate: {
      pair: 'USDEUR',
      yahooSymbol: 'EUR=X',
      description: 'USD to Euro'
    },
    worldBankCode: 'NLD',
    flag: '🇳🇱',
    gdpRank: 17
  },

  CH: {
    name: 'Switzerland',
    code: 'CH',
    region: 'Europe',
    currency: {
      code: 'CHF',
      name: 'Swiss Franc',
      symbol: 'CHF'
    },
    stockIndex: {
      name: 'SMI',
      yahooSymbol: '^SSMI',
      description: 'Swiss Market Index'
    },
    exchangeRate: {
      pair: 'USDCHF',
      yahooSymbol: 'CHF=X',
      description: 'USD to Swiss Franc'
    },
    worldBankCode: 'CHE',
    flag: '🇨🇭',
    gdpRank: 20
  },

  SE: {
    name: 'Sweden',
    code: 'SE',
    region: 'Europe',
    currency: {
      code: 'SEK',
      name: 'Swedish Krona',
      symbol: 'kr'
    },
    stockIndex: {
      name: 'OMX Stockholm 30',
      yahooSymbol: '^OMX',
      description: 'Stockholm Stock Exchange 30 Index'
    },
    exchangeRate: {
      pair: 'USDSEK',
      yahooSymbol: 'SEK=X',
      description: 'USD to Swedish Krona'
    },
    worldBankCode: 'SWE',
    flag: '🇸🇪',
    gdpRank: 23
  },

  PL: {
    name: 'Poland',
    code: 'PL',
    region: 'Europe',
    currency: {
      code: 'PLN',
      name: 'Polish Zloty',
      symbol: 'zł'
    },
    stockIndex: {
      name: 'WIG20',
      yahooSymbol: 'WIG20.WA',
      description: 'Warsaw Stock Exchange 20 Index'
    },
    exchangeRate: {
      pair: 'USDPLN',
      yahooSymbol: 'PLN=X',
      description: 'USD to Polish Zloty'
    },
    worldBankCode: 'POL',
    flag: '🇵🇱',
    gdpRank: 22
  },

  // ============ ASIA-PACIFIC ============
  CN: {
    name: 'China',
    code: 'CN',
    region: 'Asia-Pacific',
    currency: {
      code: 'CNY',
      name: 'Chinese Yuan',
      symbol: '¥'
    },
    stockIndex: {
      name: 'Shanghai Composite',
      yahooSymbol: '000001.SS',
      description: 'Shanghai Stock Exchange Composite Index'
    },
    exchangeRate: {
      pair: 'USDCNY',
      yahooSymbol: 'CNY=X',
      description: 'USD to Chinese Yuan'
    },
    worldBankCode: 'CHN',
    flag: '🇨🇳',
    gdpRank: 2
  },

  JP: {
    name: 'Japan',
    code: 'JP',
    region: 'Asia-Pacific',
    currency: {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥'
    },
    stockIndex: {
      name: 'Nikkei 225',
      yahooSymbol: '^N225',
      description: 'Nikkei 225 Stock Average'
    },
    exchangeRate: {
      pair: 'USDJPY',
      yahooSymbol: 'JPY=X',
      description: 'USD to Japanese Yen'
    },
    worldBankCode: 'JPN',
    flag: '🇯🇵',
    gdpRank: 4
  },

  IN: {
    name: 'India',
    code: 'IN',
    region: 'Asia-Pacific',
    currency: {
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹'
    },
    stockIndex: {
      name: 'NIFTY 50',
      yahooSymbol: '^NSEI',
      description: 'National Stock Exchange Fifty'
    },
    exchangeRate: {
      pair: 'USDINR',
      yahooSymbol: 'INR=X',
      description: 'USD to Indian Rupee'
    },
    worldBankCode: 'IND',
    flag: '🇮🇳',
    gdpRank: 5
  },

  KR: {
    name: 'South Korea',
    code: 'KR',
    region: 'Asia-Pacific',
    currency: {
      code: 'KRW',
      name: 'South Korean Won',
      symbol: '₩'
    },
    stockIndex: {
      name: 'KOSPI',
      yahooSymbol: '^KS11',
      description: 'Korea Composite Stock Price Index'
    },
    exchangeRate: {
      pair: 'USDKRW',
      yahooSymbol: 'KRW=X',
      description: 'USD to South Korean Won'
    },
    worldBankCode: 'KOR',
    flag: '🇰🇷',
    gdpRank: 13
  },

  AU: {
    name: 'Australia',
    code: 'AU',
    region: 'Asia-Pacific',
    currency: {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$'
    },
    stockIndex: {
      name: 'ASX 200',
      yahooSymbol: '^AXJO',
      description: 'S&P/ASX 200'
    },
    exchangeRate: {
      pair: 'USDAUD',
      yahooSymbol: 'AUD=X',
      description: 'USD to Australian Dollar'
    },
    worldBankCode: 'AUS',
    flag: '🇦🇺',
    gdpRank: 12
  },

  SG: {
    name: 'Singapore',
    code: 'SG',
    region: 'Asia-Pacific',
    currency: {
      code: 'SGD',
      name: 'Singapore Dollar',
      symbol: 'S$'
    },
    stockIndex: {
      name: 'STI',
      yahooSymbol: '^STI',
      description: 'Straits Times Index'
    },
    exchangeRate: {
      pair: 'USDSGD',
      yahooSymbol: 'SGD=X',
      description: 'USD to Singapore Dollar'
    },
    worldBankCode: 'SGP',
    flag: '🇸🇬',
    gdpRank: 34
  },

  HK: {
    name: 'Hong Kong',
    code: 'HK',
    region: 'Asia-Pacific',
    currency: {
      code: 'HKD',
      name: 'Hong Kong Dollar',
      symbol: 'HK$'
    },
    stockIndex: {
      name: 'Hang Seng',
      yahooSymbol: '^HSI',
      description: 'Hang Seng Index'
    },
    exchangeRate: {
      pair: 'USDHKD',
      yahooSymbol: 'HKD=X',
      description: 'USD to Hong Kong Dollar'
    },
    worldBankCode: 'HKG',
    flag: '🇭🇰',
    gdpRank: 35
  },

  TW: {
    name: 'Taiwan',
    code: 'TW',
    region: 'Asia-Pacific',
    currency: {
      code: 'TWD',
      name: 'New Taiwan Dollar',
      symbol: 'NT$'
    },
    stockIndex: {
      name: 'TAIEX',
      yahooSymbol: '^TWII',
      description: 'Taiwan Capitalization Weighted Stock Index'
    },
    exchangeRate: {
      pair: 'USDTWD',
      yahooSymbol: 'TWD=X',
      description: 'USD to New Taiwan Dollar'
    },
    worldBankCode: 'TWN',
    flag: '🇹🇼',
    gdpRank: 21
  },

  ID: {
    name: 'Indonesia',
    code: 'ID',
    region: 'Asia-Pacific',
    currency: {
      code: 'IDR',
      name: 'Indonesian Rupiah',
      symbol: 'Rp'
    },
    stockIndex: {
      name: 'IDX Composite',
      yahooSymbol: '^JKSE',
      description: 'Jakarta Stock Exchange Composite'
    },
    exchangeRate: {
      pair: 'USDIDR',
      yahooSymbol: 'IDR=X',
      description: 'USD to Indonesian Rupiah'
    },
    worldBankCode: 'IDN',
    flag: '🇮🇩',
    gdpRank: 16
  },

  TH: {
    name: 'Thailand',
    code: 'TH',
    region: 'Asia-Pacific',
    currency: {
      code: 'THB',
      name: 'Thai Baht',
      symbol: '฿'
    },
    stockIndex: {
      name: 'SET Index',
      yahooSymbol: '^SET.BK',
      description: 'Stock Exchange of Thailand Index'
    },
    exchangeRate: {
      pair: 'USDTHB',
      yahooSymbol: 'THB=X',
      description: 'USD to Thai Baht'
    },
    worldBankCode: 'THA',
    flag: '🇹🇭',
    gdpRank: 26
  },

  MY: {
    name: 'Malaysia',
    code: 'MY',
    region: 'Asia-Pacific',
    currency: {
      code: 'MYR',
      name: 'Malaysian Ringgit',
      symbol: 'RM'
    },
    stockIndex: {
      name: 'KLCI',
      yahooSymbol: '^KLSE',
      description: 'FTSE Bursa Malaysia KLCI'
    },
    exchangeRate: {
      pair: 'USDMYR',
      yahooSymbol: 'MYR=X',
      description: 'USD to Malaysian Ringgit'
    },
    worldBankCode: 'MYS',
    flag: '🇲🇾',
    gdpRank: 36
  },

  PH: {
    name: 'Philippines',
    code: 'PH',
    region: 'Asia-Pacific',
    currency: {
      code: 'PHP',
      name: 'Philippine Peso',
      symbol: '₱'
    },
    stockIndex: {
      name: 'PSEi',
      yahooSymbol: 'PSEI.PS',
      description: 'Philippine Stock Exchange Index'
    },
    exchangeRate: {
      pair: 'USDPHP',
      yahooSymbol: 'PHP=X',
      description: 'USD to Philippine Peso'
    },
    worldBankCode: 'PHL',
    flag: '🇵🇭',
    gdpRank: 32
  },

  VN: {
    name: 'Vietnam',
    code: 'VN',
    region: 'Asia-Pacific',
    currency: {
      code: 'VND',
      name: 'Vietnamese Dong',
      symbol: '₫'
    },
    stockIndex: {
      name: 'VN-Index',
      yahooSymbol: '^VNINDEX',
      description: 'Vietnam Stock Index'
    },
    exchangeRate: {
      pair: 'USDVND',
      yahooSymbol: 'VND=X',
      description: 'USD to Vietnamese Dong'
    },
    worldBankCode: 'VNM',
    flag: '🇻🇳',
    gdpRank: 37
  },

  NZ: {
    name: 'New Zealand',
    code: 'NZ',
    region: 'Asia-Pacific',
    currency: {
      code: 'NZD',
      name: 'New Zealand Dollar',
      symbol: 'NZ$'
    },
    stockIndex: {
      name: 'NZX 50',
      yahooSymbol: '^NZ50',
      description: 'New Zealand Stock Exchange 50'
    },
    exchangeRate: {
      pair: 'USDNZD',
      yahooSymbol: 'NZD=X',
      description: 'USD to New Zealand Dollar'
    },
    worldBankCode: 'NZL',
    flag: '🇳🇿',
    gdpRank: 51
  },

  // ============ MIDDLE EAST ============
  SA: {
    name: 'Saudi Arabia',
    code: 'SA',
    region: 'Middle East',
    currency: {
      code: 'SAR',
      name: 'Saudi Riyal',
      symbol: '﷼'
    },
    stockIndex: {
      name: 'Tadawul All Share',
      yahooSymbol: '^TASI.SR',
      description: 'Saudi Stock Exchange Index'
    },
    exchangeRate: {
      pair: 'USDSAR',
      yahooSymbol: 'SAR=X',
      description: 'USD to Saudi Riyal'
    },
    worldBankCode: 'SAU',
    flag: '🇸🇦',
    gdpRank: 18
  },

  AE: {
    name: 'United Arab Emirates',
    code: 'AE',
    region: 'Middle East',
    currency: {
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ'
    },
    stockIndex: {
      name: 'DFM General',
      yahooSymbol: '^DFMGI',
      description: 'Dubai Financial Market General Index'
    },
    exchangeRate: {
      pair: 'USDAED',
      yahooSymbol: 'AED=X',
      description: 'USD to UAE Dirham'
    },
    worldBankCode: 'ARE',
    flag: '🇦🇪',
    gdpRank: 31
  },

  IL: {
    name: 'Israel',
    code: 'IL',
    region: 'Middle East',
    currency: {
      code: 'ILS',
      name: 'Israeli Shekel',
      symbol: '₪'
    },
    stockIndex: {
      name: 'TA-35',
      yahooSymbol: '^TA35.TA',
      description: 'Tel Aviv 35 Index'
    },
    exchangeRate: {
      pair: 'USDILS',
      yahooSymbol: 'ILS=X',
      description: 'USD to Israeli Shekel'
    },
    worldBankCode: 'ISR',
    flag: '🇮🇱',
    gdpRank: 29
  },

  TR: {
    name: 'Turkey',
    code: 'TR',
    region: 'Middle East',
    currency: {
      code: 'TRY',
      name: 'Turkish Lira',
      symbol: '₺'
    },
    stockIndex: {
      name: 'BIST 100',
      yahooSymbol: 'XU100.IS',
      description: 'Borsa Istanbul 100 Index'
    },
    exchangeRate: {
      pair: 'USDTRY',
      yahooSymbol: 'TRY=X',
      description: 'USD to Turkish Lira'
    },
    worldBankCode: 'TUR',
    flag: '🇹🇷',
    gdpRank: 19
  },

  // ============ SOUTH AMERICA ============
  BR: {
    name: 'Brazil',
    code: 'BR',
    region: 'South America',
    currency: {
      code: 'BRL',
      name: 'Brazilian Real',
      symbol: 'R$'
    },
    stockIndex: {
      name: 'Bovespa',
      yahooSymbol: '^BVSP',
      description: 'B3 Bovespa Index'
    },
    exchangeRate: {
      pair: 'USDBRL',
      yahooSymbol: 'BRL=X',
      description: 'USD to Brazilian Real'
    },
    worldBankCode: 'BRA',
    flag: '🇧🇷',
    gdpRank: 10
  },

  AR: {
    name: 'Argentina',
    code: 'AR',
    region: 'South America',
    currency: {
      code: 'ARS',
      name: 'Argentine Peso',
      symbol: '$'
    },
    stockIndex: {
      name: 'MERVAL',
      yahooSymbol: '^MERV',
      description: 'Buenos Aires Stock Exchange Index'
    },
    exchangeRate: {
      pair: 'USDARS',
      yahooSymbol: 'ARS=X',
      description: 'USD to Argentine Peso'
    },
    worldBankCode: 'ARG',
    flag: '🇦🇷',
    gdpRank: 25
  },

  CL: {
    name: 'Chile',
    code: 'CL',
    region: 'South America',
    currency: {
      code: 'CLP',
      name: 'Chilean Peso',
      symbol: '$'
    },
    stockIndex: {
      name: 'IPSA',
      yahooSymbol: '^IPSA',
      description: 'Santiago Stock Exchange IPSA'
    },
    exchangeRate: {
      pair: 'USDCLP',
      yahooSymbol: 'CLP=X',
      description: 'USD to Chilean Peso'
    },
    worldBankCode: 'CHL',
    flag: '🇨🇱',
    gdpRank: 42
  },

  CO: {
    name: 'Colombia',
    code: 'CO',
    region: 'South America',
    currency: {
      code: 'COP',
      name: 'Colombian Peso',
      symbol: '$'
    },
    stockIndex: {
      name: 'COLCAP',
      yahooSymbol: '^COLCAP',
      description: 'Colombia Stock Exchange Index'
    },
    exchangeRate: {
      pair: 'USDCOP',
      yahooSymbol: 'COP=X',
      description: 'USD to Colombian Peso'
    },
    worldBankCode: 'COL',
    flag: '🇨🇴',
    gdpRank: 41
  },

  // ============ AFRICA ============
  ZA: {
    name: 'South Africa',
    code: 'ZA',
    region: 'Africa',
    currency: {
      code: 'ZAR',
      name: 'South African Rand',
      symbol: 'R'
    },
    stockIndex: {
      name: 'JSE All Share',
      yahooSymbol: '^J203.JO',
      description: 'Johannesburg Stock Exchange All Share'
    },
    exchangeRate: {
      pair: 'USDZAR',
      yahooSymbol: 'ZAR=X',
      description: 'USD to South African Rand'
    },
    worldBankCode: 'ZAF',
    flag: '🇿🇦',
    gdpRank: 33
  },

  NG: {
    name: 'Nigeria',
    code: 'NG',
    region: 'Africa',
    currency: {
      code: 'NGN',
      name: 'Nigerian Naira',
      symbol: '₦'
    },
    stockIndex: {
      name: 'NSE All Share',
      yahooSymbol: '^NGSEINDX',
      description: 'Nigerian Stock Exchange All Share'
    },
    exchangeRate: {
      pair: 'USDNGN',
      yahooSymbol: 'NGN=X',
      description: 'USD to Nigerian Naira'
    },
    worldBankCode: 'NGA',
    flag: '🇳🇬',
    gdpRank: 27
  },

  EG: {
    name: 'Egypt',
    code: 'EG',
    region: 'Africa',
    currency: {
      code: 'EGP',
      name: 'Egyptian Pound',
      symbol: 'E£'
    },
    stockIndex: {
      name: 'EGX 30',
      yahooSymbol: '^CASE30',
      description: 'Egyptian Exchange 30 Index'
    },
    exchangeRate: {
      pair: 'USDEGP',
      yahooSymbol: 'EGP=X',
      description: 'USD to Egyptian Pound'
    },
    worldBankCode: 'EGY',
    flag: '🇪🇬',
    gdpRank: 38
  },

  // ============ RUSSIA & CIS ============
  RU: {
    name: 'Russia',
    code: 'RU',
    region: 'Europe',
    currency: {
      code: 'RUB',
      name: 'Russian Ruble',
      symbol: '₽'
    },
    stockIndex: {
      name: 'MOEX Russia',
      yahooSymbol: 'IMOEX.ME',
      description: 'Moscow Exchange Russia Index'
    },
    exchangeRate: {
      pair: 'USDRUB',
      yahooSymbol: 'RUB=X',
      description: 'USD to Russian Ruble'
    },
    worldBankCode: 'RUS',
    flag: '🇷🇺',
    gdpRank: 11
  }
};

// Group countries by region
const getCountriesByRegion = () => {
  const regions = {};
  Object.values(countries).forEach(country => {
    if (!regions[country.region]) {
      regions[country.region] = [];
    }
    regions[country.region].push(country);
  });
  return regions;
};

// Get all country codes
const getCountryCodes = () => Object.keys(countries);

// Get country by code
const getCountry = (code) => countries[code] || null;

// Get countries sorted by GDP rank
const getCountriesByGDP = () => {
  return Object.values(countries).sort((a, b) => a.gdpRank - b.gdpRank);
};

// World Bank API indicators
const WORLD_BANK_INDICATORS = {
  CPI: 'FP.CPI.TOTL',                    // Consumer Price Index
  INFLATION: 'FP.CPI.TOTL.ZG',           // Inflation rate (annual %)
  GDP: 'NY.GDP.MKTP.CD',                 // GDP (current US$)
  GDP_GROWTH: 'NY.GDP.MKTP.KD.ZG',       // GDP growth (annual %)
  GDP_PER_CAPITA: 'NY.GDP.PCAP.CD',      // GDP per capita (current US$)
  UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',        // Unemployment rate
  TRADE_BALANCE: 'NE.RSB.GNFS.ZS',       // Trade balance (% of GDP)
  INTEREST_RATE: 'FR.INR.RINR',          // Real interest rate
  FOREX_RESERVES: 'FI.RES.TOTL.CD',      // Total reserves
  CURRENT_ACCOUNT: 'BN.CAB.XOKA.CD',     // Current account balance
};

module.exports = {
  countries,
  getCountriesByRegion,
  getCountryCodes,
  getCountry,
  getCountriesByGDP,
  WORLD_BANK_INDICATORS
};
