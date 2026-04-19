import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Password must be at least 8 characters and contain uppercase, lowercase, and number
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is strong
 */
export const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
};

/**
 * Sanitize user object for response (remove sensitive fields)
 * @param {object} user - User object from database
 * @returns {object} Sanitized user object
 */
export const sanitizeUser = (user) => {
  const { password, ...sanitized } = user;
  return sanitized;
};

/**
 * Create a standard API response
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {*} data - Response data (optional)
 * @returns {object} Formatted response
 */
export const createResponse = (success, message, data = null) => {
  const response = {
    success,
    message,
  };
  if (data !== null) {
    response.data = data;
  }
  return response;
};

/**
 * Create a paginated response
 * @param {array} items - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {object} Paginated response with items and pagination info
 */
export const createPaginatedResponse = (items, page, limit, total) => {
  const pages = Math.ceil(total / limit);
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
};

export default {
  hashPassword,
  comparePassword,
  isValidEmail,
  isStrongPassword,
  sanitizeUser,
  createResponse,
  createPaginatedResponse,
};
