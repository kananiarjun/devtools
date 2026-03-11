import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Routes that require authentication
const protectedRoutes = [
  '/url-shortener',
  '/dashboard',
  '/qr-generator',
  '/password-generator',
  '/json-formatter',
  '/image-to-pdf',
  '/image-upscaler',
  '/video-downloader',
];

// Routes that require admin access
const adminRoutes = ['/admin'];

// Auth pages that should not be shown to already authenticated users
const authRoutes = ['/auth/login', '/auth/signup'];

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check route groups
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const requiresAuth = isProtectedRoute || isAdminRoute;

  // Public pages can pass through immediately
  if (pathname === '/' || (!requiresAuth && !isAuthRoute)) {
    return NextResponse.next();
  }

  // Get token from Authorization header or cookie
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth_token')?.value;
  const user = token ? verifyToken(token) : null;

  // Keep logged-in users out of login/signup pages
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!user && requiresAuth) {
    // Redirect to login for protected routes
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin access for admin routes
  if (isAdminRoute && user?.role !== 'ADMIN') {
    // Redirect non-admin users to regular dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add user info to headers for downstream use
  const response = NextResponse.next();
  if (user) {
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-role', user.role);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
