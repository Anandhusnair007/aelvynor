/**
 * Next.js Middleware
 * Protects admin routes and handles authentication
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Admin routes that require authentication
const protectedAdminRoutes = [
  '/admin/dashboard',
  '/admin/mission',
  '/admin/product',
  '/admin/projects',
  '/admin/courses',
  '/admin/internships',
  '/admin/applications',
  '/admin/content',
  '/admin/settings',
  '/admin/logs'
];

// Public admin routes (login page)
const publicAdminRoutes = ['/admin/login'];

/**
 * Get token from cookie or header
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // Try cookie first
  const cookieToken = request.cookies.get('admin_token')?.value;
  if (cookieToken) return cookieToken;

  // Try Authorization header as fallback
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Verify if a path is a protected admin route
 */
function isProtectedAdminRoute(pathname: string): boolean {
  return protectedAdminRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Verify if a path is a public admin route
 */
function isPublicAdminRoute(pathname: string): boolean {
  return publicAdminRoutes.some((route) => pathname === route);
}

/**
 * Check if token is expired (basic check - full validation happens on backend)
 */
function isTokenExpired(token: string): boolean {
  try {
    // Decode JWT payload (without verification - just to check expiry)
    // Base64 decode the payload (second part of JWT)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    
    if (payload.exp) {
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > expiryTime;
    }
    
    return false;
  } catch {
    // If token is malformed, consider it expired
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only process admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(request);

  // Check if accessing protected admin route
  if (isProtectedAdminRoute(pathname)) {
    // No token or expired token - redirect to login
    if (!token || isTokenExpired(token)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token exists and not expired - allow access
    return NextResponse.next();
  }

  // Check if accessing login page while already authenticated
  if (isPublicAdminRoute(pathname) && pathname === '/admin/login') {
    if (token && !isTokenExpired(token)) {
      // Already logged in - redirect to dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // Allow access to other admin routes (like /admin itself)
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

