import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"

export function GitHubLink() {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        <Icons.gitHub />
        <React.Suspense fallback={<Skeleton className="h-4 w-[42px]" />}>
          <StarsCount />
        </React.Suspense>
      </Link>
    </Button>
  )
}

export async function StarsCount() {
  let displayCount: string | null = null

  try {
    const data = await fetch("https://api.github.com/repos/shadcn-ui/ui", {
      next: { revalidate: 86400 },
    })
    
    if (!data.ok) {
      return null
    }
    
    const json = await data.json()

    if (json.stargazers_count) {
      const formattedCount =
        json.stargazers_count >= 1000
          ? json.stargazers_count % 1000 === 0
            ? `${Math.floor(json.stargazers_count / 1000)}k`
            : `${(json.stargazers_count / 1000).toFixed(1)}k`
          : json.stargazers_count.toLocaleString()

      displayCount = formattedCount.replace(".0k", "k")
    }
  } catch (error) {
    return null
  }

  if (!displayCount) {
    return null
  }

  return (
    <span className="text-muted-foreground w-fit text-xs tabular-nums">
      {displayCount}
    </span>
  )
}
