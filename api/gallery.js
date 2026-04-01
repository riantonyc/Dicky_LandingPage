const { sql } = require('@vercel/postgres');
const verifyAuth = require('./utils/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`SELECT * FROM gallery;`;
      return res.status(200).json(rows);
    }
    
    // Auth protected actions
    try {
      verifyAuth(req);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const { id, src, alt, caption, category } = req.body;
      await sql`
        INSERT INTO gallery (id, src, alt, caption, category)
        VALUES (${id}, ${src}, ${alt}, ${caption}, ${category});
      `;
      return res.status(201).json({ message: 'Gallery item created' });
    }

    if (req.method === 'PUT') {
      const { id, src, alt, caption, category } = req.body;
      await sql`
        UPDATE gallery
        SET src = ${src}, alt = ${alt}, caption = ${caption}, category = ${category}
        WHERE id = ${id};
      `;
      return res.status(200).json({ message: 'Gallery item updated' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query; // e.g. /api/gallery?id=123
      if (!id) return res.status(400).json({ error: 'ID required' });
      await sql`DELETE FROM gallery WHERE id = ${id};`;
      return res.status(200).json({ message: 'Gallery item deleted' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Gallery API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
