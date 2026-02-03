import { dbQuery, getDatabaseType } from './database.js';
import { v4 as uuidv4 } from 'uuid';

// Validate field names to prevent SQL injection
// Only allows alphanumeric, underscores, and dots (for nested JSON paths)
function validateFieldName(fieldName) {
  if (typeof fieldName !== 'string' || fieldName.length === 0 || fieldName.length > 100) {
    throw new Error(`Invalid field name: ${fieldName}`);
  }
  // Only allow alphanumeric, underscore, and dot (for nested paths like "address.city")
  const validPattern = /^[a-zA-Z_][a-zA-Z0-9_.]*$/;
  if (!validPattern.test(fieldName)) {
    throw new Error(`Invalid field name: ${fieldName}`);
  }
  return fieldName;
}

// Helper to get JSON extract syntax based on database type
function jsonExtract(field) {
  const dbType = getDatabaseType();
  if (dbType === 'mysql') {
    return `JSON_UNQUOTE(JSON_EXTRACT(data, '$.${field}'))`;
  }
  return `json_extract(data, '$.${field}')`;
}

export class EntityModel {
  static async findById(entityType, id) {
    const row = await dbQuery.get(
      'SELECT * FROM entities WHERE entity_type = ? AND id = ?',
      [entityType, id]
    );

    if (!row) return null;

    const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    return {
      id: row.id,
      ...data,
      created_by: row.created_by,
      created_date: row.created_date,
      updated_date: row.updated_date,
    };
  }

  static async list(entityType, options = {}) {
    const { sort = '-created_date', limit, skip = 0 } = options;
    const dbType = getDatabaseType();

    // Determine sort order
    let orderBy = 'created_date DESC';
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';
      const validatedField = validateFieldName(sortField);
      if (validatedField === 'created_date' || validatedField === 'updated_date') {
        orderBy = `${validatedField} ${sortOrder}`;
      } else {
        orderBy = `${jsonExtract(validatedField)} ${sortOrder}`;
      }
    }

    let query = `SELECT * FROM entities WHERE entity_type = ? ORDER BY ${orderBy}`;
    const params = [entityType];

    if (limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, skip);
    }

    const rows = await dbQuery.all(query, params);

    return rows.map(row => {
      const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      return {
        id: row.id,
        ...data,
        created_by: row.created_by,
        created_date: row.created_date,
        updated_date: row.updated_date,
      };
    });
  }

  static async filter(entityType, query, options = {}) {
    const { sort = '-created_date', limit, skip = 0 } = options;
    const dbType = getDatabaseType();

    // Build WHERE clause from query
    const whereConditions = [];
    const params = [entityType];

    for (const [key, value] of Object.entries(query)) {
      const validatedKey = validateFieldName(key);
      if (validatedKey === 'created_date' || validatedKey === 'updated_date') {
        whereConditions.push(`${validatedKey} = ?`);
        params.push(value);
      } else {
        if (dbType === 'mysql') {
          whereConditions.push(`JSON_UNQUOTE(JSON_EXTRACT(data, '$.${validatedKey}')) = ?`);
          params.push(typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value));
        } else {
          whereConditions.push(`json_extract(data, '$.${validatedKey}') = ?`);
          // Handle different types correctly for SQLite
          if (typeof value === 'boolean') {
            params.push(value ? 1 : 0);
          } else if (typeof value === 'string') {
            params.push(value);
          } else {
            params.push(JSON.stringify(value));
          }
        }
      }
    }

    // Determine sort order
    let orderBy = 'created_date DESC';
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';
      const validatedField = validateFieldName(sortField);
      if (validatedField === 'created_date' || validatedField === 'updated_date') {
        orderBy = `${validatedField} ${sortOrder}`;
      } else {
        orderBy = `${jsonExtract(validatedField)} ${sortOrder}`;
      }
    }

    let sql = `SELECT * FROM entities WHERE entity_type = ?`;
    if (whereConditions.length > 0) {
      sql += ` AND ${whereConditions.join(' AND ')}`;
    }
    sql += ` ORDER BY ${orderBy}`;

    if (limit) {
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, skip);
    }

    const rows = await dbQuery.all(sql, params);

    return rows.map(row => {
      const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      return {
        id: row.id,
        ...data,
        created_by: row.created_by,
        created_date: row.created_date,
        updated_date: row.updated_date,
      };
    });
  }

  static async create(entityType, data, userId = null) {
    const id = uuidv4();
    const now = new Date().toISOString();

    // Remove id, created_date, updated_date from data if present
    const { id: _, created_date: __, updated_date: ___, ...cleanData } = data;

    await dbQuery.run(
      `INSERT INTO entities (id, entity_type, data, created_by, created_date, updated_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, entityType, JSON.stringify(cleanData), userId, now, now]
    );

    return this.findById(entityType, id);
  }

  static async update(entityType, id, data) {
    const existing = await this.findById(entityType, id);

    if (!existing) {
      return null;
    }

    const now = new Date().toISOString();

    // Remove system fields from update
    const { id: _, created_date: __, updated_date: ___, ...cleanData } = data;

    // Merge with existing data
    const mergedData = { ...existing, ...cleanData };
    delete mergedData.id;
    delete mergedData.created_date;
    delete mergedData.updated_date;
    delete mergedData.created_by;

    await dbQuery.run(
      `UPDATE entities SET data = ?, updated_date = ? WHERE id = ? AND entity_type = ?`,
      [JSON.stringify(mergedData), now, id, entityType]
    );

    return this.findById(entityType, id);
  }

  static async delete(entityType, id) {
    const result = await dbQuery.run(
      'DELETE FROM entities WHERE entity_type = ? AND id = ?',
      [entityType, id]
    );
    return result.changes > 0;
  }

  static async deleteMany(entityType, query) {
    const dbType = getDatabaseType();
    const whereConditions = [];
    const params = [entityType];

    for (const [key, value] of Object.entries(query)) {
      const validatedKey = validateFieldName(key);
      if (dbType === 'mysql') {
        whereConditions.push(`JSON_UNQUOTE(JSON_EXTRACT(data, '$.${validatedKey}')) = ?`);
        params.push(typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value));
      } else {
        whereConditions.push(`json_extract(data, '$.${validatedKey}') = ?`);
        if (typeof value === 'boolean') {
          params.push(value ? 1 : 0);
        } else if (typeof value === 'string') {
          params.push(value);
        } else {
          params.push(JSON.stringify(value));
        }
      }
    }

    let sql = `DELETE FROM entities WHERE entity_type = ?`;
    if (whereConditions.length > 0) {
      sql += ` AND ${whereConditions.join(' AND ')}`;
    }

    const result = await dbQuery.run(sql, params);
    return result.changes;
  }

  static async bulkCreate(entityType, dataArray, userId = null) {
    const results = [];

    for (const item of dataArray) {
      const created = await this.create(entityType, item, userId);
      results.push(created);
    }

    return results;
  }
}
