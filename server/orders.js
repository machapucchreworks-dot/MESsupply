const express = require('express');
const pool = require('./db');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

const SHIPPING_ZONES = {
  city: { label: 'Inside Tulsipur City', fee: 50 },
  valley: { label: 'Dang Valley (inside/outside)', fee: 180 },
};
const FREE_SHIPPING_THRESHOLD = 2000;

// Place a new order (protected — must be logged in)
router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, shippingAddress, paymentMethod, phone, landmark, shippingZone } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!SHIPPING_ZONES[shippingZone]) {
      return res.status(400).json({ error: 'Invalid shipping zone' });
    }
    if (!['cod', 'esewa'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Calculate subtotal + shipping fee on the SERVER (never trust totals sent from the frontend)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_ZONES[shippingZone].fee;
    const total = subtotal + shippingFee;

    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, shipping_address, payment_method, payment_status, phone, landmark, shipping_zone, shipping_fee)
       VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8) RETURNING id`,
      [userId, total, shippingAddress, paymentMethod, phone, landmark || null, shippingZone, shippingFee]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.id]
      );
    }

    await client.query('COMMIT');

    res.json({ orderId, total, subtotal, shippingFee, paymentMethod });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Something went wrong placing the order' });
  } finally {
    client.release();
  }
});

// Get logged-in user's order history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const ordersResult = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    const orders = ordersResult.rows;

    for (const order of orders) {
      const itemsResult = await pool.query(
        `SELECT oi.quantity, oi.price, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      order.items = itemsResult.rows;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching orders' });
  }
});

module.exports = router;