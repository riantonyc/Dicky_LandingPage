const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });

  try {
    const adminToken = process.env.DICKY_PW || process.env.ADMIN_TOKEN || '';
    if (!adminToken) {
      console.warn('WARNING: DICKY_PW env variable is not set!');
      return res.status(500).json({ error: 'Server auth misconfiguration' });
    }

    const inputBuffer = Buffer.from(token);
    const truthBuffer = Buffer.from(adminToken);

    if (inputBuffer.length !== truthBuffer.length || !crypto.timingSafeEqual(inputBuffer, truthBuffer)) {
      return res.status(401).json({ error: 'Invalid access token' });
    }

    // Login lolos
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';
    const sessionToken = jwt.sign(
      { role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ message: 'Login successful', token: sessionToken });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
