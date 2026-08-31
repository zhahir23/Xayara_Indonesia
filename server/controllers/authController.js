const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/database');
const { getTokenVersion } = require('../middleware/auth');


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query admin from database
    const adminResult = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );

    if (adminResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = adminResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email, role: admin.role, tokenVersion: getTokenVersion() },
      process.env.JWT_SECRET || 'xayara_default_secret_key',
      { expiresIn: '30m' }
    );

    return res.json({
      token,
      user: { email, role: admin.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    // For now, registration is disabled for security
    res.status(403).json({ message: 'Registration is disabled. Contact administrator.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
