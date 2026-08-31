const express = require('express');
const router = express.Router();
const {
  getAllParameters,
  getParameterByKey,
  getParametersByCategory,
  upsertParameter,
  deleteParameter
} = require('../controllers/parameterController');

// Get all parameters
router.get('/', getAllParameters);

// Get parameter by key
router.get('/key/:key', getParameterByKey);

// Get parameters by category
router.get('/category/:category', getParametersByCategory);

// Create or update parameter
router.post('/', upsertParameter);

// Delete parameter
router.delete('/:key', deleteParameter);

module.exports = router;
