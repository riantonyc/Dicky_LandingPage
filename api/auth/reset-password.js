const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const now = Date.now();

    const { rows } = await db.query(
      'SELECT id, email FROM users WHERE reset_token = $1 AND reset_expires > $2',
      [hashedToken, now]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const unhashedPassword = await bcrypt.hash(newPassword, 10);
    const userEmail = rows[0].email;

    await db.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_expires = NULL WHERE email = $2',
      [unhashedPassword, userEmail]
    );

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
