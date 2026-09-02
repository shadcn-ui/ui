import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon, SearchIcon } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/new-york-v4/ui/empty"

export const metadata: Metadata = {
  title: "Page not found",
}

export default function NotFound() {
  return (
    <div
      data-slot="layout"
      className="group/layout relative z-10 flex min-h-svh flex-col bg-background has-data-[slot=designer]:h-svh has-data-[slot=designer]:overflow-hidden"
    >
      <SiteHeader />
      <main className="container-wrapper flex flex-1 items-center px-6 py-16">
        <div className="container flex justify-center">
          <Empty className="min-h-[420px] max-w-2xl border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchIcon />
              </EmptyMedia>
              <EmptyTitle>Page not found</EmptyTitle>
              <EmptyDescription>
                The page you&apos;re looking for doesn&apos;t exist or has
                moved.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild size="sm">
                  <Link href="/">
                    <ArrowLeftIcon />
                    Go home
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/docs/components">Browse components</Link>
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
