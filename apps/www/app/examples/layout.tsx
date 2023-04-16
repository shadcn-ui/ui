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
          <PageHeaderHeading>Check out some examples.</PageHeaderHeading>
          <PageHeaderDescription>
            Dashboard, cards, authentication. Some examples built using the
            components. Use this as a guide to build your own.
          </PageHeaderDescription>
        </PageHeader>
        <section className="pb-10">
          <div className="block md:hidden"></div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:flex-row">
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
                Browse Components
              </Link>
            </div>
          </div>
        </section>
        <section className="hidden md:block">
          <ExamplesNav />
          <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-xl">
            {children}
          </div>
        </section>
      </div>
    </>
  )
}
