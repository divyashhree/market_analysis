# 🌍 Market Analysis Platform

A comprehensive full-stack web application for analyzing economic indicators, stock markets, and financial trends across **30+ countries worldwide**. This educational platform combines data visualization, portfolio management, market simulation, sentiment analysis, and AI-powered insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Express](https://img.shields.io/badge/Express-4-green)

## 🎯 Project Purpose

This platform is designed for **educational and research purposes** to help students and researchers:
- 📊 Analyze relationships between inflation, stock markets, and currencies
- 🌍 Compare economic indicators across 30+ countries
- 💼 Manage and track investment portfolios
- 🎮 Simulate market scenarios and "what-if" analysis
- 📰 Monitor market sentiment from news sources
- 🤖 Get AI-powered insights and educational content
- 📈 Understand how different economies respond to global events

**⚠️ IMPORTANT DISCLAIMER:** This tool is for educational purposes only and is NOT intended for actual trading, investment advice, or financial decisions.

## 🌐 Supported Countries (30+)

### North America
🇺🇸 United States (S&P 500) • 🇨🇦 Canada (TSX) • 🇲🇽 Mexico (IPC)

### Europe
🇬🇧 United Kingdom (FTSE 100) • 🇩🇪 Germany (DAX) • 🇫🇷 France (CAC 40) • 🇮🇹 Italy (FTSE MIB) • 🇪🇸 Spain (IBEX 35) • 🇳🇱 Netherlands (AEX) • 🇨🇭 Switzerland (SMI) • 🇸🇪 Sweden (OMX 30) • 🇵🇱 Poland (WIG20) • 🇷🇺 Russia (MOEX)

### Asia-Pacific
🇯🇵 Japan (Nikkei 225) • 🇨🇳 China (Shanghai) • 🇮🇳 India (NIFTY 50) • 🇰🇷 South Korea (KOSPI) • 🇦🇺 Australia (ASX 200) • 🇸🇬 Singapore (STI) • 🇭🇰 Hong Kong (Hang Seng) • 🇹🇼 Taiwan (TAIEX) • 🇮🇩 Indonesia (IDX) • 🇹🇭 Thailand (SET) • 🇲🇾 Malaysia (KLCI) • 🇵🇭 Philippines (PSEi) • 🇻🇳 Vietnam (VN-Index) • 🇳🇿 New Zealand (NZX 50)

### Middle East
🇸🇦 Saudi Arabia (Tadawul) • 🇦🇪 UAE (DFM) • 🇮🇱 Israel (TA-35) • 🇹🇷 Turkey (BIST 100)

### South America
🇧🇷 Brazil (Bovespa) • 🇦🇷 Argentina (MERVAL) • 🇨🇱 Chile (IPSA) • 🇨🇴 Colombia (COLCAP)

### Africa
🇿🇦 South Africa (JSE) • 🇳🇬 Nigeria (NSE) • 🇪🇬 Egypt (EGX 30)

## ✨ Core Features

### 📊 Data Visualization & Analysis
- **Interactive Charts** - Real-time line charts, scatter plots, heatmaps, and histograms
- **Multi-Country Comparison** - Compare up to 10 countries simultaneously
- **Correlation Analysis** - Pearson correlation coefficients with visual heatmaps
- **Rolling Correlations** - Track how relationships change over time
- **Moving Averages** - 3, 6, and 12-month technical indicators
- **Statistical Analysis** - Mean, median, standard deviation, volatility metrics
- **Dual-Axis Charts** - Compare different metrics on the same timeline

### 🌍 Global Market Intelligence
- **30+ Countries** - Comprehensive data from major economies worldwide
- **Interactive World Map** - Click countries to view detailed economic data
- **Global Rankings** - Sort by inflation, stock performance, currency strength
- **Regional Comparison** - Analyze trends by continent and economic bloc
- **Country Deep-Dive** - Individual pages with complete economic profiles

### 💼 Portfolio Management
- **Portfolio Builder** - Create and track custom stock portfolios
- **Real-time Valuation** - Monitor portfolio value and performance
- **Sector Allocation** - Visualize diversification across industries
- **Risk Analysis** - Assess macro sensitivities (inflation, interest rates, oil)
- **Performance Metrics** - Track returns, volatility, and Sharpe ratio
- **Custom Alerts** - Get notified about significant market moves

### 🎮 Market Simulator
- **Scenario Analysis** - Test "what-if" market conditions
- **Inflation Impact** - Simulate effects of CPI changes on assets
- **Interest Rate Scenarios** - Model RBI/Fed policy changes
- **Economic Shocks** - Test portfolio resilience to events
- **Backtesting** - Apply historical scenarios to current holdings
- **Confidence Intervals** - Statistical prediction ranges

### 📰 Sentiment & Social Intelligence
- **Live News Feed** - Real-time financial news from major sources
- **Sentiment Analysis** - AI-powered positive/negative/neutral classification
- **Market Ticker** - Live price updates for major indices
- **Social Feed** - Community insights and market discussions
- **Activity Feed** - Track what other users are analyzing
- **Leaderboard** - Top performers and contributors

### 🤖 AI-Powered Features
- **ChatBot Assistant** - Ask questions about economics and markets
- **Auto-Generated Insights** - AI identifies trends and correlations
- **Smart Recommendations** - Personalized learning paths
- **Economic Explainers** - Context-aware educational content
- **Data Interpretation** - Plain-language explanations of complex metrics

### 🎓 Educational Hub
- **Interactive Tutorials** - Learn about inflation, markets, and currencies
- **Quizzes & Tests** - Validate understanding with interactive assessments
- **Concept Library** - Comprehensive glossary of financial terms
- **Case Studies** - Real-world examples and historical events
- **Progress Tracking** - Monitor learning journey

### 🔍 Stock Analysis Tools
- **Stock Search** - Find and analyze individual companies
- **Technical Indicators** - Moving averages, RSI, MACD
- **Fundamental Data** - P/E ratios, market cap, dividend yield
- **Historical Charts** - Detailed price history with events
- **Peer Comparison** - Compare stocks within same sector

### 🎨 User Experience
- **Dark/Light Mode** - Comfortable viewing in any environment
- **Responsive Design** - Seamless on desktop, tablet, and mobile
- **Data Export** - Download charts and data as CSV/PNG
- **Interactive Tables** - Sort, filter, and paginate large datasets
- **Real-time Updates** - WebSocket support for live data
- **Offline Mode** - CSV fallback when APIs are unavailable

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router with React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts (declarative charting library)
- **HTTP Client:** Axios
- **Real-time:** WebSocket support
- **Date Handling:** date-fns
- **State Management:** React Hooks
- **UI Components:** Custom component library

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **WebSockets:** ws (for real-time updates)
- **Data Fetching:** Axios
- **CSV Parsing:** csv-parser
- **Caching:** node-cache (in-memory caching)
- **Environment:** dotenv
- **CORS:** cors middleware

### Data Sources (No API Keys Required for Basic Features!)
- **World Bank API** - Inflation, CPI, GDP data (free, public API)
- **Yahoo Finance** - Stock indices and exchange rates (free scraping)
- **Alpha Vantage** - Alternative stock data source (free tier: 500 calls/day)
- **News RSS Feeds** - Financial news from Economic Times, Moneycontrol
- **CSV Fallback** - Local CSV files for offline operation and reliability

## 🔌 API Endpoints

### Country Data
| Endpoint | Description |
|----------|-------------|
| `GET /api/countries` | List all 30+ supported countries |
| `GET /api/countries/regions` | Get countries grouped by region |
| `GET /api/countries/top-economies` | Get top economies by GDP |
| `GET /api/countries/global/inflation` | Global inflation rankings |
| `GET /api/countries/global/stocks` | Global stock market performance |
| `GET /api/countries/global/currencies` | Currency strength comparison |
| `GET /api/countries/compare?countries=US,GB,DE` | Compare multiple countries |
| `GET /api/countries/:code` | Get comprehensive data for a country |
| `GET /api/countries/:code/inflation` | Get inflation data for a country |
| `GET /api/countries/:code/stock` | Get stock index data |
| `GET /api/countries/:code/currency` | Get exchange rate data |

### India-Specific Data
| Endpoint | Description |
|----------|-------------|
| `GET /api/data/all` | All India data (CPI, USD-INR, NIFTY) |
| `GET /api/data/cpi` | CPI data only |
| `GET /api/data/usdinr` | USD-INR exchange rate |
| `GET /api/data/nifty` | NIFTY 50 index |
| `GET /api/data/range?start=YYYY-MM-DD&end=YYYY-MM-DD` | Filter by date range |

### Analysis & Correlation
| Endpoint | Description |
|----------|-------------|
| `GET /api/analysis/correlations` | Pearson correlation matrix |
| `GET /api/analysis/insights` | Auto-generated market insights |
| `GET /api/analysis/full` | Complete analysis with all metrics |
| `GET /api/analysis/compare?period1Start=...&period1End=...` | Compare time periods |

### Portfolio Management
| Endpoint | Description |
|----------|-------------|
| `GET /api/portfolio` | Get all saved portfolios |
| `POST /api/portfolio` | Create new portfolio |
| `PUT /api/portfolio/:id` | Update portfolio |
| `DELETE /api/portfolio/:id` | Delete portfolio |
| `GET /api/portfolio/:id/analysis` | Get portfolio risk analysis |
| `GET /api/portfolio/:id/performance` | Get performance metrics |

### Market Simulator
| Endpoint | Description |
|----------|-------------|
| `POST /api/simulator/scenario` | Run market simulation |
| `POST /api/simulator/inflation` | Simulate inflation impact |
| `POST /api/simulator/interest-rate` | Simulate rate changes |
| `POST /api/simulator/backtest` | Backtest historical scenarios |

### Sentiment & News
| Endpoint | Description |
|----------|-------------|
| `GET /api/sentiment/news` | Get latest financial news |
| `GET /api/sentiment/analyze` | Analyze news sentiment |
| `GET /api/sentiment/trends` | Get sentiment trends |
| `GET /api/sentiment/alerts` | Get market alerts |

### Stock Data
| Endpoint | Description |
|----------|-------------|
| `GET /api/stocks/search?query=RELIANCE` | Search for stocks |
| `GET /api/stocks/:symbol` | Get stock details |
| `GET /api/stocks/:symbol/history` | Get historical data |
| `GET /api/stocks/:symbol/indicators` | Get technical indicators |
| `GET /api/stocks/trending` | Get trending stocks |

### Social Features
| Endpoint | Description |
|----------|-------------|
| `GET /api/social/feed` | Get activity feed |
| `GET /api/social/insights` | Get user-shared insights |
| `POST /api/social/comment` | Post a comment |
| `GET /api/social/leaderboard` | Get top contributors |

### Educational Content
| Endpoint | Description |
|----------|-------------|
| `GET /api/education/tutorials` | Get all tutorials |
| `GET /api/education/tutorial/:id` | Get specific tutorial |
| `GET /api/education/quizzes` | Get all quizzes |
| `POST /api/education/quiz/:id/submit` | Submit quiz answers |
| `GET /api/education/progress` | Get learning progress |

### AI Chat
| Endpoint | Description |
|----------|-------------|
| `POST /api/chat/message` | Send message to AI assistant |
| `GET /api/chat/history` | Get chat history |
| `DELETE /api/chat/history` | Clear chat history |

## 📁 Project Structure

```
market_analysis/
├── frontend/                        # Next.js 14 TypeScript Frontend
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── global/page.tsx         # Global market comparison
│   │   ├── country/[code]/page.tsx # Country-specific details
│   │   ├── dashboard/page.tsx      # India economic dashboard
│   │   ├── analysis/page.tsx       # Correlation & statistical analysis
│   │   ├── compare/page.tsx        # Period comparison tool
│   │   ├── insights/page.tsx       # AI-generated insights
│   │   ├── portfolio/page.tsx      # Portfolio management
│   │   ├── simulator/page.tsx      # Market scenario simulator
│   │   ├── sentiment/page.tsx      # News & sentiment analysis
│   │   ├── learn/page.tsx          # Educational hub
│   │   ├── dynamics/page.tsx       # Market dynamics visualization
│   │   ├── about/page.tsx          # About & methodology
│   │   ├── layout.tsx              # Root layout with nav
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── charts/                 # Recharts visualizations
│   │   │   ├── LineChartComponent.tsx
│   │   │   ├── LineChartWithMA.tsx
│   │   │   ├── LineChartWithEvents.tsx
│   │   │   ├── MultiCountryChart.tsx
│   │   │   ├── DualAxisChart.tsx
│   │   │   ├── ScatterPlot.tsx
│   │   │   ├── CorrelationHeatmap.tsx
│   │   │   ├── PercentageChangeHeatmap.tsx
│   │   │   ├── RollingCorrelationChart.tsx
│   │   │   └── Histogram.tsx
│   │   ├── country/                # Global market components
│   │   │   ├── CountrySelector.tsx
│   │   │   ├── GlobalRankingTable.tsx
│   │   │   └── InteractiveWorldMap.tsx
│   │   ├── chat/
│   │   │   └── ChatBot.tsx         # AI assistant
│   │   ├── stocks/
│   │   │   ├── StockSearchBar.tsx
│   │   │   └── StockDetails.tsx
│   │   ├── social/
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── InsightsFeed.tsx
│   │   │   ├── Comments.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── MarketTicker.tsx
│   │   │   └── MarketAlerts.tsx
│   │   ├── interactive/
│   │   │   ├── AnimatedGlobeLoader.tsx
│   │   │   ├── AnimatedNumber.tsx
│   │   │   └── ...
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── api.ts                  # API client functions
│   │   ├── types.ts                # TypeScript type definitions
│   │   ├── utils.ts                # Utility functions
│   │   ├── useWebSocket.ts         # WebSocket hook
│   │   └── economicEvents.ts       # Historical events data
│   ├── hooks/
│   │   └── useDebounce.ts          # Debounce hook
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── vercel.json
├── backend/                         # Express.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── countries.js        # 30+ country configurations
│   │   │   └── stocks.js           # Stock symbols & data
│   │   ├── controllers/
│   │   │   ├── dataController.js   # Data endpoint handlers
│   │   │   └── analysisController.js
│   │   ├── services/
│   │   │   ├── dataService.js      # India data fetching
│   │   │   ├── countryDataService.js # Multi-country data
│   │   │   ├── analysisService.js  # Statistical calculations
│   │   │   ├── portfolioService.js # Portfolio management
│   │   │   ├── simulatorService.js # Market simulation
│   │   │   ├── sentimentService.js # News sentiment analysis
│   │   │   ├── socialService.js    # Social features
│   │   │   ├── educationService.js # Learning content
│   │   │   ├── chatService.js      # AI chat integration
│   │   │   ├── websocketService.js # Real-time updates
│   │   │   └── cacheService.js     # Caching layer
│   │   ├── routes/
│   │   │   ├── dataRoutes.js
│   │   │   ├── countryRoutes.js
│   │   │   ├── analysisRoutes.js
│   │   │   ├── portfolioRoutes.js
│   │   │   ├── simulatorRoutes.js
│   │   │   ├── sentimentRoutes.js
│   │   │   ├── socialRoutes.js
│   │   │   ├── stockRoutes.js
│   │   │   ├── educationRoutes.js
│   │   │   └── chatRoutes.js
│   │   ├── data/                   # CSV data files
│   │   │   ├── cpi_data.csv
│   │   │   ├── usdinr_data.csv
│   │   │   ├── nifty_data.csv
│   │   │   └── data_metadata.json
│   │   ├── scripts/
│   │   │   ├── update_csv_data.js  # Data update script
│   │   │   └── README.md
│   │   ├── app.js                  # Express app setup
│   │   └── server.js               # Server entry point
│   ├── package.json
│   └── .env
├── README.md                        # This file
├── QUICKSTART.md                    # Quick start guide
├── API_DOCUMENTATION.md             # Detailed API docs
├── DEPLOYMENT.md                    # Deployment instructions
├── LICENSE
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd macro-market-analyzer
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Backend (.env):
```bash
cd ../backend
cp .env.example .env
# Edit .env if needed (defaults work fine)
```

Frontend (.env.local):
```bash
cd ../frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Running the Application

**Option 1: Run both servers separately**

Terminal 1 - Backend:
```bash
cd backend
npm start        # Production
# or
npm run dev      # Development with nodemon
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option 2: Production build**

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📡 API Documentation

### Data Endpoints

#### Get All Data
```http
GET /api/data/all
```
Returns CPI, USD-INR, and NIFTY 50 data.

#### Get Specific Dataset
```http
GET /api/data/cpi
GET /api/data/usdinr
GET /api/data/nifty
```

#### Get Data by Date Range
```http
GET /api/data/range?start=YYYY-MM-DD&end=YYYY-MM-DD
```
Example: `/api/data/range?start=2020-01-01&end=2023-12-31`

### Analysis Endpoints

#### Get Correlations
```http
GET /api/analysis/correlations
```
Returns Pearson correlation coefficients.

#### Get Insights
```http
GET /api/analysis/insights
```
Returns auto-generated insights.

#### Get Full Analysis
```http
GET /api/analysis/full
```
Returns correlations, statistics, rolling correlations, and insights.

#### Compare Periods
```http
GET /api/analysis/compare?period1Start=2014-01-01&period1End=2019-12-31&period2Start=2020-01-01&period2End=2024-12-31
```

## 📊 Data Methodology

### Data Collection
- **Time Period:** January 2014 - December 2026 (12+ years)
- **Frequency:** Monthly data points (end-of-month values)
- **Sources:** World Bank API, Yahoo Finance, CSV fallback files
- **Update Frequency:** Daily API checks with 1-hour cache

### Statistical Methods

**Pearson Correlation Coefficient:**
```
r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)
```
Measures linear relationship between -1 (perfect negative) and +1 (perfect positive).

**Moving Average (Simple):**
```
MA(n) = (x₁ + x₂ + ... + xₙ) / n
```
Smooths data using 3, 6, and 12-month windows for trend identification.

**Rolling Correlation:**
Calculates correlation over a moving window to track changing relationships.

**Standard Deviation & Volatility:**
```
σ = √(Σ(x - μ)² / N)
CV = (σ / μ) × 100%
```
Measures market volatility and risk metrics.

**Portfolio Risk Analysis:**
- **Beta:** Market sensitivity coefficient
- **Sharpe Ratio:** Risk-adjusted return measure
- **Value at Risk (VaR):** Potential loss estimation
- **Sector Allocation:** Diversification metrics

### Data Quality & Validation
- Automatic outlier detection
- Missing data interpolation
- Data freshness warnings
- Metadata tracking with timestamps
- Graceful API failure handling with CSV fallback

## 🎨 Customization

### Color Scheme
Edit `frontend/tailwind.config.ts`:
```typescript
colors: {
  primary: '#3B82F6',    // Blue
  cpi: '#EF4444',        // Red
  usdinr: '#10B981',     // Green
  nifty: '#3B82F6',      // Blue
}
```

### Date Range
Default: 2014-2024. Modify CSV files or add more data in `backend/src/data/`.

### Cache Duration
Edit `backend/src/services/cacheService.js`:
```javascript
stdTTL: 3600  // Cache TTL in seconds (default: 1 hour)
```

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set build directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=<backend-url>`
5. Deploy

