import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Index } from "@/__registry__"
import Balancer from "react-wrap-balancer"

import { docsConfig } from "@/config/docs"
import { siteConfig } from "@/config/site"
import { absoluteUrl } from "@/lib/utils"
import { ComponentPreview } from "@/components/component-preview"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/registry/default/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { registry } from "@/registry/registry"

import PreviewComponentOverview from "./previews"

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
        {/* <div className="grid grid-cols-1 gap-3 pb-12 pt-8 md:grid-cols-2 md:gap-4"> */}
        <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2 xl:gap-4 2xl:gap-6">
          <GridListPreview />
          <GridListPreview side="right" />
        </div>
      </div>
    </main>
  )
}

function GridListPreview({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <div className="flex flex-col gap-3 xl:gap-4 2xl:gap-6">
      {registry
        .filter((component) => component.type === "components:ui")
        .filter((_, index) => (index + (side === "right" ? 1 : 0)) % 2 === 0)
        .map((component, index) => (
          <Card
            key={side + index}
            className="relative flex h-min flex-col transition-colors hover:bg-accent/70"
          >
            <Link
              className="absolute inset-0 text-transparent"
              href={`/docs/components/${component.name}`}
            >
              Link
            </Link>
            <CardHeader className="pointer-events-none">
              <CardTitle className="flex items-center gap-2">
                <span>
                  {component.name.charAt(0).toLocaleUpperCase() +
                    component.name.slice(1)}
                </span>
                {docsConfig.sidebarNav.find(
                  (item) =>
                    item.title.toLowerCase().split(" ").join("-") ===
                    component.name
                )?.label && (
                  <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                    {
                      docsConfig.sidebarNav.find(
                        (item) =>
                          item.title.toLowerCase().split(" ").join("-") ===
                          component.name
                      )?.label
                    }
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pointer-events-none flex min-h-24 flex-1 items-center justify-center">
              <PreviewComponentOverview name={`${component.name}-demo`} />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
