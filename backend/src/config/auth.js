import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';
const ACCESS_TOKEN_EXPIRY = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY) || 900; // 15 minutes (in seconds)
const REFRESH_TOKEN_EXPIRY = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY) || 604800; // 7 days (in seconds)

/**
 * Generate JWT token
 * @param {object} payload - Token payload (user data)
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
export const generateToken = (payload, expiresIn = ACCESS_TOKEN_EXPIRY) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  } catch (error) {
    logger.error('Error generating JWT token', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Generate access and refresh tokens
 * @param {object} user - User object {id, email, role}
 * @returns {object} {accessToken, refreshToken}
 */
export const generateTokenPair = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(payload, ACCESS_TOKEN_EXPIRY);
  const refreshToken = generateToken(payload, REFRESH_TOKEN_EXPIRY);

  return {
    accessToken,
    refreshToken,
    expiresIn: parseInt(ACCESS_TOKEN_EXPIRY),
  };
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string} JWT token or null
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7); // Remove 'Bearer ' prefix
};

export default {
  generateToken,
  generateTokenPair,
  verifyToken,
  extractTokenFromHeader,
  JWT_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
};
