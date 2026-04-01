// Mencegah Node.js menolak sertifikat self-signed dari Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = require('pg');

const rawUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: rawUrl,
  ssl: {
    rejectUnauthorized: false // Paksa matikan validasi sertifikat strict
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
