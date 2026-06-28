const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/', reservationController.createReservation);
router.get('/', reservationController.getAllReservations);

// Protected routes (admin only)
router.use(authMiddleware);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
