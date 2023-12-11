import { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { MarketplaceNav } from "@/components/marketplace-nav"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { buttonVariants } from "@/registry/new-york/ui/button"
import { Separator } from "@/registry/new-york/ui/separator"
import { Icons } from "@/components/icons"
import { badgeVariants } from "@/registry/new-york/ui/badge"
import MarketplaceExplore from "@/components/marketplace-components"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Components built on top of Shadcn-UI & Radix UI primitives.",
}

export default async function MarketplaceLayout() {
  const session = null 
  
  return (
    <>
      <div className="container relative">
        <PageHeader className="page-header pb-8">
          <Link
            href="/docs/changelog"
            className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
          >
            🎉 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
            <span className="sm:hidden">Marketplace, a new CLI and more.</span>
            <span className="hidden sm:inline">
              Introducing Marketplace, a new CLI and more.
            </span>
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
          <PageHeaderHeading className="hidden md:block">
          The Component Marketplace.
          </PageHeaderHeading>
          <PageHeaderHeading className="md:hidden">The Component Marketplace</PageHeaderHeading>
          <PageHeaderDescription>
            Highly customizable library marketplace from your favourite creators. Components built on top of
              <Link
                href={"/"}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: "secondary" }), "mx-2")}
              >
                Shadcn UI
              </Link>
              ,
              <Link
                href={"/"}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: "secondary" }), "mx-2")}
              >
                Tailwind CSS
              </Link>
              &
            <Link
                href={"https://www.radix-ui.com/"}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: "secondary" }), "mx-2")}
              >
                <Icons.radix className="mr-1 h-3 w-3" />
                Radix UI
              </Link>
              primitives.
          </PageHeaderDescription>
          <section className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
            <Link
              href="/docs"
              className={cn(buttonVariants(), "rounded-[6px]")}
            >
              Explore
            </Link>
            <Link
              href="/components"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-[6px]"
              )}
            >
              {session ? "Build your own components" : "Login to Github" } 
            </Link>
          </section>
        </PageHeader>
        <section>
          <MarketplaceNav />
          <div className="overflow-hidden rounded-[0.5rem] bg-background shadow">
            <MarketplaceExplore/>
          </div>
        </section>
      </div>
    </>
  )
}
