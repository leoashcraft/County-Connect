/**
 * Security utilities for client-side protection
 */

/**
 * Generate a random CSRF-like token for form submissions
 * Note: Real CSRF protection is handled server-side
 */
export function generateFormToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Validate file upload types
 */
export function validateFileType(file, allowedTypes = []) {
  if (!file) return false;
  
  const allowedExtensions = allowedTypes.length > 0 
    ? allowedTypes 
    : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
  
  const extension = file.name.split('.').pop().toLowerCase();
  return allowedExtensions.includes(extension);
}

/**
 * Validate file size (in MB)
 */
export function validateFileSize(file, maxSizeMB = 5) {
  if (!file) return false;
  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
  return file.size <= maxSize;
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.\.+/g, '.')
    .substring(0, 255);
}

/**
 * Rate limiting helper for client-side actions
 */
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  canProceed(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key) {
    this.attempts.delete(key);
  }
}

/**
 * Prevent clickjacking by checking if page is in an iframe
 */
export function preventClickjacking() {
  if (window.top !== window.self) {
    // Page is in an iframe
    window.top.location = window.self.location;
  }
}

/**
 * Secure localStorage wrapper with encryption-like obfuscation
 */
export const SecureStorage = {
  set(key, value) {
    try {
      const encoded = btoa(JSON.stringify(value));
      localStorage.setItem(key, encoded);
    } catch (error) {
      console.error('SecureStorage: Failed to set item', error);
    }
  },

  get(key) {
    try {
      const encoded = localStorage.getItem(key);
      if (!encoded) return null;
      return JSON.parse(atob(encoded));
    } catch (error) {
      console.error('SecureStorage: Failed to get item', error);
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  }
};

/**
 * Input validation helpers
 */
export const InputValidator = {
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  isValidPhone(phone) {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(phone);
  },

  isValidURL(url) {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },

  sanitizeInput(input) {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
};