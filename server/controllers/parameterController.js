const pool = require('../config/database');

// Get all parameters
const getAllParameters = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM parameters ORDER BY category, key'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching parameters:', error);
    res.status(500).json({ error: 'Failed to fetch parameters' });
  }
};

// Get parameter by key
const getParameterByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const result = await pool.query(
      'SELECT * FROM parameters WHERE key = $1',
      [key]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Parameter not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching parameter:', error);
    res.status(500).json({ error: 'Failed to fetch parameter' });
  }
};

// Get parameters by category
const getParametersByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query(
      'SELECT * FROM parameters WHERE category = $1 ORDER BY key',
      [category]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching parameters by category:', error);
    res.status(500).json({ error: 'Failed to fetch parameters' });
  }
};

// Create or update parameter
const upsertParameter = async (req, res) => {
  try {
    const { key, value, description, category } = req.body;
    
    const result = await pool.query(
      `INSERT INTO parameters (key, value, description, category)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (key) 
       DO UPDATE SET value = $2, description = $3, category = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [key, value, description, category || 'general']
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error upserting parameter:', error);
    res.status(500).json({ error: 'Failed to upsert parameter' });
  }
};

// Delete parameter
const deleteParameter = async (req, res) => {
  try {
    const { key } = req.params;
    const result = await pool.query(
      'DELETE FROM parameters WHERE key = $1 RETURNING *',
      [key]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Parameter not found' });
    }
    
    res.json({ message: 'Parameter deleted successfully' });
  } catch (error) {
    console.error('Error deleting parameter:', error);
    res.status(500).json({ error: 'Failed to delete parameter' });
  }
};

module.exports = {
  getAllParameters,
  getParameterByKey,
  getParametersByCategory,
  upsertParameter,
  deleteParameter
};
