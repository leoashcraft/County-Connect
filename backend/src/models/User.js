import { dbQuery } from './database.js';
import { v4 as uuidv4 } from 'uuid';

const mysqlDatetime = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

export class UserModel {
  static async findByEmail(email) {
    return dbQuery.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async findById(id) {
    return dbQuery.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  static async create(userData) {
    const id = uuidv4();
    const now = mysqlDatetime();

    await dbQuery.run(
      `INSERT INTO users (id, email, full_name, picture, role, oauth_provider, oauth_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userData.email,
        userData.full_name || null,
        userData.picture || null,
        userData.role || 'user',
        userData.oauth_provider || null,
        userData.oauth_id || null,
        now,
        now
      ]
    );

    return this.findById(id);
  }

  static async update(id, userData) {
    const now = mysqlDatetime();

    const updates = [];
    const values = [];

    if (userData.full_name !== undefined) {
      updates.push('full_name = ?');
      values.push(userData.full_name);
    }
    if (userData.picture !== undefined) {
      updates.push('picture = ?');
      values.push(userData.picture);
    }
    if (userData.role !== undefined) {
      updates.push('role = ?');
      values.push(userData.role);
    }
    if (userData.is_verified_vendor !== undefined) {
      updates.push('is_verified_vendor = ?');
      values.push(userData.is_verified_vendor ? 1 : 0);
    }
    if (userData.verification_requested !== undefined) {
      updates.push('verification_requested = ?');
      values.push(userData.verification_requested ? 1 : 0);
    }
    if (userData.phone !== undefined) {
      updates.push('phone = ?');
      values.push(userData.phone);
    }
    if (userData.preferred_town_id !== undefined) {
      updates.push('preferred_town_id = ?');
      values.push(userData.preferred_town_id);
    }
    if (userData.street_address !== undefined) {
      updates.push('street_address = ?');
      values.push(userData.street_address);
    }
    if (userData.city !== undefined) {
      updates.push('city = ?');
      values.push(userData.city);
    }
    if (userData.state !== undefined) {
      updates.push('state = ?');
      values.push(userData.state);
    }
    if (userData.zip_code !== undefined) {
      updates.push('zip_code = ?');
      values.push(userData.zip_code);
    }
    if (userData.bio !== undefined) {
      updates.push('bio = ?');
      values.push(userData.bio);
    }
    if (userData.profile_completed !== undefined) {
      updates.push('profile_completed = ?');
      values.push(userData.profile_completed ? 1 : 0);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    await dbQuery.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async findOrCreate(oauthData) {
    let user = await this.findByEmail(oauthData.email);

    if (!user) {
      user = await this.create({
        email: oauthData.email,
        full_name: oauthData.name,
        picture: oauthData.picture,
        oauth_provider: oauthData.provider,
        oauth_id: oauthData.id,
      });
    }

    return user;
  }

  static async list() {
    return dbQuery.all('SELECT * FROM users ORDER BY created_at DESC');
  }

  static async delete(id) {
    return dbQuery.run('DELETE FROM users WHERE id = ?', [id]);
  }
}
