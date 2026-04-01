const { Pool } = require('pg');

// Gunakan koneksi dari Vercel/Supabase
const connectionString = 
  process.env.POSTGRES_URL || 
  process.env.SUPABASE_URL || 
  process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
