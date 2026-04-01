const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Create Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        reset_token VARCHAR(255),
        reset_expires BIGINT
      );
    `;

    // Create Settings Table
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `;

    // Create Gallery Table
    await sql`
      CREATE TABLE IF NOT EXISTS gallery (
        id VARCHAR(255) PRIMARY KEY,
        src TEXT NOT NULL,
        alt TEXT NOT NULL,
        caption TEXT,
        category VARCHAR(100)
      );
    `;

    // Create Renungan Table
    await sql`
      CREATE TABLE IF NOT EXISTS renungan (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        source VARCHAR(255),
        category VARCHAR(100)
      );
    `;

    // Create default Admin User if not exists
    const email = 'ryanasu102@gmail.com';
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    const { rowCount } = await sql`
      SELECT 1 FROM users WHERE email = ${email};
    `;

    if (rowCount === 0) {
      await sql`
        INSERT INTO users (email, password_hash)
        VALUES (${email}, ${passwordHash});
      `;
    }

    // Insert Default Settings if not exists
    const defaultSettings = [
      ['siteName', 'Dicky Wahyu'],
      ['ownerName', 'Dicky Wahyu'],
      ['tagline', 'Digital Storyteller & Creative Curator'],
      ['location', 'Indonesia'],
      ['bio', 'Crafting soulful narratives through intentional visuals. Menangkap keindahan ephemeral dari keseharian melalui lensa editorial yang penuh makna.'],
      ['email', 'hello@dickywahyu.com'],
      ['ctaTitle', 'Ready to tell your story?'],
      ['ctaDescription', 'I\'m currently accepting new collaborations and freelance projects for the upcoming season. Let\'s create something beautiful together.'],
      // Colors
      ['primaryColor', '#795844'],
      ['primaryContainerColor', '#fed1b7'],
      ['surfaceColor', '#fcf9f5']
    ];

    for (const [k, v] of defaultSettings) {
      await sql`
        INSERT INTO settings (key, value)
        VALUES (${k}, ${v})
        ON CONFLICT (key) DO NOTHING;
      `;
    }

    return res.status(200).json({ message: 'Database setup successful!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to setup database', details: error.message });
  }
};
