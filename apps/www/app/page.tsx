import Link from "next/link"
import Balance from "react-wrap-balancer"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"
import { DemoComponents } from "@/components/demo-components"
import { Icons } from "@/components/icons"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { PaletteSwitcher } from "@/components/palette-switcher"
import { PromoVideo } from "@/components/promo-video"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <div className="container relative">
      <div className="relative z-10">
        <PageHeader>
          <PageHeaderHeading>Build your component library.</PageHeaderHeading>
          <PageHeaderDescription>
            <Balance>
              Beautifully designed components that you can copy and paste into
              your apps. Accessible. Customizable. Open Source.
            </Balance>
          </PageHeaderDescription>
        </PageHeader>
        <section className="grid items-center gap-6">
          <div className="block md:hidden">
            <PromoVideo />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:flex-row">
              <Link href="/docs" className={buttonVariants({ size: "lg" })}>
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
              <pre className="hidden h-11 items-center justify-between space-x-2 overflow-x-auto rounded-lg bg-muted pr-2 pl-6 md:flex">
                <code className="font-mono text-sm font-semibold">
                  npx @shadcn/ui init
                </code>
                <CopyButton
                  value="npx create-next-app -e https://github.com/shadcn/next-template"
                  className="border-none"
                />
              </pre>
            </div>
            <div className="ml-auto">
              <PaletteSwitcher />
            </div>
          </div>
        </section>
        <section className="hidden pt-6 md:block">
          <DemoComponents />
        </section>
      </div>
    </div>
  )
}
