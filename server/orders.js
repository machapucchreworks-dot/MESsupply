const express = require('express');
const pool = require('./db');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

// Place a new order (protected — must be logged in)
router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }
    if (!['cod', 'esewa'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Calculate total on the SERVER (never trust totals sent from the frontend)
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await client.query('BEGIN'); // Start a transaction

    // Create the order — payment_status starts 'pending' for both COD and eSewa
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, shipping_address, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING id`,
      [userId, total, shippingAddress, paymentMethod]
    );
    const orderId = orderResult.rows[0].id;

    // Insert each item, and reduce stock
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

    await client.query('COMMIT'); // Save all changes together

    res.json({ orderId, total, paymentMethod });
  } catch (err) {
    await client.query('ROLLBACK'); // Undo everything if something failed
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

    // For each order, fetch its items along with product names
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