const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dataRoutes = require('./routes/dataRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const countryRoutes = require('./routes/countryRoutes');
const chatRoutes = require('./routes/chatRoutes');
const socialRoutes = require('./routes/socialRoutes');
const stockRoutes = require('./routes/stockRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const educationRoutes = require('./routes/educationRoutes');
const sentimentRoutes = require('./routes/sentimentRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/data', dataRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/sentiment', sentimentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🌍 Global Market Analyzer API',
    version: '2.1.0',
    endpoints: {
      data: '/api/data',
      analysis: '/api/analysis',
      countries: '/api/countries',
      chat: '/api/chat',
      social: '/api/social',
      stocks: '/api/stocks',
      health: '/health'
    },
    features: [
      '🌍 Multi-country comparison (35+ countries)',
      '📊 Global inflation tracking with World Bank data',
      '📈 Stock market indices from major exchanges',
      '💱 Currency exchange rates via Yahoo Finance',
      '🗺️ Regional economic analysis',
      '🤖 AI-powered economic insights chatbot',
      '🔌 Real-time WebSocket updates',
      '💬 Social features (comments, reactions, insights)',
      '📢 Market alerts and predictions',
      '👥 Community activity feed'
    ],
    websocket: 'ws://localhost:5000/ws'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
