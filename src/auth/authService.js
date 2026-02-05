// Local Authentication Service

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// OAuth Configuration
// TODO: Set these in environment variables
const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI || `${window.location.origin}/auth/callback`,
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid profile email',
  },
  // Add more providers here (Facebook, GitHub, etc.)
};

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class AuthService {
  constructor() {
    this.token = null;
    this.loadToken();
  }

  // Token Management
  loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
  }

  getToken() {
    if (!this.token) {
      this.loadToken();
    }
    return this.token;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  // OAuth Login
  login(provider = 'google', nextUrl) {
    if (typeof window === 'undefined') {
      throw new Error('Login can only be called in browser environment');
    }

    const config = OAUTH_CONFIG[provider];
    if (!config) {
      throw new Error(`OAuth provider ${provider} not configured`);
    }

    const state = JSON.stringify({
      nextUrl: nextUrl || window.location.href,
      provider,
    });

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope,
      state: btoa(state),
      access_type: 'offline',
      prompt: 'consent',
    });

    window.location.href = `${config.authEndpoint}?${params.toString()}`;
  }

  // Handle OAuth Callback
  async handleCallback(code, state) {
    try {
      const decodedState = JSON.parse(atob(state));

      // Exchange code for token with your backend
      const response = await fetch(`${API_BASE_URL}/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          provider: decodedState.provider,
          redirectUri: OAUTH_CONFIG[decodedState.provider].redirectUri,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Authentication failed (${response.status})`);
      }

      const data = await response.json();
      this.setToken(data.token);

      // Store user data
      if (data.user && typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }

      return { user: data.user, nextUrl: decodedState.nextUrl };
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  // Logout
  async logout(redirectUrl) {
    this.removeToken();

    if (redirectUrl && typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  }

  // Get current user
  async me() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Try to get cached user first
    if (typeof window !== 'undefined') {
      const cachedUser = localStorage.getItem(USER_KEY);
      if (cachedUser) {
        try {
          return JSON.parse(cachedUser);
        } catch (e) {
          // If cache is invalid, continue to fetch
        }
      }
    }

    // Fetch user from API
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken();
          throw new Error('Authentication expired');
        }
        throw new Error('Failed to fetch user');
      }

      const user = await response.json();

      // Cache user data
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }

      return user;
    } catch (error) {
      // If API call fails, return mock user for development
      console.warn('API call failed, using mock user:', error);
      return this.getMockUser();
    }
  }

  // Update current user
  async updateMe(data) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const user = await response.json();

      // Update cached user
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }

      return user;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Check if authenticated
  async isAuthenticated() {
    try {
      await this.me();
      return true;
    } catch {
      return false;
    }
  }

  // Mock user for development (when backend is not available)
  getMockUser() {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Return a mock user based on stored token
    return {
      id: 'mock-user-1',
      email: 'user@example.com',
      full_name: 'Test User',
      role: 'user',
      created_at: new Date().toISOString(),
    };
  }

  // Set mock token for development
  setMockAuth() {
    const mockToken = 'mock-token-' + Date.now();
    this.setToken(mockToken);
    const mockUser = this.getMockUser();
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    }
    return mockUser;
  }
}

export const authService = new AuthService();

// Export a compatible user interface
export const User = {
  login: (nextUrl) => authService.login('google', nextUrl),
  logout: (redirectUrl) => authService.logout(redirectUrl),
  me: () => authService.me(),
  updateMe: (data) => authService.updateMe(data),
  isAuthenticated: () => authService.isAuthenticated(),
};
