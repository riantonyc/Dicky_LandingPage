const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Token and a valid password (min 8 chars) are required' });
    }

    const { rows } = await sql`
      SELECT id, email, reset_expires
      FROM users
      WHERE reset_token = ${token};
    `;

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = rows[0];

    if (Date.now() > user.reset_expires) {
      return res.status(400).json({ error: 'Token has expired. Please request a new one.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    // Update password and invalidate token
    await sql`
      UPDATE users
      SET password_hash = ${newHash}, reset_token = NULL, reset_expires = NULL
      WHERE id = ${user.id};
    `;

    return res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};
