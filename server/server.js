const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const reservationRoutes = require('./routes/reservations');
const authRoutes = require('./routes/auth');
const parameterRoutes = require('./routes/parameters');
const dailyQuotaRoutes = require('./routes/dailyQuotas');
const emailBroadcastRoutes = require('./routes/emailBroadcasts');
const dailyQuotaController = require('./controllers/dailyQuotaController');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/parameters', parameterRoutes);
app.use('/api/daily-quotas', dailyQuotaRoutes);
app.use('/api/email-broadcasts', emailBroadcastRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Xayara Indonesia API is running' });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  const publicDir = path.join(__dirname, 'public');
  app.use(express.static(publicDir));

  // SPA fallback: serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Clean up past daily quotas on startup
  await dailyQuotaController.cleanupPastQuotas();
});
