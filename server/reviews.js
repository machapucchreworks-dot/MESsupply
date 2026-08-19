const express = require('express');
const pool = require('./db');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

// Get all reviews for a product, plus average rating
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const reviewsResult = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );

    const avgResult = await pool.query(
      `SELECT AVG(rating)::numeric(2,1) as average, COUNT(*) as count
       FROM reviews WHERE product_id = $1`,
      [productId]
    );

    res.json({
      reviews: reviewsResult.rows,
      average: avgResult.rows[0].average || 0,
      count: parseInt(avgResult.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching reviews' });
  }
});

// Submit or update a review (protected — must be logged in)
router.post('/product/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Upsert: insert new review, or update if this user already reviewed this product
    const result = await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (product_id, user_id)
       DO UPDATE SET rating = $3, comment = $4, created_at = NOW()
       RETURNING *`,
      [productId, userId, rating, comment || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong submitting your review' });
  }
});

module.exports = router;