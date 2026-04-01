const db = require('./utils/db');
const verifyAuth = require('./utils/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await db.query('SELECT * FROM gallery');
      return res.status(200).json(rows);
    }
    
    try { verifyAuth(req); } catch (err) { return res.status(401).json({ error: 'Unauthorized' }); }

    if (req.method === 'POST') {
      const { id, src, alt, caption, category } = req.body;
      await db.query(
        'INSERT INTO gallery (id, src, alt, caption, category) VALUES ($1, $2, $3, $4, $5)',
        [id, src, alt, caption, category]
      );
      return res.status(201).json({ message: 'Gallery item created' });
    }

    if (req.method === 'PUT') {
      const { id, src, alt, caption, category } = req.body;
      await db.query(
        'UPDATE gallery SET src = $1, alt = $2, caption = $3, category = $4 WHERE id = $5',
        [src, alt, caption, category, id]
      );
      return res.status(200).json({ message: 'Gallery item updated' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID required' });
      await db.query('DELETE FROM gallery WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Gallery item deleted' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Gallery API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
