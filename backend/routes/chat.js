const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

// POST /api/chat/message - Send a message to Bob
router.post('/message', async (req, res) => {
  try {
    const { message, codeContext, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatService.chat(message, codeContext || '', chatHistory || []);
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message
    });
  }
});

// POST /api/chat/explain - Explain code
router.post('/explain', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const explanation = await chatService.explainCode(code, language || 'javascript');
    res.json({ explanation });
  } catch (error) {
    console.error('Code explanation error:', error);
    res.status(500).json({
      error: 'Failed to explain code',
      message: error.message
    });
  }
});

module.exports = router;

// Made with Bob