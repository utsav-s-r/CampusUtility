/**
 * Database Migration Script
 * Executes SQL migration files in order to set up the database schema
 * 
 * Usage: node scripts/migrate.js
 */

import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '../../database/migrations');

const { Pool } = pg;

// Create connection pool config
const poolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : null;

if (!poolConfig) {
  console.error('❌ DATABASE_URL is not defined in environment variables');
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

const pool = new Pool(poolConfig);

/**
 * Run migrations
 */
async function runMigrations() {
  const client = await pool.connect();

  try {
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✓ Migrations table ensured');

    // Read migration files
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files.filter(f => f.endsWith('.sql')).sort();

    console.log(`\n📂 Found ${migrationFiles.length} migration files\n`);

    // Execute each migration
    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      
      // Check if migration has already been executed
      const result = await client.query(
        'SELECT * FROM migrations WHERE name = $1',
        [file]
      );

      if (result.rows.length > 0) {
        console.log(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }

      try {
        const sql = await fs.readFile(migrationPath, 'utf-8');

        // Execute migration
        await client.query(sql);

        // Record migration as executed
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );

        console.log(`✓ Executed ${file}`);
      } catch (error) {
        console.error(`✗ Error executing ${file}:`);
        console.error(error.message);
        throw error;
      }
    }

    console.log('\n✓ All migrations completed successfully!\n');

    // Display table stats
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    if (tables.rows.length > 0) {
      console.log('📊 Created tables:');
      tables.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      console.log();
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.release();
    await pool.end();
  }
}

// Run migrations
runMigrations().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
