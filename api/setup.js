const db = require('./utils/db');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        reset_token VARCHAR(255),
        reset_expires BIGINT
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id VARCHAR(255) PRIMARY KEY,
        src TEXT NOT NULL,
        alt TEXT NOT NULL,
        caption TEXT,
        category VARCHAR(100)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS renungan (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        source VARCHAR(255),
        category VARCHAR(100)
      );
    `);

    const email = 'ryanasu102@gmail.com';
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    const checkUser = await db.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (checkUser.rowCount === 0) {
      await db.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, passwordHash]);
    }

    const defaultSettings = [
      ['siteName', 'Dicky Wahyu'], ['ownerName', 'Dicky Wahyu'],
      ['tagline', 'Digital Storyteller & Creative Curator'], ['location', 'Indonesia'],
      ['bio', 'Crafting soulful narratives through intentional visuals. Menangkap keindahan ephemeral dari keseharian melalui lensa editorial yang penuh makna.'],
      ['email', 'hello@dickywahyu.com'], ['ctaTitle', 'Ready to tell your story?'],
      ['ctaDescription', 'I\'m currently accepting new collaborations and freelance projects for the upcoming season. Let\'s create something beautiful together.'],
      ['primaryColor', '#795844'], ['primaryContainerColor', '#fed1b7'], ['surfaceColor', '#fcf9f5']
    ];

    for (const [k, v] of defaultSettings) {
      await db.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [k, String(v)]);
    }

    return res.status(200).json({ message: 'Database setup successful!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to setup database', details: error.message });
  }
};
