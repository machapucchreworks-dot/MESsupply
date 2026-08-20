const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const authRoutes = require('./auth');
const ordersRoutes = require('./orders');
const esewaRoutes = require('./esewa');
const reviewsRoutes = require('./reviews');
const addressesRoutes = require('./addresses');

const app = express();
const PORT = process.env.PORT || 5000;
const adminRoutes = require('./admin');

// Middleware
app.use(cors());
app.use(express.json());

// Route groups
app.use('/api/auth', authRoutes);
app.use('/api/esewa', esewaRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/addresses', addressesRoutes);

// Get shipping zones and free-shipping threshold
app.get('/api/shipping-zones', (req, res) => {
  res.json({
    zones: {
      city: { label: 'Inside Tulsipur City', distanceBased: true, description: 'Rs. 20 for up to 2km, +Rs. 10 per additional km' },
      valley: { label: 'Dang Valley (inside/outside)', fee: 180 },
    },
    freeShippingThreshold: 2000,
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('Daraz Clone API is running!');
});

// Get all products (optionally filtered by category)
app.get('/api/products', async (req, res) => {
  try {
    const { category_id, search } = req.query;

    let query = 'SELECT * FROM products';
    let conditions = [];
    let params = [];

    if (category_id) {
      params.push(category_id);
      conditions.push(`category_id = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching products' });
  }
});

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching the product' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching categories' });
  }
});

// Start the server — this should always be the LAST thing in the file
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});