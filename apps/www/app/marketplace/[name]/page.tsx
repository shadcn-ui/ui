import { Metadata } from "next"
import Link from "next/link"
import { useParams } from "next/navigation"
import { api } from "@/trpc/server"
import { ChevronRightIcon } from "lucide-react"
import Balancer from "react-wrap-balancer"

import { getTableOfContents } from "@/lib/toc"
import { cn } from "@/lib/utils"
import { PackageType } from "@/lib/validations/packages"
import { MarketplacePreviw } from "@/components/component-preview"
import { Icons } from "@/components/icons"
import { AsideMarketplaceExplore } from "@/components/marketplace-components"
import { MDRemote } from "@/components/marketplace-doc"
import { DashboardTableOfContents } from "@/components/toc"
import { badgeVariants } from "@/registry/new-york/ui/badge"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Components built on top of Shadcn-UI & Radix UI primitives.",
}

const tocItems = [
  { title: "hi", url: "#hbdjf" },
  { title: "hi", url: "#hbdjf" },
  { title: "hi", url: "#hbdjf" },
  { title: "hi", url: "#hbdjf" },
  { title: "hi", url: "#hbdjf" },
]

export default async function Page({ params }: { params: { name: string } }) {
  const data = await api.packages.getPackage.query({ name: params.name })
  if (!data) return null

  const dependency = data.dependencies?.map((e) => {
    const radix = e.startsWith("@radix-ui/react-")
      ? e.replace("@radix-ui/react-", "")
      : null
    return {
      radix,
      name: radix ? radix : e,
      link: radix
        ? `https://www.radix-ui.com/primitives/docs/components/${radix}`
        : `https://www.npmjs.com/${e}`,
    }
  })

  const shadcnui = data.registryDependencies?.map((e) => ({
    name: e,
    link: `/docs/components/${e}`,
  }))

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Marketplace
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">{data.name}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
            {data.name}
          </h1>
          {data.description && (
            <p className="text-lg text-muted-foreground">
              <Balancer>{data.description}</Balancer>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-4">
          {dependency &&
            dependency.map((r) => (
              <Link
                key={r.name}
                href={r.link}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: "secondary" }), "w-auto")}
              >
                {r.radix ? (
                  <Icons.radix className="mr-1 h-3 w-3" />
                ) : (
                  <Icons.npm className="mr-1 h-3 w-3" />
                )}
                {r.name}
              </Link>
            ))}

          {shadcnui &&
            shadcnui.map((e) => (
              <Link
                key={e.name}
                href={e.link}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: "secondary" }))}
              >
                <Icons.logo className="mr-1 h-3 w-3" />
                {e.name}
              </Link>
            ))}
        </div>
        <div className="pb-12 pt-8">
          {/* <MarketplacePreviw
            code={data?.files.map((e) => e.content)}
            image="https://github.com/rajatsandeepsen.png"
          /> */}
          <MDRemote source={``} />
        </div>
      </div>
      <AsideMarketplaceExplore />
    </main>
  )
}
