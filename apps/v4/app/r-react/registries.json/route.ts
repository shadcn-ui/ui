import { NextRequest, NextResponse } from "next/server"

import { buildRegistriesPayload } from "@/lib/force-ui-registries"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  return NextResponse.json(
    buildRegistriesPayload(request.nextUrl.origin, "react")
  )
}
