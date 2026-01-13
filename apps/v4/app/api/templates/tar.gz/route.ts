import { readFile } from "fs/promises"
import { join } from "path"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const templatePath = join(
      process.cwd(),
      "public",
      "templates",
      "template.tar.gz"
    )
    const fileBuffer = await readFile(templatePath)

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": "attachment; filename=template.tar.gz",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving template:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to serve template",
      },
      { status: 500 }
    )
  }
}
