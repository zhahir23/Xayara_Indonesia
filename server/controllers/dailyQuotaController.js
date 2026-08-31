const pool = require('../config/database');

// Get all daily quotas
const getAllDailyQuotas = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, to_char(tanggal, \'YYYY-MM-DD\') as tanggal, quota_limit, to_char(created_at, \'YYYY-MM-DD HH24:MI:SS\') as created_at, to_char(updated_at, \'YYYY-MM-DD HH24:MI:SS\') as updated_at FROM daily_quotas ORDER BY tanggal ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching daily quotas:', error);
    res.status(500).json({ error: 'Failed to fetch daily quotas' });
  }
};

// Get daily quota by date
const getDailyQuotaByDate = async (req, res) => {
  try {
    const { tanggal } = req.params;
    const result = await pool.query(
      'SELECT * FROM daily_quotas WHERE tanggal = $1',
      [tanggal]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Daily quota not found for this date' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching daily quota:', error);
    res.status(500).json({ error: 'Failed to fetch daily quota' });
  }
};

// Create or update daily quota
const upsertDailyQuota = async (req, res) => {
  try {
    const { tanggal, quota_limit } = req.body;
    
    // Validate that tanggal is a future date (compare as strings to avoid timezone issues)
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    if (tanggal < todayString) {
      return res.status(400).json({ error: 'Hanya dapat mengatur kuota untuk tanggal mendatang' });
    }
    
    // Use tanggal directly as it's already in YYYY-MM-DD format from date input
    // No Date conversion needed to avoid timezone issues
    const result = await pool.query(
      `INSERT INTO daily_quotas (tanggal, quota_limit)
       VALUES ($1::DATE, $2)
       ON CONFLICT (tanggal) 
       DO UPDATE SET quota_limit = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING id, to_char(tanggal, 'YYYY-MM-DD') as tanggal, quota_limit, to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at, to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [tanggal, quota_limit]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error upserting daily quota:', error);
    res.status(500).json({ error: 'Failed to upsert daily quota' });
  }
};

// Delete daily quota
const deleteDailyQuota = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM daily_quotas WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Daily quota not found' });
    }
    
    res.json({ message: 'Daily quota deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily quota:', error);
    res.status(500).json({ error: 'Failed to delete daily quota' });
  }
};

// Auto-delete past daily quotas
const cleanupPastQuotas = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await pool.query(
      'DELETE FROM daily_quotas WHERE tanggal < $1 RETURNING *',
      [today.toISOString().split('T')[0]]
    );
    
    if (result.rowCount > 0) {
      console.log(`Cleaned up ${result.rowCount} past daily quotas`);
    }
  } catch (error) {
    console.error('Error cleaning up past quotas:', error);
  }
};

// Get quota limit for a specific date (with fallback to default parameter)
const getQuotaLimitForDate = async (tanggal) => {
  try {
    // First check if there's a date-specific quota
    const result = await pool.query(
      'SELECT quota_limit FROM daily_quotas WHERE tanggal = $1',
      [tanggal]
    );
    
    if (result.rows.length > 0) {
      return result.rows[0].quota_limit;
    }
    
    // Fallback to default parameter
    const defaultResult = await pool.query(
      "SELECT value FROM parameters WHERE key = 'daily_reservation_quota'"
    );
    
    if (defaultResult.rows.length > 0) {
      return parseInt(defaultResult.rows[0].value) || 10;
    }
    
    return 10; // Default fallback
  } catch (error) {
    console.error('Error getting quota limit for date:', error);
    return 10; // Default fallback on error
  }
};

module.exports = {
  getAllDailyQuotas,
  getDailyQuotaByDate,
  upsertDailyQuota,
  deleteDailyQuota,
  getQuotaLimitForDate,
  cleanupPastQuotas
};
