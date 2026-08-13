const pool = require('./db');

async function adminMiddleware(req, res, next) {
  try {
    const result = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.userId]);

    if (result.rows.length === 0 || !result.rows[0].is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong checking admin access' });
  }
}

module.exports = adminMiddleware;