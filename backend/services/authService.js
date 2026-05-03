const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user storage (replace with database in production)
const users = new Map();

// JWT secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

class AuthService {
  async signUp(name, email, password) {
    // Check if user already exists
    if (users.has(email.toLowerCase())) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const user = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Store user
    users.set(email.toLowerCase(), user);

    // Generate token
    const token = this.generateToken(user);

    // Return user data without password
    return {
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    };
  }

  async login(email, password) {
    // Find user
    const user = users.get(email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    // Return user data without password
    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users.get(decoded.email);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  // Helper method to get all users (for debugging, remove in production)
  getAllUsers() {
    return Array.from(users.values()).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }));
  }
}

module.exports = new AuthService();

// Made with Bob