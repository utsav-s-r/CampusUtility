import pg from 'pg';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const { Pool } = pg;

const poolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : null;

if (!poolConfig) {
  logger.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

// Old local configuration (Commented out)
/*
const localConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'smart_campus',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};
*/

const pool = new Pool({
  ...poolConfig,
  min: parseInt(process.env.DB_POOL_MIN) || 5,
  max: parseInt(process.env.DB_POOL_MAX) || 20,
});

pool.on('connect', () => {
  logger.info('Database pool connection established');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

/**
 * Execute a query
 * @param {string} text - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise<QueryResult>}
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      logger.warn(`Query took ${duration}ms: ${text}`);
    }
    return res;
  } catch (error) {
    logger.error(`Database query error: ${error.message}`, { query: text, params });
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<PoolClient>}
 */
export const getClient = async () => {
  return pool.connect();
};

/**
 * Close the pool
 */
export const closePool = async () => {
  await pool.end();
  logger.info('Database pool closed');
};

export default pool;