### Backend (Render/Railway)
1. Push code to GitHub
2. Create new web service
3. Set start command: `node src/server.js`
4. Set root directory to `backend`
5. Add environment variables from `.env.example`
6. Deploy

## 🔒 Security & Limitations

### Limitations
- **Correlation ≠ Causation** - Strong correlations don't imply causation
- **Linear Analysis Only** - Non-linear patterns may be missed
- **Historical Data** - Past relationships may not continue
- **Missing Variables** - Many factors affect markets beyond these indicators
- **Monthly Data** - Misses intra-month volatility

### Security
- No authentication required (public tool)
- CORS configured for frontend origin
- Input validation on all endpoints
- Error handling without exposing sensitive data
- Rate limiting recommended for production

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

This is an educational project. Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚠️ Legal Disclaimer

**EDUCATIONAL TOOL - NOT FOR FINANCIAL ADVICE**

This application is designed exclusively for educational and research purposes. It is NOT intended for:
- Trading decisions or investment advice
- Financial planning or wealth management
- Professional financial analysis
- Predicting future market movements

The creators assume NO LIABILITY for any financial decisions made based on this information. Always consult qualified financial professionals before making investment decisions.

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Review the documentation
- Check existing issues for solutions

## 🙏 Acknowledgments

- **Data Sources:** Yahoo Finance, World Bank, Alpha Vantage
- **Frameworks:** Next.js, React, Express.js
- **Visualization:** Recharts library
- **Styling:** Tailwind CSS

---

**Version:** 2.0.0  
**Last Updated:** January 2026  
**Status:** ✅ Production Ready with Advanced Features

Built with ❤️ for education and financial literacy
