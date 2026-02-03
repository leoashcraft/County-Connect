import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';
import { config } from '../config/config.js';

let db;
let dbType;

export async function initDatabase() {
  dbType = config.database.type;

  if (dbType === 'mysql') {
    db = await initMySQL();
  } else {
    db = initSQLite();
  }

  // Create tables
  await createTables();

  return db;
}

function initSQLite() {
  const sqliteDb = new Database(config.database.path);
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.pragma('foreign_keys = ON');
  console.log('SQLite database initialized');
  return sqliteDb;
}

async function initMySQL() {
  const pool = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  // Test connection
  try {
    const connection = await pool.getConnection();
    console.log('MySQL database connected');
    connection.release();
  } catch (error) {
    console.error('MySQL connection error:', error.message);
    throw error;
  }

  return pool;
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function getDatabaseType() {
  return dbType;
}

// Database abstraction methods
export const dbQuery = {
  // Execute a query and return all results
  all: async (sql, params = []) => {
    if (dbType === 'mysql') {
      const [rows] = await db.execute(sql, params);
      return rows;
    } else {
      const stmt = db.prepare(sql);
      return stmt.all(...params);
    }
  },

  // Execute a query and return the first result
  get: async (sql, params = []) => {
    if (dbType === 'mysql') {
      const [rows] = await db.execute(sql, params);
      return rows[0] || null;
    } else {
      const stmt = db.prepare(sql);
      return stmt.get(...params);
    }
  },

  // Execute a query (INSERT, UPDATE, DELETE)
  run: async (sql, params = []) => {
    if (dbType === 'mysql') {
      const [result] = await db.execute(sql, params);
      return {
        changes: result.affectedRows,
        lastInsertRowid: result.insertId,
      };
    } else {
      const stmt = db.prepare(sql);
      return stmt.run(...params);
    }
  },

  // Execute raw SQL (for DDL statements)
  exec: async (sql) => {
    if (dbType === 'mysql') {
      // Split by semicolon for multiple statements
      const statements = sql.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await db.execute(statement);
        }
      }
    } else {
      db.exec(sql);
    }
  },

  // Transaction support
  transaction: async (callback) => {
    if (dbType === 'mysql') {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
        await callback(connection);
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } else {
      const transaction = db.transaction(callback);
      transaction();
    }
  },
};

async function createTables() {
  if (dbType === 'mysql') {
    await createMySQLTables();
  } else {
    createSQLiteTables();
  }
}

function createSQLiteTables() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      picture TEXT,
      role TEXT DEFAULT 'user',
      oauth_provider TEXT,
      oauth_id TEXT,
      phone TEXT,
      preferred_town_id TEXT,
      street_address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      bio TEXT,
      is_verified_vendor INTEGER DEFAULT 0,
      verification_requested INTEGER DEFAULT 0,
      profile_completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Generic entities table (for flexible storage)
  db.exec(`
    CREATE TABLE IF NOT EXISTS entities (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      data TEXT NOT NULL,
      created_by TEXT,
      created_date TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Site settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      setting_key TEXT PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(entity_type);
    CREATE INDEX IF NOT EXISTS idx_entities_created_by ON entities(created_by);
  `);

  console.log('SQLite tables created successfully');
}

async function createMySQLTables() {
  // Users table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      full_name VARCHAR(255),
      picture TEXT,
      role VARCHAR(50) DEFAULT 'user',
      oauth_provider VARCHAR(50),
      oauth_id VARCHAR(255),
      phone VARCHAR(50),
      preferred_town_id VARCHAR(36),
      street_address VARCHAR(255),
      city VARCHAR(100),
      state VARCHAR(50),
      zip_code VARCHAR(20),
      bio TEXT,
      is_verified_vendor TINYINT(1) DEFAULT 0,
      verification_requested TINYINT(1) DEFAULT 0,
      profile_completed TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Generic entities table (for flexible storage)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS entities (
      id VARCHAR(36) PRIMARY KEY,
      entity_type VARCHAR(100) NOT NULL,
      data JSON NOT NULL,
      created_by VARCHAR(36),
      created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_entities_type (entity_type),
      INDEX idx_entities_created_by (created_by)
    )
  `);

  // Site settings table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  console.log('MySQL tables created successfully');
}

export async function closeDatabase() {
  if (db) {
    if (dbType === 'mysql') {
      await db.end();
    } else {
      db.close();
    }
    db = null;
  }
}
