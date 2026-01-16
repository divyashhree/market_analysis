/**
 * WebSocket Service for Real-time Updates
 * Provides live market data, alerts, and social interactions
 */

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const countryDataService = require('./countryDataService');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // userId -> ws connection
    this.marketData = new Map(); // Store latest market data
    this.updateInterval = null;
    this.alertsHistory = [];
    this.activityFeed = [];
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server, path: '/ws' });
    
    this.wss.on('connection', (ws, req) => {
      const userId = uuidv4();
      const userAgent = req.headers['user-agent'] || 'Unknown';
      
      this.clients.set(userId, {
        ws,
        userId,
        connectedAt: new Date(),
        userAgent,
        watchlist: ['US', 'IN', 'GB', 'JP', 'DE'],
        preferences: {}
      });

      console.log(`🔌 Client connected: ${userId} (Total: ${this.clients.size})`);

      // Send welcome message with user info
      this.send(ws, {
        type: 'connected',
        userId,
        timestamp: new Date().toISOString(),
        activeUsers: this.clients.size,
        message: 'Connected to Global Market Analyzer real-time feed'
      });

      // Send recent activity
      this.send(ws, {
        type: 'activityFeed',
        data: this.activityFeed.slice(-20)
      });

      // Broadcast user joined
      this.broadcastActivity({
        type: 'user_joined',
        message: `A new analyst joined the platform`,
        timestamp: new Date().toISOString()
      });

      // Handle incoming messages
      ws.on('message', (message) => this.handleMessage(userId, message));

      // Handle disconnection
      ws.on('close', () => {
        this.clients.delete(userId);
        console.log(`🔌 Client disconnected: ${userId} (Total: ${this.clients.size})`);
        this.broadcast({
          type: 'userCount',
          count: this.clients.size
        });
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for ${userId}:`, error.message);
      });
    });

    // Start real-time data updates
    this.startMarketUpdates();
    
    console.log('✅ WebSocket server initialized');
  }

  handleMessage(userId, rawMessage) {
    try {
      const message = JSON.parse(rawMessage);
      const client = this.clients.get(userId);
      if (!client) return;

      switch (message.type) {
        case 'subscribe':
          // Subscribe to specific country updates
          if (message.countries && Array.isArray(message.countries)) {
            client.watchlist = message.countries;
            this.send(client.ws, {
              type: 'subscribed',
              countries: client.watchlist
            });
          }
          break;

        case 'comment':
          // Handle user comments on data/charts
          this.handleComment(userId, message);
          break;

        case 'reaction':
          // Handle reactions (likes, etc.)
          this.handleReaction(userId, message);
          break;

        case 'alert_subscribe':
          // Subscribe to price alerts
          if (message.alert) {
            client.alerts = client.alerts || [];
            client.alerts.push(message.alert);
            this.send(client.ws, {
              type: 'alert_subscribed',
              alert: message.alert
            });
          }
          break;

        case 'ping':
          this.send(client.ws, { type: 'pong', timestamp: Date.now() });
          break;

        case 'get_predictions':
          this.sendPredictions(client.ws, message.country);
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  handleComment(userId, message) {
    const comment = {
      id: uuidv4(),
      userId,
      country: message.country,
      indicator: message.indicator,
      text: message.text,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    // Store and broadcast
    this.broadcastActivity({
      type: 'new_comment',
      comment,
      message: `Someone commented on ${message.country} ${message.indicator}`
    });
  }

  handleReaction(userId, message) {
    this.broadcastActivity({
      type: 'reaction',
      userId,
      targetId: message.targetId,
      reactionType: message.reactionType,
      country: message.country,
      message: `Analyst reacted to ${message.country} analysis`
    });
  }

  async sendPredictions(ws, countryCode) {
    // Generate simple trend-based predictions
    const predictions = this.generatePredictions(countryCode);
    this.send(ws, {
      type: 'predictions',
      country: countryCode,
      data: predictions
    });
  }

  generatePredictions(countryCode) {
    // Simple prediction algorithm based on trends
    const now = new Date();
    const predictions = [];
    
    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(now);
      futureDate.setMonth(futureDate.getMonth() + i);
      
      // Random walk with trend
      const baseTrend = Math.random() > 0.5 ? 1 : -1;
      const volatility = Math.random() * 2;
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        inflationPrediction: 3 + baseTrend * volatility,
        stockPrediction: baseTrend * (2 + volatility),
        confidence: Math.max(0.5, 0.9 - (i * 0.1))
      });
    }
    
    return predictions;
  }

  startMarketUpdates() {
    // Simulate real-time market updates every 30 seconds
    this.updateInterval = setInterval(() => {
      this.sendMarketUpdate();
    }, 30000);

    // Send initial update
    setTimeout(() => this.sendMarketUpdate(), 5000);
  }

  async sendMarketUpdate() {
    try {
      // Generate simulated real-time data changes
      const updates = this.generateMarketUpdates();
      
      // Broadcast to all clients
      this.broadcast({
        type: 'marketUpdate',
        timestamp: new Date().toISOString(),
        data: updates
      });

      // Check for alerts
      this.checkAlerts(updates);
    } catch (error) {
      console.error('Error sending market update:', error);
    }
  }

  generateMarketUpdates() {
    const countries = ['US', 'IN', 'GB', 'JP', 'DE', 'CN', 'FR', 'BR'];
    const updates = {};

    countries.forEach(code => {
      const change = (Math.random() - 0.5) * 2; // -1% to +1%
      const stockChange = (Math.random() - 0.5) * 4; // -2% to +2%
      
      updates[code] = {
        stockChange: parseFloat(stockChange.toFixed(2)),
        stockTrend: stockChange > 0 ? 'up' : stockChange < 0 ? 'down' : 'stable',
        currencyChange: parseFloat(change.toFixed(3)),
        volume: Math.floor(Math.random() * 1000000),
        lastUpdate: new Date().toISOString()
      };
    });

    return updates;
  }

  checkAlerts(updates) {
    this.clients.forEach((client, userId) => {
      if (!client.alerts) return;
      
      client.alerts.forEach(alert => {
        const update = updates[alert.country];
        if (!update) return;

        let triggered = false;
        let message = '';

        if (alert.type === 'stock_change' && Math.abs(update.stockChange) >= alert.threshold) {
          triggered = true;
          message = `${alert.country} stock ${update.stockChange > 0 ? 'surged' : 'dropped'} by ${Math.abs(update.stockChange)}%!`;
        }

        if (triggered) {
          const alertNotification = {
            id: uuidv4(),
            type: 'alert_triggered',
            alert,
            message,
            timestamp: new Date().toISOString()
          };
          
          this.send(client.ws, alertNotification);
          this.alertsHistory.push(alertNotification);
        }
      });
    });
  }

  broadcastActivity(activity) {
    activity.id = uuidv4();
    activity.timestamp = activity.timestamp || new Date().toISOString();
    
    this.activityFeed.push(activity);
    
    // Keep only last 100 activities
    if (this.activityFeed.length > 100) {
      this.activityFeed = this.activityFeed.slice(-100);
    }

    this.broadcast({
      type: 'activity',
      data: activity
    });
  }

  broadcast(data) {
    const message = JSON.stringify(data);
    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }

  send(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  getActiveUsersCount() {
    return this.clients.size;
  }

  getRecentActivity() {
    return this.activityFeed.slice(-20);
  }

  shutdown() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.wss) {
      this.wss.close();
    }
  }
}

module.exports = new WebSocketService();
