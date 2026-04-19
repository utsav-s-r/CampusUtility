import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/rooms', authMiddleware, bookingController.getRooms);
router.get('/room/:roomId/date/:date', authMiddleware, bookingController.getRoomAvailability);
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/', authMiddleware, bookingController.getUserBookings);
router.get('/all', authMiddleware, bookingController.getAllBookings);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.patch('/:id/status', authMiddleware, bookingController.updateBookingStatus);
router.delete('/:id', authMiddleware, bookingController.cancelBooking);

export default router;
