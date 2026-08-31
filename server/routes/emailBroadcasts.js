const express = require('express');
const router = express.Router();
const emailBroadcastController = require('../controllers/emailBroadcastController');
const { auth } = require('../middleware/auth');

// All routes are protected (admin only)
router.use(auth);

// Create new email broadcast
router.post('/', emailBroadcastController.createBroadcast);

// Get all broadcasts
router.get('/', emailBroadcastController.getAllBroadcasts);

// Get broadcast status (recent broadcasts)
router.get('/status', emailBroadcastController.getBroadcastStatus);

// Get broadcast by ID
router.get('/:id', emailBroadcastController.getBroadcastById);

// Get broadcast recipients
router.get('/:id/recipients', emailBroadcastController.getBroadcastRecipients);

// Resend failed emails
router.post('/:id/resend', emailBroadcastController.resendFailedEmails);

// Delete broadcast
router.delete('/:id', emailBroadcastController.deleteBroadcast);

module.exports = router;
