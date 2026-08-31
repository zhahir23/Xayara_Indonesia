const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/', reservationController.createReservation);
router.get('/', reservationController.getAllReservations);
router.get('/check-availability', reservationController.checkAvailability);
router.get('/:id', reservationController.getReservationById);

// Protected routes (admin only)
router.use(auth);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);
router.post('/:id/resend-whatsapp', reservationController.resendWhatsApp);
router.post('/resend-all-failed-whatsapp', reservationController.resendAllFailedWhatsApp);

module.exports = router;
