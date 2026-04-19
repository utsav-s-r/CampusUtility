/**
 * Issue Repository
 * Handles all database operations for issues
 */

import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.js';

/**
 * Create a new issue
 */
export const create = async (issueData) => {
  const { userId, title, description, priority } = issueData;
  const id = uuidv4();

  try {
    const result = await query(
      'INSERT INTO issues (id, user_id, title, description, status, priority, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
      [id, userId, title, description, 'OPEN', priority || 'MEDIUM']
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating issue', { userId, error: error.message });
    throw error;
  }
};

/**
 * Find issue by ID
 */
export const findById = async (id) => {
  try {
    const result = await query(
      'SELECT i.*, u.name as reporter_name, u.email as reporter_email FROM issues i JOIN users u ON i.user_id = u.id WHERE i.id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error finding issue by ID', { id, error: error.message });
    throw error;
  }
};

/**
 * Get all issues with filters
 */
export const getAll = async (filters = {}, limit = 10, offset = 0) => {
  const { status, priority, userId } = filters;
  let whereClause = '1=1';
  const params = [];

  if (status) {
    whereClause += ' AND i.status = $' + (params.length + 1);
    params.push(status);
  }
  if (priority) {
    whereClause += ' AND i.priority = $' + (params.length + 1);
    params.push(priority);
  }
  if (userId) {
    whereClause += ' AND i.user_id = $' + (params.length + 1);
    params.push(userId);
  }

  try {
    const result = await query(
      `SELECT i.*, u.name as reporter_name FROM issues i JOIN users u ON i.user_id = u.id WHERE ${whereClause} ORDER BY i.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM issues i WHERE ${whereClause}`,
      params
    );

    return {
      issues: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  } catch (error) {
    logger.error('Error getting issues', { filters, error: error.message });
    throw error;
  }
};

/**
 * Update issue status
 */
export const updateStatus = async (id, status, adminNotes = null) => {
  try {
    const resolvedAt = status === 'RESOLVED' ? 'NOW()' : 'NULL';
    const result = await query(
      `UPDATE issues SET status = $1, admin_notes = $2, resolved_at = ${resolvedAt}, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [status, adminNotes, id]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error updating issue status', { id, error: error.message });
    throw error;
  }
};

/**
 * Delete issue
 */
export const delete_issue = async (id) => {
  try {
    const result = await query('DELETE FROM issues WHERE id = $1 RETURNING id', [id]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error deleting issue', { id, error: error.message });
    throw error;
  }
};

export default {
  create,
  findById,
  getAll,
  updateStatus,
  delete_issue,
};
