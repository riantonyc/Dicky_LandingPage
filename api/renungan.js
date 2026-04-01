const db = require('./utils/db');
const verifyAuth = require('./utils/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await db.query('SELECT * FROM renungan');
      return res.status(200).json(rows);
    }
    
    try { verifyAuth(req); } catch (err) { return res.status(401).json({ error: 'Unauthorized' }); }

    if (req.method === 'POST') {
      const { id, title, content, source, category } = req.body;
      await db.query(
        'INSERT INTO renungan (id, title, content, source, category) VALUES ($1, $2, $3, $4, $5)',
        [id, title, content, source, category]
      );
      return res.status(201).json({ message: 'Renungan item created' });
    }

    if (req.method === 'PUT') {
      const { id, title, content, source, category } = req.body;
      await db.query(
        'UPDATE renungan SET title = $1, content = $2, source = $3, category = $4 WHERE id = $5',
        [title, content, source, category, id]
      );
      return res.status(200).json({ message: 'Renungan item updated' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID required' });
      await db.query('DELETE FROM renungan WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Renungan item deleted' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Renungan API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
