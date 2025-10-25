import pool from '../config/database.js';

export const getAllPrices = async (req, res) => {
  try {
    const { productId, supermarketId } = req.query;
    let query = `
      SELECT p.*, s.name as supermarket_name, s.logo, s.color,
             pr.name as product_name, pr.category,
             u.username as submitted_by_username
      FROM prices p
      JOIN supermarkets s ON p.supermarket_id = s.id
      JOIN products pr ON p.product_id = pr.id
      LEFT JOIN users u ON p.submitted_by = u.id
      WHERE p.is_verified = true
    `;
    let params = [];

    if (productId) {
      params.push(productId);
      query += ` AND p.product_id = $${params.length}`;
    }

    if (supermarketId) {
      params.push(supermarketId);
      query += ` AND p.supermarket_id = $${params.length}`;
    }

    query += ' ORDER BY p.product_id, p.price ASC';

    const result = await pool.query(query, params);
    res.json({ prices: result.rows });
  } catch (error) {
    console.error('Get prices error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createPrice = async (req, res) => {
  try {
    const { productId, supermarketId, price, storeLocation, photoUrl } = req.body;

    if (!productId || !supermarketId || !price || !storeLocation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert price
      const priceResult = await client.query(
        `INSERT INTO prices (product_id, supermarket_id, price, store_location, photo_url, submitted_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [productId, supermarketId, price, storeLocation, photoUrl, req.user.id]
      );

      // Add to price history
      await client.query(
        `INSERT INTO price_history (product_id, supermarket_id, price, store_location, recorded_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [productId, supermarketId, price, storeLocation, req.user.id]
      );

      await client.query('COMMIT');

      res.status(201).json({ price: priceResult.rows[0] });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create price error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const verifyPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert verification
      await client.query(
        'INSERT INTO price_verifications (price_id, verified_by, is_approved) VALUES ($1, $2, $3)',
        [id, req.user.id, isApproved]
      );

      if (isApproved) {
        // Update verification count and status
        await client.query(
          'UPDATE prices SET verification_count = verification_count + 1, is_verified = true WHERE id = $1',
          [id]
        );
      } else {
        // Mark as not verified
        await client.query(
          'UPDATE prices SET is_verified = false WHERE id = $1',
          [id]
        );
      }

      await client.query('COMMIT');

      res.json({ message: 'Price verification recorded' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Verify price error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPriceHistory = async (req, res) => {
  try {
    const { productId, supermarketId, days = 30 } = req.query;

    if (!productId || !supermarketId) {
      return res.status(400).json({ error: 'Product ID and Supermarket ID are required' });
    }

    const result = await pool.query(
      `SELECT ph.*, s.name as supermarket_name, s.logo, p.name as product_name
       FROM price_history ph
       JOIN supermarkets s ON ph.supermarket_id = s.id
       JOIN products p ON ph.product_id = p.id
       WHERE ph.product_id = $1 AND ph.supermarket_id = $2
       AND ph.recorded_at >= NOW() - INTERVAL '${parseInt(days)} days'
       ORDER BY ph.recorded_at ASC`,
      [productId, supermarketId]
    );

    res.json({ history: result.rows });
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProductPriceHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT ph.*, s.name as supermarket_name, s.logo, s.color
       FROM price_history ph
       JOIN supermarkets s ON ph.supermarket_id = s.id
       WHERE ph.product_id = $1
       AND ph.recorded_at >= NOW() - INTERVAL '${parseInt(days)} days'
       ORDER BY ph.recorded_at ASC, ph.supermarket_id`,
      [productId]
    );

    res.json({ history: result.rows });
  } catch (error) {
    console.error('Get product price history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPendingPrices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, s.name as supermarket_name, s.logo, s.color,
              pr.name as product_name, pr.category,
              u.username as submitted_by_username
       FROM prices p
       JOIN supermarkets s ON p.supermarket_id = s.id
       JOIN products pr ON p.product_id = pr.id
       LEFT JOIN users u ON p.submitted_by = u.id
       WHERE p.is_verified = false
       ORDER BY p.created_at DESC`
    );

    res.json({ prices: result.rows });
  } catch (error) {
    console.error('Get pending prices error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
