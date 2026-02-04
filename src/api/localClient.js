// Local Client for Entity Operations

import { authService } from '../auth/authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper function to make authenticated requests
async function makeRequest(url, options = {}) {
  const token = authService.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      authService.removeToken();
      throw new Error('Authentication required');
    }
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  // Handle 204 No Content responses (like DELETE operations)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Entity Methods Factory
function createEntityMethods(entityName) {
  // Special handling for User entity - use auth endpoint
  if (entityName === 'User') {
    return {
      async list() {
        return makeRequest(`${API_BASE_URL}/auth/users`);
      },
      async filter(query) {
        // For User, we'll fetch all and filter client-side since users are in auth system
        const users = await makeRequest(`${API_BASE_URL}/auth/users`);
        if (!query) return users;

        return users.filter(user => {
          return Object.keys(query).every(key => {
            if (query[key] === undefined) return true;
            return user[key] === query[key];
          });
        });
      },
      async get(id) {
        const users = await makeRequest(`${API_BASE_URL}/auth/users`);
        return users.find(u => u.id === id);
      },
      async update(id, data) {
        // For now, user updates through /me endpoint only
        // Admin user updates would need a new endpoint
        const users = await makeRequest(`${API_BASE_URL}/auth/users`);
        const user = users.find(u => u.id === id);
        if (!user) throw new Error('User not found');

        // You'll need to add a proper update endpoint for admin user updates
        return makeRequest(`${API_BASE_URL}/auth/users/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },
    };
  }

  const baseUrl = `${API_BASE_URL}/entities/${entityName.toLowerCase()}`;

  return {
    // List all entities with optional sorting, limiting, and field selection
    async list(sort, limit, skip, fields) {
      const params = new URLSearchParams();
      if (sort) params.append('sort', sort);
      if (limit) params.append('limit', limit);
      if (skip) params.append('skip', skip);
      if (fields) {
        const fieldString = Array.isArray(fields) ? fields.join(',') : fields;
        params.append('fields', fieldString);
      }

      const url = `${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
      return makeRequest(url);
    },

    // Filter entities with a query
    async filter(query, sort, limit, skip, fields) {
      const params = new URLSearchParams();
      params.append('q', JSON.stringify(query));
      if (sort) params.append('sort', sort);
      if (limit) params.append('limit', limit);
      if (skip) params.append('skip', skip);
      if (fields) {
        const fieldString = Array.isArray(fields) ? fields.join(',') : fields;
        params.append('fields', fieldString);
      }

      const url = `${baseUrl}?${params.toString()}`;
      return makeRequest(url);
    },

    // Get a single entity by ID
    async get(id) {
      return makeRequest(`${baseUrl}/${id}`);
    },

    // Create a new entity
    async create(data) {
      return makeRequest(baseUrl, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    // Update an entity
    async update(id, data) {
      return makeRequest(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // Delete an entity
    async delete(id) {
      return makeRequest(`${baseUrl}/${id}`, {
        method: 'DELETE',
      });
    },

    // Delete many entities matching a query
    async deleteMany(query) {
      return makeRequest(baseUrl, {
        method: 'DELETE',
        body: JSON.stringify(query),
      });
    },

    // Bulk create entities
    async bulkCreate(dataArray) {
      return makeRequest(`${baseUrl}/bulk`, {
        method: 'POST',
        body: JSON.stringify(dataArray),
      });
    },

    // Import entities from file
    async importEntities(file) {
      const token = authService.getToken();
      const formData = new FormData();
      formData.append('file', file, file.name);

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}/import`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to import entities');
      }

      return response.json();
    },
  };
}

// Create a client for entity operations
export function createLocalClient() {
  return {
    entities: new Proxy({}, {
      get(target, entityName) {
        if (typeof entityName === 'string' && entityName !== 'then') {
          return createEntityMethods(entityName);
        }
        return target[entityName];
      }
    }),
    auth: {
      me: () => authService.me(),
      updateMe: (data) => authService.updateMe(data),
      login: (nextUrl) => authService.login('google', nextUrl),
      logout: (redirectUrl) => authService.logout(redirectUrl),
      isAuthenticated: () => authService.isAuthenticated(),
    },
  };
}

export const localClient = createLocalClient();
