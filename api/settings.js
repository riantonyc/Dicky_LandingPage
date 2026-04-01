const { sql } = require('@vercel/postgres');
const verifyAuth = require('./utils/auth');

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT key, value FROM settings;`;
      const settings = {};
      for (const row of rows) {
        settings[row.key] = row.value;
      }
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Settings GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  if (req.method === 'POST') {
    try {
      verifyAuth(req); // Will throw if invalid token
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const updates = req.body;
      
      const updatePromises = Object.entries(updates).map(([key, value]) => {
        // Upsert setting
        return sql`
          INSERT INTO settings (key, value)
          VALUES (${key}, ${value})
          ON CONFLICT (key) DO UPDATE SET value = ${value};
        `;
      });

      await Promise.all(updatePromises);
      return res.status(200).json({ message: 'Settings updated successfully' });

    } catch (error) {
      console.error('Settings POST error:', error);
      return res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
