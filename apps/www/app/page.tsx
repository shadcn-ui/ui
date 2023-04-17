import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ExamplesNav } from "@/components/examples-nav"
import { Icons } from "@/components/icons"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { PromoVideo } from "@/components/promo-video"
import { StyleSwitcher } from "@/components/style-switcher"
import DashboardPage from "@/app/examples/dashboard/page"

export default function IndexPage() {
  return (
    <div className="container relative pb-10">
      <StyleSwitcher />
      <PageHeader>
        <PageHeaderHeading>Build your component library.</PageHeaderHeading>
        <PageHeaderDescription>
          Beautifully designed components that you can copy and paste into your
          apps. Accessible. Customizable. Open Source.
        </PageHeaderDescription>
      </PageHeader>
      <section className="pb-8 md:pb-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex space-x-4">
            <Link href="/docs" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href={siteConfig.links.github}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "pl-6"
              )}
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>
      </section>
      <ExamplesNav className="[&>a:first-child]:text-primary" />
      <section className="space-y-8 overflow-hidden rounded-lg border-2 border-primary dark:border-muted md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </section>
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
          <DashboardPage />
        </div>
      </section>
    </div>
  )
}
