/**
 * Announcement Service
 * Handles business logic for announcements
 */

import * as announcementRepository from '../repositories/announcementRepository.js';
import logger from '../config/logger.js';

/**
 * Create a new announcement (admin only)
 */
export const createAnnouncement = async (announcementData, adminId) => {
  const { title, content, expiryDate } = announcementData;

  // Validate input
  if (!title || !content) {
    throw {
      statusCode: 400,
      message: 'Title and content are required',
    };
  }

  if (title.trim().length < 5) {
    throw {
      statusCode: 400,
      message: 'Title must be at least 5 characters',
    };
  }

  if (title.length > 500) {
    throw {
      statusCode: 400,
      message: 'Title cannot exceed 500 characters',
    };
  }

  if (content.length > 5000) {
    throw {
      statusCode: 400,
      message: 'Content cannot exceed 5000 characters',
    };
  }

  // Validate expiry date if provided
  if (expiryDate && new Date(expiryDate) <= new Date()) {
    throw {
      statusCode: 400,
      message: 'Expiry date must be in the future',
    };
  }

  const newAnnouncement = await announcementRepository.create({
    adminId,
    title: title.trim(),
    content: content.trim(),
    expiryDate,
  });

  logger.info('Announcement created', { announcementId: newAnnouncement.id, adminId });
  return newAnnouncement;
};

/**
 * Get announcement by ID
 */
export const getAnnouncementById = async (announcementId) => {
  const announcement = await announcementRepository.findById(announcementId);
  if (!announcement) {
    throw {
      statusCode: 404,
      message: 'Announcement not found',
    };
  }
  return announcement;
};

/**
 * Get all active announcements
 */
export const getAnnouncements = async (limit = 10, offset = 0) => {
  const result = await announcementRepository.getAll(limit, offset);
  return result;
};

/**
 * Update announcement (admin only)
 */
export const updateAnnouncement = async (announcementId, announcementData) => {
  const announcement = await announcementRepository.findById(announcementId);
  if (!announcement) {
    throw {
      statusCode: 404,
      message: 'Announcement not found',
    };
  }

  const updatedAnnouncement = await announcementRepository.update(announcementId, announcementData);
  logger.info('Announcement updated', { announcementId });

  return updatedAnnouncement;
};

/**
 * Delete/Archive announcement (admin only)
 */
export const deleteAnnouncement = async (announcementId) => {
  const announcement = await announcementRepository.findById(announcementId);
  if (!announcement) {
    throw {
      statusCode: 404,
      message: 'Announcement not found',
    };
  }

  await announcementRepository.archive(announcementId);
  logger.info('Announcement archived', { announcementId });

  return { success: true };
};

export default {
  createAnnouncement,
  getAnnouncementById,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};
