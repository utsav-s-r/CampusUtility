/**
 * Authentication Service
 * Handles user registration, login, and token management
 */

import * as userRepository from '../repositories/userRepository.js';
import { hashPassword, comparePassword, isValidEmail, isStrongPassword, sanitizeUser } from '../utils/helpers.js';
import { generateTokenPair } from '../config/auth.js';
import logger from '../config/logger.js';

/**
 * Register a new user
 * @throws {Error} If validation fails or user already exists
 */
export const register = async (userData) => {
  const { email, password, name, role } = userData;

  // Validate input
  if (!email || !password || !name) {
    throw {
      statusCode: 400,
      message: 'Email, password, and name are required',
    };
  }

  if (!isValidEmail(email)) {
    throw {
      statusCode: 400,
      message: 'Invalid email format',
    };
  }

  if (!isStrongPassword(password)) {
    throw {
      statusCode: 400,
      message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    };
  }

  // Check if user already exists
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw {
      statusCode: 400,
      message: 'Email already exists',
    };
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);
  const newUser = await userRepository.create({
    email,
    passwordHash,
    name,
    role: role || 'STUDENT',
  });

  logger.info('User registered successfully', { userId: newUser.id, email });
  return sanitizeUser(newUser);
};

/**
 * Login user
 * @returns {object} {accessToken, refreshToken, user}
 * @throws {Error} If credentials are invalid
 */
export const login = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw {
      statusCode: 400,
      message: 'Email and password are required',
    };
  }

  // Find user by email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw {
      statusCode: 401,
      message: 'Invalid email or password',
    };
  }

  // Compare passwords
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw {
      statusCode: 401,
      message: 'Invalid email or password',
    };
  }

  // Generate tokens
  const tokens = generateTokenPair(user);

  logger.info('User logged in successfully', { userId: user.id, email });

  return {
    ...tokens,
    user: sanitizeUser(user),
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw {
      statusCode: 404,
      message: 'User not found',
    };
  }
  return sanitizeUser(user);
};

export default {
  register,
  login,
  getUserById,
};
