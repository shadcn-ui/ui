import { Metadata } from "next"
import Link from "next/link"
import { api } from "@/trpc/server"
import { ChevronRightIcon } from "lucide-react"
import Balancer from "react-wrap-balancer"

import { getReadme } from "@/lib/madeup-readme"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { AsideMarketplaceExplore } from "@/components/marketplace-components"
import { MDRemote } from "@/components/marketplace-doc"
import { badgeVariants } from "@/registry/new-york/ui/badge"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Components built on top of Shadcn-UI & Radix UI primitives.",
}

export default async function Page({ params }: { params: { name: string } }) {
  const data = await api.packages.getPackage.query({ name: params.name })
  if (!data) throw new Error("Addons not found")

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

  const readmeSource = 
    data.files?.find((e) => e.name === "README.md")?.content || getReadme(data)

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
          {data.author && (
            <p className="text-lg text-muted-foreground">
              Created by{" "}
              <Link
                href={`https://github.com/${data.author.username}`}
                className="text-lg text-muted-foreground"
              >
                {data.author.username}
              </Link>
            </p>
          )}
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
                className={cn(
                  badgeVariants({ variant: "secondary" }),
                  "w-auto"
                )}
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
          <MDRemote source={readmeSource} />
        </div>
      </div>
      <AsideMarketplaceExplore />
    </main>
  )
}
