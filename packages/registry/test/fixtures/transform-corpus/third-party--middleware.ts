import { NextResponse, type NextRequest } from "next/server"

import { getSession } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await getSession(request)

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
