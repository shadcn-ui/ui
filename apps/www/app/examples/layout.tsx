import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ExamplesNav } from "@/components/examples-nav"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export const metadata: Metadata = {
  title: "Examples",
  description: "Check out some examples app built using the components.",
}

interface ExamplesLayoutProps {
  children: React.ReactNode
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return (
    <>
      <div className="container relative pb-10">
        <PageHeader className="page-header">
          <PageHeaderHeading className="hidden md:block">
            Check out some examples.
          </PageHeaderHeading>
          <PageHeaderHeading className="md:hidden">Examples</PageHeaderHeading>
          <PageHeaderDescription>
            Dashboard, cards, authentication. Some examples built using the
            components. Use this as a guide to build your own.
          </PageHeaderDescription>
        </PageHeader>
        <section className="pb-6 md:pb-10">
          <div className="flex w-full items-center justify-between">
            <div className="flex space-x-4">
              <Link
                href="/docs"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-[0.5rem]"
                )}
              >
                Get Started
              </Link>
              <Link
                href="/components"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-[0.5rem] pl-6"
                )}
              >
                Components
              </Link>
            </div>
          </div>
        </section>
        <section>
          <ExamplesNav />
          <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-xl">
            {children}
          </div>
        </section>
      </div>
    </>
  )
}
