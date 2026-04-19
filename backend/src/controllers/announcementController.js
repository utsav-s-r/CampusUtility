/**
 * Announcement Controller
 * Handles HTTP requests for announcements
 */

import * as announcementService from '../services/announcementService.js';
import { createResponse, createPaginatedResponse } from '../utils/helpers.js';

/**
 * POST /announcements
 * Create a new announcement (admins only)
 */
export const createAnnouncement = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const { title, content, expiryDate } = req.body;

    const announcement = await announcementService.createAnnouncement(
      { title, content, expiryDate },
      adminId
    );

    res.status(201).json(
      createResponse(true, 'Announcement created successfully', announcement)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /announcements
 * List all announcements
 */
export const getAnnouncements = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await announcementService.getAnnouncements(
      parseInt(limit),
      offset
    );

    const paginatedResult = {
      ...result,
      ...createPaginatedResponse(result.announcements, parseInt(page), parseInt(limit), result.total),
    };
    delete paginatedResult.total;

    res.status(200).json(
      createResponse(true, 'Announcements retrieved successfully', paginatedResult)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /announcements/:id
 * Get announcement details
 */
export const getAnnouncementById = async (req, res, next) => {
  try {
    const announcementId = req.params.id;

    const announcement = await announcementService.getAnnouncementById(announcementId);

    res.status(200).json(
      createResponse(true, 'Announcement retrieved successfully', announcement)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /announcements/:id
 * Update announcement (admins only)
 */
export const updateAnnouncement = async (req, res, next) => {
  try {
    const announcementId = req.params.id;
    const { title, content, expiryDate } = req.body;

    const updatedAnnouncement = await announcementService.updateAnnouncement(
      announcementId,
      { title, content, expiryDate }
    );

    res.status(200).json(
      createResponse(true, 'Announcement updated successfully', updatedAnnouncement)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /announcements/:id
 * Delete announcement (admins only)
 */
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcementId = req.params.id;

    await announcementService.deleteAnnouncement(announcementId);

    res.status(200).json(
      createResponse(true, 'Announcement deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};
