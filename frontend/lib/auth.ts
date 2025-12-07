/**
 * Authentication Utilities
 * Handles JWT token storage in secure cookies and localStorage fallback
 */

const TOKEN_COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY_COOKIE_NAME = 'admin_token_expiry';

/**
 * Set a cookie with secure options
 * Note: httpOnly cannot be set from client-side in Next.js
 * Use Secure and SameSite for security
 */
function setCookie(name: string, value: string, days: number = 30): void {
  if (typeof document === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Secure cookie settings (httpOnly must be set server-side)
  const cookieOptions = [
    `${name}=${value}`,
    `expires=${expires.toUTCString()}`,
    'path=/',
    'SameSite=Strict', // CSRF protection
    // 'Secure' flag should be set in production (HTTPS only)
    // For localhost development, we'll conditionally add it
    ...(window.location.protocol === 'https:' ? ['Secure'] : []),
  ].join('; ');

  document.cookie = cookieOptions;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }

  return null;
}

/**
 * Delete a cookie
 */
function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}

/**
 * Store authentication token in secure cookie
 * Also stores in localStorage as fallback
 */
export function setAuthToken(token: string, expiresInMinutes: number = 30): void {
  if (typeof window === 'undefined') return;

  // Store in cookie (primary)
  const days = expiresInMinutes / (24 * 60); // Convert minutes to days
  setCookie(TOKEN_COOKIE_NAME, token, days);

  // Store expiry time in cookie
  const expiryTime = Date.now() + expiresInMinutes * 60 * 1000;
  setCookie(TOKEN_EXPIRY_COOKIE_NAME, expiryTime.toString(), days);

  // Also store in localStorage as fallback
  localStorage.setItem(TOKEN_COOKIE_NAME, token);
  localStorage.setItem(TOKEN_EXPIRY_COOKIE_NAME, expiryTime.toString());
}

/**
 * Get authentication token from cookie or localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Try cookie first
  let token = getCookie(TOKEN_COOKIE_NAME);
  let expiry = getCookie(TOKEN_EXPIRY_COOKIE_NAME);

  // Fallback to localStorage
  if (!token) {
    token = localStorage.getItem(TOKEN_COOKIE_NAME);
    expiry = localStorage.getItem(TOKEN_EXPIRY_COOKIE_NAME);
  }

  // Check if token is expired
  if (token && expiry) {
    const expiryTime = parseInt(expiry, 10);
    if (Date.now() > expiryTime) {
      // Token expired, clear it
      clearAuthToken();
      return null;
    }
  }

  return token;
}

/**
 * Clear authentication token from both cookie and localStorage
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;

  // Clear cookies
  deleteCookie(TOKEN_COOKIE_NAME);
  deleteCookie(TOKEN_EXPIRY_COOKIE_NAME);

  // Clear localStorage
  localStorage.removeItem(TOKEN_COOKIE_NAME);
  localStorage.removeItem(TOKEN_EXPIRY_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Get Authorization header value
 */
export function getAuthHeader(): string | null {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : null;
}
