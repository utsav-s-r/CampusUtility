/**
 * Booking Service
 * Handles business logic for room bookings
 */

import * as bookingRepository from '../repositories/bookingRepository.js';
import logger from '../config/logger.js';

/**
 * Create a new booking
 */
export const createBooking = async (bookingData, userId) => {
  const { roomId, startTime, endTime, eventName } = bookingData;

  // Validate input
  if (!roomId || !startTime || !endTime || !eventName) {
    throw {
      statusCode: 400,
      message: 'Room ID, start time, end time, and event name are required',
    };
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  // Validate time order
  if (end <= start) {
    throw {
      statusCode: 400,
      message: 'End time must be after start time',
    };
  }

  // Validate times are in future
  if (start < new Date()) {
    throw {
      statusCode: 400,
      message: 'Cannot book for past times',
    };
  }

  // Check for conflicts
  const hasConflict = await bookingRepository.checkConflict(roomId, startTime, endTime);
  if (hasConflict) {
    throw {
      statusCode: 409,
      message: 'Room is already booked for this time slot',
    };
  }

  const newBooking = await bookingRepository.create({
    userId,
    roomId,
    startTime,
    endTime,
    eventName,
  });

  logger.info('Booking created', { bookingId: newBooking.id, userId, roomId });
  return newBooking;
};

/**
 * Get booking by ID with permission check
 */
export const getBookingById = async (bookingId, userId, userRole) => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw {
      statusCode: 404,
      message: 'Booking not found',
    };
  }

  // Students can only view their own bookings
  if (userRole === 'STUDENT' && booking.user_id !== userId) {
    throw {
      statusCode: 403,
      message: 'Cannot view other user\'s booking',
    };
  }

  return booking;
};

/**
 * Get user's bookings
 */
export const getUserBookings = async (userId, limit = 10, offset = 0) => {
  const result = await bookingRepository.getByUserId(userId, limit, offset);
  return result;
};

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId, userId, userRole) => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw {
      statusCode: 404,
      message: 'Booking not found',
    };
  }

  // Students can only cancel their own bookings
  if (userRole === 'STUDENT' && booking.user_id !== userId) {
    throw {
      statusCode: 403,
      message: 'Cannot cancel other user\'s booking',
    };
  }

  if (booking.status === 'CANCELLED') {
    throw {
      statusCode: 400,
      message: 'Booking is already cancelled',
    };
  }

  const cancelledBooking = await bookingRepository.cancel(bookingId);
  logger.info('Booking cancelled', { bookingId, userId });

  return cancelledBooking;
};

/**
 * Get all bookings
 */
export const getAllBookings = async (limit = 50, offset = 0) => {
  return await bookingRepository.getAllBookings(limit, offset);
};

/**
 * Get all rooms
 */
export const getRooms = async () => {
  return await bookingRepository.getRooms();
};

/**
 * Update booking status (Admin only)
 */
export const updateBookingStatus = async (bookingId, status, userRole) => {
  if (userRole !== 'ADMIN') {
    throw {
      statusCode: 403,
      message: 'Only admins can update booking status',
    };
  }

  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw {
      statusCode: 404,
      message: 'Booking not found',
    };
  }

  const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED', 'APPROVED'];
  if (!validStatuses.includes(status)) {
    throw {
      statusCode: 400,
      message: 'Invalid status',
    };
  }

  const updatedBooking = await bookingRepository.updateStatus(bookingId, status);
  logger.info(`Booking status updated to ${status}`, { bookingId });

  return updatedBooking;
};

/**
 * Get availability for a room on a given date
 */
export const getRoomAvailability = async (roomId, date) => {
  if (!roomId || !date) {
    throw {
      statusCode: 400,
      message: 'Room ID and date are required',
    };
  }
  return await bookingRepository.getBookingsByRoomAndDate(roomId, date);
};

export default {
  createBooking,
  getBookingById,
  getUserBookings,
  getAllBookings,
  getRooms,
  getRoomAvailability,
  updateBookingStatus,
  cancelBooking,
};
