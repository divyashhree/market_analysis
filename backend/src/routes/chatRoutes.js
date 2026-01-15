/**
 * Chat Routes - API endpoints for the AI chatbot
 */

const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

// POST /api/chat - Send a message and get a response
router.post('/', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message is too long. Please keep it under 1000 characters.'
      });
    }

    const response = await chatService.chat(message, conversationHistory || []);

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process your message. Please try again.'
    });
  }
});

// GET /api/chat/suggestions - Get suggested questions
router.get('/suggestions', (req, res) => {
  try {
    const suggestions = chatService.getSuggestedQuestions();
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    });
  }
});

// GET /api/chat/context - Get current data context (for debugging)
router.get('/context', async (req, res) => {
  try {
    const context = await chatService.buildDataContext();
    res.json({
      success: true,
      data: context
    });
  } catch (error) {
    console.error('Error getting context:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get context'
    });
  }
});

module.exports = router;
