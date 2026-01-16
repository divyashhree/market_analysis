/**
 * Social Routes - API endpoints for social features
 */

const express = require('express');
const router = express.Router();
const socialService = require('../services/socialService');
const websocketService = require('../services/websocketService');

// Get recent activity feed
router.get('/activity', (req, res) => {
  try {
    const activity = websocketService.getRecentActivity();
    res.json({
      success: true,
      data: activity,
      activeUsers: websocketService.getActiveUsersCount()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get or create user profile
router.get('/profile/:userId', (req, res) => {
  try {
    const user = socialService.getOrCreateUser(req.params.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user stats
router.get('/stats/:userId', (req, res) => {
  try {
    const stats = socialService.getUserStats(req.params.userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Post a comment
router.post('/comments', (req, res) => {
  try {
    const { userId, country, indicator, text, pageId } = req.body;
    
    if (!userId || !text) {
      return res.status(400).json({ success: false, error: 'userId and text are required' });
    }

    const comment = socialService.addComment(userId, { country, indicator, text, pageId });
    
    // Broadcast via WebSocket
    websocketService.broadcastActivity({
      type: 'new_comment',
      comment,
      message: `New analysis shared on ${country || 'global'} ${indicator || ''}`
    });

    res.json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get comments
router.get('/comments', (req, res) => {
  try {
    const { country, indicator, limit } = req.query;
    const comments = socialService.getComments(country, indicator, parseInt(limit) || 50);
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all recent comments
router.get('/comments/recent', (req, res) => {
  try {
    const { limit } = req.query;
    const comments = socialService.getAllRecentComments(parseInt(limit) || 30);
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a reaction
router.post('/reactions', (req, res) => {
  try {
    const { userId, targetId, reactionType } = req.body;
    
    if (!userId || !targetId) {
      return res.status(400).json({ success: false, error: 'userId and targetId are required' });
    }

    const result = socialService.addReaction(userId, targetId, reactionType || 'like');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Share an insight
router.post('/insights', (req, res) => {
  try {
    const { userId, title, content, countries, indicators, sentiment } = req.body;
    
    if (!userId || !content) {
      return res.status(400).json({ success: false, error: 'userId and content are required' });
    }

    const insight = socialService.shareInsight(userId, { 
      title, content, countries, indicators, sentiment 
    });

    // Broadcast via WebSocket
    websocketService.broadcastActivity({
      type: 'new_insight',
      insight,
      message: `New market insight shared`
    });

    res.json({ success: true, data: insight });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get insights feed
router.get('/insights', (req, res) => {
  try {
    const { limit, country, sentiment } = req.query;
    const insights = socialService.getInsightsFeed(
      parseInt(limit) || 20,
      { country, sentiment }
    );
    res.json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a discussion
router.post('/discussions', (req, res) => {
  try {
    const { userId, title, content, category, tags } = req.body;
    
    if (!userId || !title || !content) {
      return res.status(400).json({ success: false, error: 'userId, title and content are required' });
    }

    const discussion = socialService.createDiscussion(userId, { 
      title, content, category, tags 
    });

    res.json({ success: true, data: discussion });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get discussions
router.get('/discussions', (req, res) => {
  try {
    const { category, limit } = req.query;
    const discussions = socialService.getDiscussions(category, parseInt(limit) || 20);
    res.json({ success: true, data: discussions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add reply to discussion
router.post('/discussions/:id/reply', (req, res) => {
  try {
    const { userId, content } = req.body;
    
    if (!userId || !content) {
      return res.status(400).json({ success: false, error: 'userId and content are required' });
    }

    const reply = socialService.addReply(userId, req.params.id, content);
    
    if (!reply) {
      return res.status(404).json({ success: false, error: 'Discussion not found' });
    }

    res.json({ success: true, data: reply });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    const { limit } = req.query;
    const leaderboard = socialService.getLeaderboard(parseInt(limit) || 10);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get platform stats
router.get('/platform-stats', (req, res) => {
  try {
    const stats = socialService.getPlatformStats();
    stats.activeConnections = websocketService.getActiveUsersCount();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
