"use client"

import { ChevronRightIcon } from "lucide-react"
import { Metadata } from "next"
import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"
import { PackageForm } from "@/components/create-package-form"
import PackageFolderStructure from "@/components/create-package-layout"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Components built on top of Shadcn-UI & Radix UI primitives.",
}

export default function MarketplaceCreatePackage() {
  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Marketplace
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">Create</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
            Publish Components
          </h1>
            <p className="text-lg text-muted-foreground">
              <Balancer>Create Components built on top of Shadcn-UI & Radix UI primitives.</Balancer>
            </p>
        </div>
        <PackageForm/>
      </div>
      <PackageFolderStructure/>
    </main>
  )
}
