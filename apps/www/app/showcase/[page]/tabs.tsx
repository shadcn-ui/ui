import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowTopRightIcon } from "@radix-ui/react-icons"

import { SiteData } from "@/lib/fetch-site-data"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/registry/new-york/ui/button"
import { Card, CardContent, CardHeader } from "@/registry/new-york/ui/card"

type Paging = {
  total: number
  page: number
  limit: number
}

export function ShowcaseTabs({
  pages,
  paging,
}: {
  pages: SiteData[]
  paging: Paging
}) {
  const hasNext = paging.page * paging.limit < paging.total
  const hasPrev = paging.page > 1

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card className="duration-200 hover:-translate-y-1" key={page.url}>
            <CardHeader className="p-0">
              <img src={page.image} className="w-full rounded-t-xl" />
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <h3 className="font-semibold leading-none">{page.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {page.url}
                </p>
              </div>
              <Link
                target="_blank"
                rel="noreferrer"
                href={"https://" + page.url}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                View
                <ArrowTopRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12 flex items-center justify-center space-x-2">
        <Link href={hasPrev ? `/showcase/${paging.page - 1}` : {}}>
          <Button variant="outline" disabled={!hasPrev}>
            Previous
          </Button>
        </Link>
        <Link href={hasNext ? `/showcase/${paging.page + 1}` : {}}>
          <Button variant="outline" disabled={!hasNext}>
            Next
          </Button>
        </Link>
      </div>
    </div>
  )
}
