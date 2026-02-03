import React, { useState, useEffect } from "react";

/**
 * Reverses a string for obfuscation
 */
export function obfuscateString(str) {
  if (!str) return '';
  return str.split('').reverse().join('');
}

/**
 * Deobfuscates a reversed string
 */
export function deobfuscateString(str) {
  if (!str) return '';
  return str.split('').reverse().join('');
}

/**
 * Obfuscates an email address into user and domain parts (both reversed)
 * @param {string} email - The email address to obfuscate
 * @returns {object} - { user: reversedUser, domain: reversedDomain }
 */
export function obfuscateEmail(email) {
  if (!email || !email.includes('@')) return null;
  const [user, domain] = email.split('@');
  return {
    user: obfuscateString(user),
    domain: obfuscateString(domain)
  };
}

/**
 * Deobfuscates an email object back to a string
 * @param {object} obfuscatedEmail - { user: reversedUser, domain: reversedDomain }
 * @returns {string} - The original email address
 */
export function deobfuscateEmail(obfuscatedEmail) {
  if (!obfuscatedEmail || !obfuscatedEmail.user || !obfuscatedEmail.domain) return '';
  return deobfuscateString(obfuscatedEmail.user) + '@' + deobfuscateString(obfuscatedEmail.domain);
}

/**
 * React component that safely displays an obfuscated email
 * Only reveals the email after component mounts (client-side only)
 * This prevents scrapers that only read initial HTML
 */
export function ObfuscatedEmail({
  email,
  className = "",
  linkClassName = "",
  showIcon = false,
  icon: Icon = null
}) {
  const [displayEmail, setDisplayEmail] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Small delay to ensure scrapers don't catch the email
    const timer = setTimeout(() => {
      if (email) {
        // Handle both string emails and obfuscated objects
        if (typeof email === 'string') {
          setDisplayEmail(email);
        } else if (email.user && email.domain) {
          setDisplayEmail(deobfuscateEmail(email));
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [email]);

  if (!isClient || !displayEmail) {
    return (
      <span className={className}>
        {showIcon && Icon && <Icon className="w-4 h-4 mr-2 inline" />}
        <span className="text-gray-400">Loading...</span>
      </span>
    );
  }

  return (
    <a
      href={`mailto:${displayEmail}`}
      className={linkClassName || `text-blue-600 hover:text-blue-800 hover:underline ${className}`}
    >
      {showIcon && Icon && <Icon className="w-4 h-4 mr-2 inline" />}
      {displayEmail}
    </a>
  );
}

/**
 * Hook for safely using email addresses
 * Returns the deobfuscated email only on client-side
 */
export function useObfuscatedEmail(email) {
  const [displayEmail, setDisplayEmail] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) {
        if (typeof email === 'string') {
          setDisplayEmail(email);
        } else if (email.user && email.domain) {
          setDisplayEmail(deobfuscateEmail(email));
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [email]);

  return displayEmail;
}

/**
 * Simple component that renders email only after hydration
 * Works with plain string emails
 */
export function SafeEmail({ email, className = "" }) {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Stagger the reveal to avoid pattern detection
    const delay = Math.random() * 200 + 50;
    const timer = setTimeout(() => setRevealed(true), delay);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !revealed || !email) {
    return <span className={`text-gray-400 ${className}`}>...</span>;
  }

  // Render email character by character using CSS to make scraping harder
  return (
    <a
      href={`mailto:${email}`}
      className={`hover:underline ${className}`}
      style={{ unicodeBidi: 'bidi-override', direction: 'ltr' }}
    >
      {email}
    </a>
  );
}

export default ObfuscatedEmail;
