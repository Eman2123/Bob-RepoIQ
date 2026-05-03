const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// Sign up endpoint
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name, email, and password are required' 
      });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email',
        message: 'Please provide a valid email address' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Weak password',
        message: 'Password must be at least 6 characters long' 
      });
    }

    const result = await authService.signUp(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    console.error('Signup error:', error);
    if (error.message === 'User already exists') {
      return res.status(409).json({ 
        error: 'User exists',
        message: 'An account with this email already exists' 
      });
    }
    res.status(500).json({ 
      error: 'Signup failed',
      message: 'Failed to create account. Please try again.' 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'Email and password are required' 
      });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Invalid email or password' 
      });
    }
    res.status(500).json({ 
      error: 'Login failed',
      message: 'Failed to sign in. Please try again.' 
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token',
        message: 'Authentication token is required' 
      });
    }

    const user = await authService.verifyToken(token);
    res.json({ valid: true, user });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      valid: false,
      error: 'Invalid token',
      message: 'Authentication token is invalid or expired' 
    });
  }
});

module.exports = router;

// Made with Bob