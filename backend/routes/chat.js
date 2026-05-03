const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

// POST /api/chat - Send a message to Bob
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatService.chat(message, context);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      message: error.message 
    });
  }
});

module.exports = router;

// Made with Bob