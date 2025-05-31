import * as React from "react"
import { notFound } from "next/navigation"

import { cn } from "@/lib/utils"
import { ChartDisplay } from "@/components/chart-display"
import { charts } from "@/app/(app)/charts/charts"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

interface ChartPageProps {
  params: Promise<{
    type: string
  }>
}

const chartTypes = [
  "area",
  "bar",
  "line",
  "pie",
  "radar",
  "radial",
  "tooltip",
] as const
type ChartType = (typeof chartTypes)[number]

export async function generateStaticParams() {
  return chartTypes.map((type) => ({
    type,
  }))
}

export default async function ChartPage({ params }: ChartPageProps) {
  const { type } = await params

  if (!chartTypes.includes(type as ChartType)) {
    return notFound()
  }

  const chartType = type as ChartType
  const chartList = charts[chartType]

  return (
    <div className="grid flex-1 gap-12 lg:gap-24">
      <h2 className="sr-only">
        {type.charAt(0).toUpperCase() + type.slice(1)} Charts
      </h2>
      <div className="grid flex-1 scroll-mt-20 items-stretch gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
        {Array.from({ length: 12 }).map((_, index) => {
          const chart = chartList[index]
          return chart ? (
            <ChartDisplay
              key={chart.id}
              name={chart.id}
              className={cn(chart.fullWidth && "md:col-span-2 lg:col-span-3")}
            >
              <chart.component />
            </ChartDisplay>
          ) : (
            <div
              key={`empty-${index}`}
              className="hidden aspect-square w-full rounded-lg border border-dashed xl:block"
            />
          )
        })}
      </div>
    </div>
  )
}
