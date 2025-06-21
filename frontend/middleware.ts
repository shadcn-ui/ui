import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role: string;
  exp: number;
  sub: string;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (!token) {
    return NextResponse.next();
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < now) {
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.set('token', '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      return res;
    }

    const role = decoded.role?.toLowerCase();

    if (pathname.startsWith('/admin') && role !== 'admin') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/superadmin') && role !== 'superuser') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/dashboard') && role === 'superuser') {
      url.pathname = '/superadmin';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.set('token', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return res;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/superadmin/:path*'],
};
