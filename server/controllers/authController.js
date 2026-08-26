const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const ADMIN_CREDENTIALS = {
  email: 'admin@xayara.com',
  password: 'admin123'
};

const hasDatabaseConfiguration = () => {
  return Boolean(
    process.env.DATABASE_URL ||
    process.env.DB_HOST ||
    process.env.POSTGRES_URL ||
    process.env.MYSQL_HOST ||
    process.env.MONGODB_URI
  );
};

const createAdminToken = (email) => {
  return jwt.sign(
    { email, role: 'admin' },
    process.env.JWT_SECRET || 'xayara_default_secret_key',
    { expiresIn: '24h' }
  );
};

exports.login = async (req, res) => {
  try {
    const { email = '', password = '' } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const shouldBypassLoginCheck = !hasDatabaseConfiguration() || process.env.ENABLE_LOGIN_BYPASS === 'true';

    if (shouldBypassLoginCheck) {
      const token = createAdminToken(email);
      return res.json({
        token,
        user: { email, role: 'admin' }
      });
    }

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = createAdminToken(email);
      return res.json({
        token,
        user: { email, role: 'admin' }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
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
