import pool from '../config/database.js';

export const getAllSupermarkets = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM supermarkets ORDER BY name ASC');
    res.json({ supermarkets: result.rows });
  } catch (error) {
    console.error('Get supermarkets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSupermarketById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM supermarkets WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supermarket not found' });
    }

    res.json({ supermarket: result.rows[0] });
  } catch (error) {
    console.error('Get supermarket error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
