/**
 * Issue Service
 * Handles business logic for issue reporting and management
 */

import * as issueRepository from '../repositories/issueRepository.js';
import logger from '../config/logger.js';

/**
 * Create a new issue
 */
export const createIssue = async (issueData, userId) => {
  const { title, description, priority } = issueData;

  // Validate input
  if (!title || !description) {
    throw {
      statusCode: 400,
      message: 'Title and description are required',
    };
  }

  if (title.trim().length < 5) {
    throw {
      statusCode: 400,
      message: 'Title must be at least 5 characters',
    };
  }

  const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
  if (priority && !validPriorities.includes(priority)) {
    throw {
      statusCode: 400,
      message: 'Priority must be LOW, MEDIUM, or HIGH',
    };
  }

  const newIssue = await issueRepository.create({
    userId,
    title: title.trim(),
    description: description.trim(),
    priority: priority || 'MEDIUM',
  });

  logger.info('Issue created', { issueId: newIssue.id, userId });
  return newIssue;
};

/**
 * Get issue by ID with permission check
 */
export const getIssueById = async (issueId, userId, userRole) => {
  const issue = await issueRepository.findById(issueId);
  if (!issue) {
    throw {
      statusCode: 404,
      message: 'Issue not found',
    };
  }

  // Students can only view their own issues
  if (userRole === 'STUDENT' && issue.user_id !== userId) {
    throw {
      statusCode: 403,
      message: 'Cannot view other user\'s issues',
    };
  }

  return issue;
};

/**
 * Get issues with filters
 */
export const getIssues = async (filters, userId, userRole, limit = 10, offset = 0) => {
  // Students can only see their own issues
  if (userRole === 'STUDENT') {
    filters.userId = userId;
  }

  const result = await issueRepository.getAll(filters, limit, offset);
  return result;
};

/**
 * Update issue status (admin only)
 */
export const updateIssueStatus = async (issueId, newStatus, adminNotes) => {
  const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
  if (!validStatuses.includes(newStatus)) {
    throw {
      statusCode: 400,
      message: 'Invalid status',
    };
  }

  const issue = await issueRepository.findById(issueId);
  if (!issue) {
    throw {
      statusCode: 404,
      message: 'Issue not found',
    };
  }

  // Validate status transitions
  const validTransitions = {
    OPEN: ['IN_PROGRESS', 'RESOLVED'],
    IN_PROGRESS: ['OPEN', 'RESOLVED'],
    RESOLVED: ['OPEN', 'IN_PROGRESS'],
  };

  if (!validTransitions[issue.status].includes(newStatus)) {
    throw {
      statusCode: 400,
      message: `Invalid status transition from ${issue.status} to ${newStatus}`,
    };
  }

  const updatedIssue = await issueRepository.updateStatus(issueId, newStatus, adminNotes);
  logger.info('Issue status updated', { issueId, oldStatus: issue.status, newStatus });

  return updatedIssue;
};

/**
 * Delete issue (admin only)
 */
export const deleteIssue = async (issueId) => {
  const issue = await issueRepository.findById(issueId);
  if (!issue) {
    throw {
      statusCode: 404,
      message: 'Issue not found',
    };
  }

  await issueRepository.delete_issue(issueId);
  logger.info('Issue deleted', { issueId });

  return { success: true };
};

export default {
  createIssue,
  getIssueById,
  getIssues,
  updateIssueStatus,
  deleteIssue,
};
