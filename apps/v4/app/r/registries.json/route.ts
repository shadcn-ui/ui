import { NextResponse } from "next/server"

import directory from "@/registry/directory.json"

export const dynamic = "force-static"

export async function GET() {
  const registries = directory.map(({ name, homepage, url, description }) => ({
    name,
    homepage,
    url,
    description,
  }))

  return NextResponse.json(registries)
}
