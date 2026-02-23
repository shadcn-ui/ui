import Link from "next/link"

import { BlockDisplay } from "@/components/block-display"
import { Button } from "@/registry/new-york/ui/button"

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
      {FEATURED_BLOCKS.map((block) => (
        <div
          key={block}
          className="border-grid container border-b py-8 first:pt-6 last:border-b-0 md:py-12"
        >
          <BlockDisplay name={block} />
        </div>
      ))}
      <div className="container-wrapper">
        <div className="container flex justify-center py-6">
          <Button asChild variant="outline">
            <Link href="/blocks/sidebar">Browse all blocks</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
