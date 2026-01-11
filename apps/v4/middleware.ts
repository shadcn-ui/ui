import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/login', '/register', '/forgot-password'];

// Public routes that don't require authentication
const publicRoutes = ['/erp/access-denied'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session_token')?.value;
  const hasSession = !!sessionToken;

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Check if route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if route is protected (starts with /erp)
  const isProtectedRoute = pathname.startsWith('/erp') && !isPublicRoute;

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes with active session
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/erp', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled by route handlers)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
