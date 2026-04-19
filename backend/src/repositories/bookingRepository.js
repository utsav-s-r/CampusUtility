/**
 * Booking Repository
 * Handles all database operations for room bookings
 */

import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.js';

/**
 * Create a new booking
 */
export const create = async (bookingData) => {
  const { userId, roomId, startTime, endTime, eventName } = bookingData;
  const id = uuidv4();

  try {
    const result = await query(
      'INSERT INTO bookings (id, user_id, room_id, start_time, end_time, status, event_name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
      [id, userId, roomId, startTime, endTime, 'PENDING', eventName]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating booking', { userId, error: error.message });
    throw error;
  }
};

/**
 * Find booking by ID
 */
export const findById = async (id) => {
  try {
    const result = await query(
      `SELECT b.*, r.name as room_name, r.capacity, r.location, u.name as user_name 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       JOIN users u ON b.user_id = u.id 
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error finding booking by ID', { id, error: error.message });
    throw error;
  }
};

/**
 * Get all bookings for a user
 */
export const getByUserId = async (userId, limit = 10, offset = 0) => {
  try {
    const result = await query(
      `SELECT b.*, r.name as room_name, r.capacity, r.location 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.user_id = $1 AND b.status IN ('CONFIRMED', 'PENDING')
       ORDER BY b.start_time DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM bookings WHERE user_id = $1 AND status IN ('CONFIRMED', 'PENDING')`,
      [userId]
    );

    return {
      bookings: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  } catch (error) {
    logger.error('Error getting user bookings', { userId, error: error.message });
    throw error;
  }
};

/**
 * Check for conflicts (overlapping bookings for same room)
 */
export const checkConflict = async (roomId, startTime, endTime, excludeBookingId = null) => {
  try {
    const query_text = excludeBookingId
      ? `SELECT COUNT(*) FROM bookings 
         WHERE room_id = $1 AND status IN ('CONFIRMED', 'PENDING') 
         AND start_time < $2 AND end_time > $3 
         AND id != $4`
      : `SELECT COUNT(*) FROM bookings 
         WHERE room_id = $1 AND status IN ('CONFIRMED', 'PENDING') 
         AND start_time < $2 AND end_time > $3`;

    const params = excludeBookingId ? [roomId, endTime, startTime, excludeBookingId] : [roomId, endTime, startTime];
    const result = await query(query_text, params);

    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    logger.error('Error checking booking conflict', { roomId, error: error.message });
    throw error;
  }
};

/**
 * Cancel booking
 */
export const cancel = async (id) => {
  try {
    const result = await query(
      'UPDATE bookings SET status = $1, cancelled_at = NOW(), updated_at = NOW() WHERE id = $2 RETURNING *',
      ['CANCELLED', id]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error cancelling booking', { id, error: error.message });
    throw error;
  }
};

/**
 * Get all rooms
 */
export const getRooms = async () => {
  try {
    const result = await query(
      'SELECT id, name, capacity, location FROM rooms ORDER BY name ASC'
    );
    return result.rows;
  } catch (error) {
    logger.error('Error getting rooms', { error: error.message });
    throw error;
  }
};

/**
 * Get all bookings
 */
export const getAllBookings = async (limit = 50, offset = 0) => {
  try {
    const result = await query(
      `SELECT b.*, r.name as room_name, r.capacity, r.location, u.name as user_name 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       JOIN users u ON b.user_id = u.id 
       ORDER BY b.start_time DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM bookings`
    );

    return {
      bookings: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  } catch (error) {
    logger.error('Error getting all bookings', { error: error.message });
    throw error;
  }
};

/**
 * Get bookings for a specific room and date
 */
export const getBookingsByRoomAndDate = async (roomId, date) => {
  try {
    const result = await query(
      `SELECT b.*, u.name as user_name 
       FROM bookings b 
       LEFT JOIN users u ON b.user_id = u.id 
       WHERE b.room_id = $1 
       AND (b.start_time::date = $2 OR b.end_time::date = $2)
       AND b.status IN ('CONFIRMED', 'PENDING', 'APPROVED')
       ORDER BY b.start_time ASC`,
      [roomId, date]
    );
    return result.rows;
  } catch (error) {
    logger.error('Error getting bookings by room and date', { roomId, date, error: error.message });
    throw error;
  }
};

/**
 * Update booking status
 */
export const updateStatus = async (id, status) => {
  try {
    const result = await query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error updating booking status', { id, status, error: error.message });
    throw error;
  }
};

export default {
  create,
  findById,
  getByUserId,
  getAllBookings,
  getBookingsByRoomAndDate,
  getRooms,
  updateStatus,
  checkConflict,
  cancel,
};
