const express = require('express');
const crypto = require('crypto');
const pool = require('./db');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

// Generate signed eSewa payment data for a given order
router.post('/initiate/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch the order, make sure it belongs to this logged-in user
    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];
    const amount = order.total;
    const transactionUuid = `${order.id}-${Date.now()}`; // unique ID for this payment attempt

    // The exact string eSewa requires us to sign
    const message = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${process.env.ESEWA_MERCHANT_CODE}`;

    const signature = crypto
      .createHmac('sha256', process.env.ESEWA_SECRET_KEY)
      .update(message)
      .digest('base64');

    res.json({
      amount,
      transactionUuid,
      productCode: process.env.ESEWA_MERCHANT_CODE,
      signature,
      esewaUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form', // sandbox/test URL
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong initiating payment' });
  }
});

module.exports = router;