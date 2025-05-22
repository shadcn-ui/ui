import Link from "next/link"

import { BlockDisplay } from "@/components/block-display"
import { Button } from "@/registry/new-york-v4/ui/button"

export const dynamic = "force-static"
export const revalidate = false

const FEATURED_BLOCKS = [
  "dashboard-01",
  "sidebar-07",
  "sidebar-03",
  "login-03",
  "login-04",
]

export default async function BlocksPage() {
  return (
    <div>
      {FEATURED_BLOCKS.map((name) => (
        <div key={name} className="container py-8 first:pt-6 md:py-12 md:pr-3">
          <BlockDisplay name={name} />
        </div>
      ))}
      <div className="container-wrapper">
        <div className="container flex justify-center py-6">
          <Button asChild variant="outline">
            <Link href="/blocks/sidebar">Browse more blocks</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
