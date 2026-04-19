import { verifyToken, extractTokenFromHeader } from '../config/auth.js';
import logger from '../config/logger.js';

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header and verifies it
 */
export const authMiddleware = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - missing token',
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Authentication failed', { error: error.message });
    return res.status(401).json({
      success: false,
      error: `Unauthorized - ${error.message}`,
    });
  }
};

/**
 * Middleware to check if user is admin
 * Must be used after authMiddleware
 */
export const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  if (req.user.role !== 'ADMIN') {
    logger.warn('Admin access denied', { userId: req.user.id, role: req.user.role });
    return res.status(403).json({
      success: false,
      error: 'Forbidden - admin access required',
    });
  }

  next();
};

/**
 * Middleware to check if user is student
 * Must be used after authMiddleware
 */
export const studentMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  if (req.user.role !== 'STUDENT') {
    logger.warn('Student access denied', { userId: req.user.id, role: req.user.role });
    return res.status(403).json({
      success: false,
      error: 'Forbidden - student access required',
    });
  }

  next();
};

export default {
  authMiddleware,
  adminMiddleware,
  studentMiddleware,
};
