// server/utils/generateToken.js
const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a user.
 * @param {Object} payload - Data to embed in the token (e.g., { id, email, role }).
 * @param {string} secret - JWT secret from env.
 * @param {string|number} expiresIn - Expiration time (e.g., '1h' or 3600).
 * @returns {string} Signed JWT.
 */
function generateToken(payload, secret = process.env.JWT_SECRET, expiresIn = '1h') {
  if (!secret) {
    throw new Error('JWT secret is not defined in environment variables');
  }
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = generateToken;
