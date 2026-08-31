const express = require('express');
const router = express.Router();
const dailyQuotaController = require('../controllers/dailyQuotaController');

// Get all daily quotas
router.get('/', dailyQuotaController.getAllDailyQuotas);

// Get daily quota by date
router.get('/:tanggal', dailyQuotaController.getDailyQuotaByDate);

// Create or update daily quota
router.post('/', dailyQuotaController.upsertDailyQuota);

// Delete daily quota
router.delete('/:id', dailyQuotaController.deleteDailyQuota);

module.exports = router;
