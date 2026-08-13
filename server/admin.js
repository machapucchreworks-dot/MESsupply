const express = require('express');
const pool = require('./db');
const authMiddleware = require('./authMiddleware');
const adminMiddleware = require('./adminMiddleware');

const router = express.Router();

// All routes below require: logged in AND admin
router.use(authMiddleware, adminMiddleware);

// Create a new product
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, image_url, category_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, stock || 0, image_url, category_id || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong creating the product' });
  }
});

// Update an existing product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image_url, category_id } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, category_id = $6
       WHERE id = $7 RETURNING *`,
      [name, description, price, stock, image_url, category_id || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong updating the product' });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    // This happens if the product is referenced by existing orders
    res.status(400).json({ error: 'Cannot delete this product — it may be part of an existing order. Try setting stock to 0 instead.' });
  }
});

module.exports = router;