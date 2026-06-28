const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Default admin credentials (in production, use database)
const ADMIN_CREDENTIALS = {
  email: 'admin@xayara.com',
  password: 'admin123' // Change this in production
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple admin login (in production, use database)
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET || 'xayara_default_secret_key',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: { email, role: 'admin' }
      });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    // For now, registration is disabled for security
    res.status(403).json({ message: 'Registration is disabled. Contact administrator.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
