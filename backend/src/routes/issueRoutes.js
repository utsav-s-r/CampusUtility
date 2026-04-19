import express from 'express';
import issueController from '../controllers/issueController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', authMiddleware, issueController.createIssue);
router.get('/', authMiddleware, issueController.getIssues);
router.get('/:id', authMiddleware, issueController.getIssueById);
router.patch('/:id', authMiddleware, adminMiddleware, issueController.updateIssue);
router.delete('/:id', authMiddleware, adminMiddleware, issueController.deleteIssue);

export default router;
