import express from 'express';
import announcementController from '../controllers/announcementController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (read-only)
router.get('/', announcementController.getAnnouncements);
router.get('/:id', announcementController.getAnnouncementById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, announcementController.createAnnouncement);
router.patch('/:id', authMiddleware, adminMiddleware, announcementController.updateAnnouncement);
router.delete('/:id', authMiddleware, adminMiddleware, announcementController.deleteAnnouncement);

export default router;
