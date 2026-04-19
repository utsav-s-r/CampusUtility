/**
 * Issue Controller
 * Handles HTTP requests for issue management
 */

import * as issueService from '../services/issueService.js';
import { createResponse, createPaginatedResponse } from '../utils/helpers.js';
import logger from '../config/logger.js';

/**
 * POST /issues
 * Create a new issue (students)
 */
export const createIssue = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, priority } = req.body;

    const issue = await issueService.createIssue(
      { title, description, priority },
      userId
    );

    res.status(201).json(
      createResponse(true, 'Issue created successfully', issue)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /issues
 * List issues with optional filters
 */
export const getIssues = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status, priority, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await issueService.getIssues(
      filters,
      userId,
      userRole,
      parseInt(limit),
      offset
    );

    const paginatedResult = {
      ...result,
      ...createPaginatedResponse(result.issues, parseInt(page), parseInt(limit), result.total),
    };
    delete paginatedResult.total;

    res.status(200).json(
      createResponse(true, 'Issues retrieved successfully', paginatedResult)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /issues/:id
 * Get issue details
 */
export const getIssueById = async (req, res, next) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const issue = await issueService.getIssueById(issueId, userId, userRole);

    res.status(200).json(
      createResponse(true, 'Issue retrieved successfully', issue)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /issues/:id
 * Update issue status (admins only)
 */
export const updateIssue = async (req, res, next) => {
  try {
    const issueId = req.params.id;
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json(
        createResponse(false, 'Status is required')
      );
    }

    const updatedIssue = await issueService.updateIssueStatus(
      issueId,
      status,
      adminNotes
    );

    res.status(200).json(
      createResponse(true, 'Issue updated successfully', updatedIssue)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /issues/:id
 * Delete issue (admins only)
 */
export const deleteIssue = async (req, res, next) => {
  try {
    const issueId = req.params.id;

    await issueService.deleteIssue(issueId);

    res.status(200).json(
      createResponse(true, 'Issue deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
