const express = require('express');
const pool = require('./db');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

// All address routes require the user to be logged in
router.use(authMiddleware);

// Get all saved addresses for the logged-in user (default first, then newest first)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM addresses
       WHERE user_id = $1
       ORDER BY is_default DESC, created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching your addresses' });
  }
});

// Add a new address
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      label, phone, province, district, municipality,
      streetAddress, landmark, shippingZone, lat, lng, isDefault,
    } = req.body;

    if (!phone || !province || !district || !municipality || !streetAddress || !shippingZone) {
      return res.status(400).json({ error: 'Missing required address fields' });
    }

    await client.query('BEGIN');

    // If this new address is set as default, un-default all the user's other addresses first
    if (isDefault) {
      await client.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.userId]);
    }

    const result = await client.query(
      `INSERT INTO addresses
        (user_id, label, phone, province, district, municipality, street_address, landmark, shipping_zone, lat, lng, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        req.userId, label || 'Home', phone, province, district, municipality,
        streetAddress, landmark || null, shippingZone, lat ?? null, lng ?? null, !!isDefault,
      ]
    );

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Something went wrong saving your address' });
  } finally {
    client.release();
  }
});

// Update an existing address (must belong to the logged-in user)
router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const {
      label, phone, province, district, municipality,
      streetAddress, landmark, shippingZone, lat, lng, isDefault,
    } = req.body;

    if (!phone || !province || !district || !municipality || !streetAddress || !shippingZone) {
      return res.status(400).json({ error: 'Missing required address fields' });
    }

    await client.query('BEGIN');

    const ownerCheck = await client.query(
      'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    if (ownerCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Address not found' });
    }

    if (isDefault) {
      await client.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.userId]);
    }

    const result = await client.query(
      `UPDATE addresses SET
        label = $1, phone = $2, province = $3, district = $4, municipality = $5,
        street_address = $6, landmark = $7, shipping_zone = $8, lat = $9, lng = $10, is_default = $11
       WHERE id = $12 AND user_id = $13
       RETURNING *`,
      [
        label || 'Home', phone, province, district, municipality,
        streetAddress, landmark || null, shippingZone, lat ?? null, lng ?? null, !!isDefault,
        id, req.userId,
      ]
    );

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Something went wrong updating your address' });
  } finally {
    client.release();
  }
});

// Delete an address (must belong to the logged-in user)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong deleting your address' });
  }
});

module.exports = router;