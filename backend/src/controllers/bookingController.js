/**
 * Booking Controller
 * Handles HTTP requests for room bookings
 */

import * as bookingService from '../services/bookingService.js';
import { createResponse, createPaginatedResponse } from '../utils/helpers.js';

/**
 * POST /bookings
 * Create a new booking
 */
export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { roomId, startTime, endTime, eventName } = req.body;

    const booking = await bookingService.createBooking(
      { roomId, startTime, endTime, eventName },
      userId
    );

    res.status(201).json(
      createResponse(true, 'Booking created successfully', booking)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /bookings
 * List user's bookings
 */
export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await bookingService.getUserBookings(
      userId,
      parseInt(limit),
      offset
    );

    const paginatedResult = {
      ...result,
      ...createPaginatedResponse(result.bookings, parseInt(page), parseInt(limit), result.total),
    };
    delete paginatedResult.total;

    res.status(200).json(
      createResponse(true, 'Bookings retrieved successfully', paginatedResult)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /bookings/:id
 * Get booking details
 */
export const getBookingById = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const booking = await bookingService.getBookingById(bookingId, userId, userRole);

    res.status(200).json(
      createResponse(true, 'Booking retrieved successfully', booking)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /bookings/:id
 * Cancel booking
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const cancelledBooking = await bookingService.cancelBooking(
      bookingId,
      userId,
      userRole
    );

    res.status(200).json(
      createResponse(true, 'Booking cancelled successfully', cancelledBooking)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /bookings/all
 * List all bookings (Admin only)
 */
export const getAllBookings = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json(createResponse(false, 'Forbidden'));
    }
    
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await bookingService.getAllBookings(parseInt(limit), offset);

    const paginatedResult = {
      ...result,
      ...createPaginatedResponse(result.bookings, parseInt(page), parseInt(limit), result.total),
    };
    delete paginatedResult.total;

    res.status(200).json(
      createResponse(true, 'All bookings retrieved successfully', paginatedResult)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /bookings/:id/status
 * Update booking status (Admin only)
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    const userRole = req.user.role;

    if (!status) {
      return res.status(400).json(createResponse(false, 'Status is required'));
    }

    const updatedBooking = await bookingService.updateBookingStatus(bookingId, status, userRole);

    res.status(200).json(
      createResponse(true, 'Booking status updated successfully', updatedBooking)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /bookings/rooms
 * List all available rooms
 */
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await bookingService.getRooms();
    res.status(200).json(
      createResponse(true, 'Rooms retrieved successfully', rooms)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /bookings/room/:roomId/date/:date
 * Check room availability for a specific day
 */
export const getRoomAvailability = async (req, res, next) => {
  try {
    const { roomId, date } = req.params;
    const bookings = await bookingService.getRoomAvailability(roomId, date);

    res.status(200).json(
      createResponse(true, 'Room availability retrieved successfully', bookings)
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getRooms,
  getRoomAvailability,
};
