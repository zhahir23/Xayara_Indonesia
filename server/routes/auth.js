const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/validate', auth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
