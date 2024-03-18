import React from "react"
import type { Metadata } from "next"
import Balancer from "react-wrap-balancer"

import { siteConfig } from "@/config/site"
import { absoluteUrl } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/registry/default/ui/breadcrumb"

import GridComponents from "./grid-components"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Overview",
    description: "Overview of all the components available.",
    openGraph: {
      title: "Overview",
      description: "Overview of all the components available.",
      type: "article",
      url: absoluteUrl("/docs/components"),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Overview",
      description: "Overview of all the components available.",
      images: [siteConfig.ogImage],
      creator: "@shadcn",
    },
  }
}

export default function ComponentsPage() {
  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="/docs/components">
                Components
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2">
          <h1 className="font-heading scroll-m-20 text-4xl font-bold">
            Components Overview
          </h1>
          <p className="text-lg text-muted-foreground">
            <Balancer>
              Here&apos;s an overview of all the components available.
            </Balancer>
          </p>
        </div>
        <GridComponents />
      </div>
    </main>
  )
}
