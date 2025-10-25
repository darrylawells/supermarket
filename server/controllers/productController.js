import pool from '../config/database.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products';
    let params = [];
    let conditions = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);
    res.json({ products: result.rows });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const productResult = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const pricesResult = await pool.query(
      `SELECT p.*, s.name as supermarket_name, s.logo, s.color,
              u.username as submitted_by_username
       FROM prices p
       JOIN supermarkets s ON p.supermarket_id = s.id
       LEFT JOIN users u ON p.submitted_by = u.id
       WHERE p.product_id = $1 AND p.is_verified = true
       ORDER BY p.price ASC`,
      [id]
    );

    const product = {
      ...productResult.rows[0],
      prices: pricesResult.rows
    };

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const result = await pool.query(
      'INSERT INTO products (name, category, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, category, req.user.id]
    );

    res.status(201).json({ product: result.rows[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT category FROM products ORDER BY category ASC'
    );

    res.json({ categories: result.rows.map(r => r.category) });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
