"use client"

import { Metadata } from "next"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"
import Balancer from "react-wrap-balancer"

import { getTableOfContents } from "@/lib/toc"
import { cn } from "@/lib/utils"
import { PackageType } from "@/lib/validations/packages"
import { Icons } from "@/components/icons"
import { MDRemote } from "@/components/marketplace-doc"
import { DashboardTableOfContents } from "@/components/toc"
import { badgeVariants } from "@/registry/new-york/ui/badge"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"
import MarketplacePreviw, { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { CodeBlockWrapper } from "@/components/code-block-wrapper"
import { CodeViewer } from "@/app/examples/playground/components/code-viewer"
import { Mdx } from "@/components/mdx-components"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Components built on top of Shadcn-UI & Radix UI primitives.",
}

const readMe = `
\`\`\`tsx 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog" 
\`\`\`

\`\`\`tsx {5-6}
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
\`\`\` `

const data: PackageType = {
  name: "name",
  description: `# hi`,
  type: "addons",
  dependencies: ["asdfghjk"],
  registryDependencies: ["Buttons"],
  files: [
    {
      content: "",
      dir: "hi",
      name: "name.tsx",
    },
  ],
}

const tocItems = [
  { title: "hi", url: "#hbdjf" },
  { title: "hi", url: "#hbdjf" },
  { title: "hi", url: "#hbdjf" },
  { title: "hi", url: "#hbdjf" },
  { title: "hi", url: "#hbdjf" },
]

const isRadix = data.dependencies?.includes("radix")
  ? {
      api: "@radix/djfin",
      link: "fshgdjkf",
    }
  : false
const isShadcn = data.registryDependencies || []

export default function MarketplaceCard() {
  const param = useParams()
  console.log(param)
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
        <div className="flex items-center space-x-2 pt-4">
          {isRadix && (
            <>
              {isRadix?.link && (
                <Link
                  href={isRadix.link}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(badgeVariants({ variant: "secondary" }))}
                >
                  <Icons.radix className="mr-1 h-3 w-3" />
                  Radix UI
                </Link>
              )}
            </>
          )}

          {isShadcn.length > 0 && (
            <>
              {isShadcn.map(e => (
                <Link
                  key={e} 
                  href={e}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(badgeVariants({ variant: "secondary" }))}
                >
                  <Icons.logo className="mr-1 h-3 w-3" />
                  shadcn/ui
                </Link>
              ))}
            </>
          )}
        </div>
        <div className="pb-12 pt-8">
          <MarketplacePreviw code={[
            "<ComponentSource src={data.files[0].content} />",
            "<ComponentSource src={data.files[0].content} />",
            "<ComponentSource src={data.files[0].content} />",
          ]}
          image="https://github.com/rajatsandeepsen.png"
          />
          <MDRemote source={readMe} />
        </div>
      </div>
      {true && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 pt-4">
            <ScrollArea className="pb-10">
              <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
                <DashboardTableOfContents toc={{ items: tocItems }} />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </main>
  )
}
