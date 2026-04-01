const { sql } = require('@vercel/postgres');
const crypto = require('crypto');
const { Resend } = require('resend');

const resendLocal = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { rows } = await sql`
      SELECT id, email
      FROM users
      WHERE email = ${email};
    `;

    if (rows.length === 0) {
      // Return 200 even if user not found to prevent email enumeration
      return res.status(200).json({ message: 'If that admin email exists, a reset link has been sent.' });
    }

    const user = rows[0];

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour

    await sql`
      UPDATE users
      SET reset_token = ${token}, reset_expires = ${expires}
      WHERE id = ${user.id};
    `;

    // The reset link URL
    const baseUrl = process.env.PUBLIC_URL || req.headers.origin || 'http://localhost:5500';
    const resetLink = `${baseUrl}/admin.html?reset_token=${token}`;

    if (process.env.RESEND_API_KEY) {
      try {
        await resendLocal.emails.send({
          from: 'Admin <onboarding@resend.dev>', // Use correct domain when moving to prod
          to: [user.email],
          subject: 'Admin Portfolio - Reset Password',
          html: `
            <h3>Reset Password Request</h3>
            <p>You requested to reset your password for the Admin Portfolio Panel.</p>
            <p>Click the link below to set a new password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, please ignore this email.</p>
          `
        });
      } catch (e) {
        console.error("Resend API failed", e);
      }
    } else {
      console.log('NO RESEND API KEY SET. Would have sent:', resetLink);
    }

    return res.status(200).json({ message: 'If that admin email exists, a reset link has been sent.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
};
