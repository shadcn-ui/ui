import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"

type Metric = {
  label: string
  value: string
  comparison: string
  change: string
  trend: "up" | "down"
}

const METRIC_CARDS: Metric[] = [
  {
    label: "Total visitors",
    value: "248.5k",
    comparison: "12.4%",
    change: "vs last period",
    trend: "up",
  },
  {
    label: "Unique readers",
    value: "182.1k",
    comparison: "8.7%",
    change: "vs last period",
    trend: "up",
  },
  {
    label: "Avg. time on page",
    value: "3m 42s",
    comparison: "1.2%",
    change: "vs last period",
    trend: "down",
  },
  {
    label: "Bounce rate",
    value: "42.8%",
    comparison: "3.5%",
    change: "vs last period",
    trend: "down",
  },
]

export function MetricsGrid() {
  return (
    <>
      {METRIC_CARDS.map((metric) => (
        <MetricCard
          key={metric.label}
          metric={metric}
          className="col-span-full md:col-span-6 lg:col-span-3"
        />
      ))}
    </>
  )
}

function MetricCard({
  metric,
  className,
}: {
  metric: Metric
  className: string
}) {
  return (
    <Card className={cn("gap-0", className)}>
      <CardContent className="flex flex-col gap-2">
        <CardDescription className="text-xs uppercase">
          {metric.label}
        </CardDescription>
        <CardTitle className="text-5xl tracking-tight lowercase">
          {metric.value}
        </CardTitle>
        <CardDescription>
          {metric.trend === "up" ? (
            <TrendingUpIcon className="inline-block size-2.5 text-muted-foreground" />
          ) : (
            <TrendingDownIcon className="inline-block size-2.5 text-muted-foreground" />
          )}{" "}
          <span className="text-foreground">{metric.comparison}</span>{" "}
          <span>{metric.change}</span>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
