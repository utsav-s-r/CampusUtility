/**
 * Authentication Controller
 * Handles HTTP requests for authentication
 */

import * as authService from '../services/authService.js';
import { createResponse } from '../utils/helpers.js';
import logger from '../config/logger.js';

/**
 * POST /auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    const user = await authService.register({
      email,
      password,
      name,
      role,
    });

    res.status(201).json(
      createResponse(true, 'User registered successfully', user)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        createResponse(false, 'Email and password are required')
      );
    }

    const result = await authService.login(email, password);

    res.status(200).json(
      createResponse(true, 'Login successful', result)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await authService.getUserById(userId);

    res.status(200).json(
      createResponse(true, 'Profile retrieved successfully', user)
    );
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getProfile,
};
