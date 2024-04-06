import React from "react"
import Link from "next/link"

import { Button } from "@/registry/default/ui/button"

export default function NotFoundPage() {
  return (
    <div className="container mt-auto flex h-full min-h-full flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-8xl font-bold tracking-tight text-muted-foreground">
        404
      </h1>
      <p className="text-xg font-semibold">Page not found</p>
      <div className="mt-8 flex gap-2">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/docs/components">Components</Link>
        </Button>
      </div>
    </div>
  )
}
