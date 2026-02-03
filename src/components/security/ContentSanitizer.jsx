import React from "react";
import DOMPurify from "dompurify";

/**
 * Component to safely render user-generated HTML content
 * Prevents XSS attacks by sanitizing HTML before rendering
 */
export default function ContentSanitizer({ html, className = "" }) {
  const sanitizedHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  });

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}

/**
 * Utility function to sanitize text input
 */
export function sanitizeText(text) {
  if (!text) return "";
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Utility function to validate and sanitize URLs
 */
export function sanitizeURL(url) {
  if (!url) return "";
  
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return "";
    }
    return url;
  } catch {
    return "";
  }
}

/**
 * Utility to validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Utility to validate phone format
 */
export function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone);
}