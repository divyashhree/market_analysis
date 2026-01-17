const express = require('express');
const router = express.Router();
const sentimentService = require('../services/sentimentService');

/**
 * @route GET /api/sentiment/news
 * @desc Get news feed with sentiment analysis
 */
router.get('/news', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const news = await sentimentService.getNewsFeed({ 
      category, 
      limit: limit ? parseInt(limit) : 10 
    });
    res.json(news);
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Failed to get news' });
  }
});

/**
 * @route GET /api/sentiment/market
 * @desc Get overall market sentiment
 */
router.get('/market', async (req, res) => {
  try {
    const sentiment = await sentimentService.getMarketSentiment();
    res.json(sentiment);
  } catch (error) {
    console.error('Get market sentiment error:', error);
    res.status(500).json({ error: 'Failed to get market sentiment' });
  }
});

/**
 * @route GET /api/sentiment/trend
 * @desc Get sentiment trend over time
 */
router.get('/trend', async (req, res) => {
  try {
    const { days } = req.query;
    const trend = await sentimentService.getSentimentTrend(days ? parseInt(days) : 7);
    res.json(trend);
  } catch (error) {
    console.error('Get sentiment trend error:', error);
    res.status(500).json({ error: 'Failed to get sentiment trend' });
  }
});

/**
 * @route GET /api/sentiment/movers
 * @desc Get key market movers from news
 */
router.get('/movers', async (req, res) => {
  try {
    const movers = await sentimentService.getMarketMovers();
    res.json(movers);
  } catch (error) {
    console.error('Get movers error:', error);
    res.status(500).json({ error: 'Failed to get market movers' });
  }
});

/**
 * @route GET /api/sentiment/alerts
 * @desc Get sentiment-based alerts
 */
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await sentimentService.getSentimentAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

/**
 * @route POST /api/sentiment/analyze
 * @desc Analyze sentiment of custom text
 */
router.post('/analyze', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const analysis = sentimentService.analyzeSentiment(text);
    res.json(analysis);
  } catch (error) {
    console.error('Analyze sentiment error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

module.exports = router;
