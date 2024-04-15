"use client"

import React, { Suspense } from "react"
import Link from "next/link"

import { docsConfig } from "@/config/docs"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import { registry } from "@/registry/registry"

import PreviewComponentOverview from "./previews"

export default function GridComponents() {
  const isMobile = useMediaQuery("(max-width: 1280px)")
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2 xl:gap-4 2xl:gap-6">
      <GridListPreview isDesktop={!isMobile} />
      {!isMobile && <GridListPreview isDesktop side="right" />}
    </div>
  )
}

function GridListPreview({
  isDesktop,
  side = "left",
}: {
  isDesktop?: boolean
  side?: "left" | "right"
}) {
  const getCompLabel = (componentName: string) => {
    return Object.values(docsConfig.sidebarNav[1].items).find(
      (item) => item.title.toLowerCase().split(" ").join("-") === componentName
    )?.label
  }

  return (
    <div className="flex flex-col gap-3 xl:gap-4 2xl:gap-6">
      {registry
        .filter((component) => component.type === "components:ui")
        .filter(
          (_, index) =>
            (index + (side === "right" ? 1 : 0)) % 2 === 0 || !isDesktop
        )
        .map((component, index) => (
          <Card
            key={side + index + component.name}
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
                {getCompLabel(component.name) && (
                  <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                    {getCompLabel(component.name)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pointer-events-none flex min-h-24 flex-1 items-center justify-center">
              <Suspense fallback={<Skeleton className="h-44 w-full" />}>
                <PreviewComponentOverview name={`${component.name}-demo`} />
              </Suspense>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
