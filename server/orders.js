const express = require('express');
const pool = require('./db');
const authMiddleware = require('./authMiddleware');
const { sendOrderConfirmation, sendNewOrderAlert } = require('./mailer');

const router = express.Router();

const STORE_LAT = 28.1322557;
const STORE_LNG = 82.3002296;

const SHIPPING_ZONES = {
  city: { label: 'Inside Tulsipur City' }, // fee calculated from distance
  valley: { label: 'Dang Valley (inside/outside)', fee: 180 },
};
const FREE_SHIPPING_THRESHOLD = 2000;

// Haversine formula — straight-line distance in km between two lat/lng points
function distanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function tulsipurFee(customerLat, customerLng) {
  const km = distanceKm(STORE_LAT, STORE_LNG, customerLat, customerLng);
  const roundedKm = Math.ceil(km);
  return Math.max(20, roundedKm * 10);
}

router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, shippingAddress, paymentMethod, phone, landmark, shippingZone, customerLat, customerLng } = req.body;
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
    if (shippingZone === 'city' && (customerLat == null || customerLng == null)) {
      return res.status(400).json({ error: 'Location is required for Tulsipur City delivery' });
    }
    if (!['cod', 'esewa'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let shippingFee;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      shippingFee = 0;
    } else if (shippingZone === 'city') {
      shippingFee = tulsipurFee(customerLat, customerLng);
    } else {
      shippingFee = SHIPPING_ZONES.valley.fee;
    }

    const total = subtotal + shippingFee;

    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, shipping_address, payment_method, payment_status, phone, landmark, shipping_zone, shipping_fee, customer_lat, customer_lng)
       VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8, $9, $10) RETURNING id`,
      [userId, total, shippingAddress, paymentMethod, phone, landmark || null, shippingZone, shippingFee, customerLat || null, customerLng || null]
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

    const userResult = await client.query('SELECT name, email FROM users WHERE id = $1', [userId]);
    const customer = userResult.rows[0];

    await client.query('COMMIT');

    const orderPayload = {
      id: orderId,
      customerName: customer.name,
      customerEmail: customer.email,
      items,
      subtotal: subtotal.toFixed(2),
      shippingFee: shippingFee.toFixed(2),
      total: total.toFixed(2),
      shippingAddress,
      landmark,
      phone,
      paymentMethod,
    };

    sendOrderConfirmation(orderPayload);
    sendNewOrderAlert(orderPayload);

    res.json({ orderId, total, subtotal, shippingFee, paymentMethod });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Something went wrong placing the order' });
  } finally {
    client.release();
  }
});

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