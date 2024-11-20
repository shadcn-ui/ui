import { NextResponse } from "next/server"

import { API_URL } from "@/registry/new-york/blocks/app-01/lib/constants"

export async function GET() {
  const response = await fetch(API_URL)
  const data = await response.json()
  return NextResponse.json(data)
}
