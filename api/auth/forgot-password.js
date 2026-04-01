const db = require('../utils/db');
const { Resend } = require('resend');
const crypto = require('crypto');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const { rows } = await db.query('SELECT id, email FROM users WHERE email = $1', [email]);
        
    // Always return success to prevent email enumeration, even if user doesn't exist
    if (rows.length === 0) {
      return res.status(200).json({ message: 'If email exists, reset link sent.' });
    }

    const unhashedToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');
    const expires = Date.now() + 3600000; // 1 hour

    await db.query(
      'UPDATE users SET reset_token = $1, reset_expires = $2 WHERE email = $3',
      [hashedToken, expires, email]
    );

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const resetUrl = `${protocol}://${host}/admin.html?reset_token=${unhashedToken}`;

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset Password - Dicky Wahyu Admin',
        html: `
          <h3>Permintaan Reset Password</h3>
          <p>Seseorang meminta reset password untuk akun admin Anda.</p>
          <p>Silakan klik link di bawah ini untuk membuat sandi baru (Valid selama 1 jam):</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <br><p>Abaikan email ini jika Anda tidak memintanya.</p>
        `
      });
    } else {
      console.log('NO RESEND API KEY FOUND. RESET URL:', resetUrl);
    }

    return res.status(200).json({ message: 'If email exists, reset link sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
