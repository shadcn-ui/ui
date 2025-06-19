/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { source } from "@/lib/source"

export const revalidate = false

export async function GET() {
  const scan = source.getPages().map(
    (d) => `# ${d.data.title}
URL: ${d.url}

${d.data.description}

${d.data?.content}`
  )
  const scanned = await Promise.all(scan)
  return new Response(scanned.join("\n\n"))
}
