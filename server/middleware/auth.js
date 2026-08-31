const jwt = require('jsonwebtoken');

// Store token version in memory (resets on server restart)
let tokenVersion = Date.now().toString();

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'xayara_default_secret_key');

    // Check if token version matches (invalidates tokens on server restart)
    if (decoded.tokenVersion !== tokenVersion) {
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Function to get current token version (used during login)
const getTokenVersion = () => tokenVersion;

module.exports = { auth, getTokenVersion };
