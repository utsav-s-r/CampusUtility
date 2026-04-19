/**
 * Announcement Repository
 * Handles all database operations for announcements
 */

import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.js';

/**
 * Create a new announcement
 */
export const create = async (announcementData) => {
  const { adminId, title, content, expiryDate } = announcementData;
  const id = uuidv4();

  try {
    const result = await query(
      'INSERT INTO announcements (id, admin_id, title, content, expiry_date, is_archived, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW()) RETURNING *',
      [id, adminId, title, content, expiryDate || null]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating announcement', { adminId, error: error.message });
    throw error;
  }
};

/**
 * Find announcement by ID
 */
export const findById = async (id) => {
  try {
    const result = await query(
      'SELECT a.*, u.name as admin_name FROM announcements a JOIN users u ON a.admin_id = u.id WHERE a.id = $1 AND a.is_archived = false',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error finding announcement by ID', { id, error: error.message });
    throw error;
  }
};

/**
 * Get all active announcements
 */
export const getAll = async (limit = 10, offset = 0) => {
  try {
    const result = await query(
      `SELECT a.*, u.name as admin_name FROM announcements a 
       JOIN users u ON a.admin_id = u.id 
       WHERE a.is_archived = false AND (a.expiry_date IS NULL OR a.expiry_date > NOW()) 
       ORDER BY a.created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM announcements WHERE is_archived = false AND (expiry_date IS NULL OR expiry_date > NOW())`
    );

    return {
      announcements: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  } catch (error) {
    logger.error('Error getting announcements', { error: error.message });
    throw error;
  }
};

/**
 * Update announcement
 */
export const update = async (id, announcementData) => {
  const { title, content, expiryDate } = announcementData;

  try {
    const result = await query(
      'UPDATE announcements SET title = COALESCE($2, title), content = COALESCE($3, content), expiry_date = COALESCE($4, expiry_date), updated_at = NOW() WHERE id = $1 AND is_archived = false RETURNING *',
      [id, title, content, expiryDate]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error updating announcement', { id, error: error.message });
    throw error;
  }
};

/**
 * Archive announcement (soft delete)
 */
export const archive = async (id) => {
  try {
    const result = await query(
      'UPDATE announcements SET is_archived = true, updated_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error archiving announcement', { id, error: error.message });
    throw error;
  }
};

export default {
  create,
  findById,
  getAll,
  update,
  archive,
};
