const { sql } = require('@vercel/postgres');
const verifyAuth = require('./utils/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`SELECT * FROM renungan;`;
      return res.status(200).json(rows);
    }
    
    // Auth protected actions
    try {
      verifyAuth(req);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const { id, title, content, source, category } = req.body;
      await sql`
        INSERT INTO renungan (id, title, content, source, category)
        VALUES (${id}, ${title}, ${content}, ${source}, ${category});
      `;
      return res.status(201).json({ message: 'Renungan item created' });
    }

    if (req.method === 'PUT') {
      const { id, title, content, source, category } = req.body;
      await sql`
        UPDATE renungan
        SET title = ${title}, content = ${content}, source = ${source}, category = ${category}
        WHERE id = ${id};
      `;
      return res.status(200).json({ message: 'Renungan item updated' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID required' });
      await sql`DELETE FROM renungan WHERE id = ${id};`;
      return res.status(200).json({ message: 'Renungan item deleted' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Renungan API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
