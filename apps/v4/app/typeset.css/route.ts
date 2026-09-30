import { readFileSync } from "node:fs"
import { join } from "node:path"

export const dynamic = "force-dynamic"

// Serves the raw stylesheet for the customizer's Get Code button, read from
// disk so the copy is always the current source, never a stale snapshot.
export async function GET() {
  const css = readFileSync(
    join(process.cwd(), "app/(app)/(typeset)/typeset.css"),
    "utf-8"
  )

  return new Response(css, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}
