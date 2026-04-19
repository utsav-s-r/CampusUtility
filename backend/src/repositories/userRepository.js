/**
 * User Repository
 * Handles all database operations for users
 */

import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.js';

/**
 * Find user by ID
 */
export const findById = async (id) => {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1 AND is_active = true', [id]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error finding user by ID', { id, error: error.message });
    throw error;
  }
};

/**
 * Find user by email
 */
export const findByEmail = async (email) => {
  try {
    const result = await query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error finding user by email', { email, error: error.message });
    throw error;
  }
};

/**
 * Create a new user
 */
export const create = async (userData) => {
  const { email, passwordHash, name, role } = userData;
  const id = uuidv4();

  try {
    const result = await query(
      'INSERT INTO users (id, email, password, name, role, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW()) RETURNING id, email, name, role, created_at, updated_at',
      [id, email, passwordHash, name, role || 'STUDENT']
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating user', { email, error: error.message });
    throw error;
  }
};

/**
 * Update user
 */
export const update = async (id, userData) => {
  const { email, name, role } = userData;

  try {
    const result = await query(
      'UPDATE users SET email = COALESCE($2, email), name = COALESCE($3, name), role = COALESCE($4, role), updated_at = NOW() WHERE id = $1 AND is_active = true RETURNING id, email, name, role, created_at, updated_at',
      [id, email, name, role]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error updating user', { id, error: error.message });
    throw error;
  }
};

/**
 * Soft delete user
 */
export const softDelete = async (id) => {
  try {
    const result = await query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error deleting user', { id, error: error.message });
    throw error;
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (limit = 10, offset = 0) => {
  try {
    const result = await query(
      'SELECT id, email, name, role, created_at FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const countResult = await query('SELECT COUNT(*) FROM users WHERE is_active = true');
    return {
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  } catch (error) {
    logger.error('Error getting all users', { error: error.message });
    throw error;
  }
};

export default {
  findById,
  findByEmail,
  create,
  update,
  softDelete,
  getAllUsers,
};
