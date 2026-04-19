"use client"

import * as React from "react"
import { LayoutDashboard } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { WidgetType } from "@/lib/rgl-dashboard-types"
import { Badge } from "@/styles/radix-luma/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/radix-luma/ui/card"

/** Pre-written demo data for tiles (charts, tables, KPI copy). */
const kpiDemo = {
  revenue: {
    label: "Total revenue",
    value: "$48,234",
    delta: "+12.5%",
    positive: true,
  },
  activeUsers: {
    label: "Active users",
    value: "2,847",
    delta: "+3.2%",
    positive: true,
  },
  metric: {
    label: "Conversion",
    value: "3.24%",
    delta: "-0.4%",
    positive: false,
  },
} as const

const chartSeries = [
  { name: "Jan", value: 420 },
  { name: "Feb", value: 380 },
  { name: "Mar", value: 510 },
  { name: "Apr", value: 490 },
  { name: "May", value: 620 },
  { name: "Jun", value: 580 },
]

const barSeries = [
  { region: "NA", sales: 120 },
  { region: "EU", sales: 98 },
  { region: "APAC", sales: 156 },
  { region: "LATAM", sales: 64 },
]

const tableRows = [
  { id: "1", product: "Analytics API", status: "Live", revenue: "$12,400" },
  { id: "2", product: "Dashboard Pro", status: "Beta", revenue: "$8,920" },
  { id: "3", product: "Export add-on", status: "Live", revenue: "$3,100" },
  { id: "4", product: "SSO Enterprise", status: "Draft", revenue: "—" },
]

export function TileByWidget({ type }: { id: string; type: WidgetType }) {
  switch (type) {
    case "intro":
      return <IntroTile />
    case "kpi":
      return <KpiTile />
    case "chart":
      return <AreaChartTile />
    case "bar":
      return <BarChartTile />
    case "table":
      return <TableTile />
    case "metric":
      return <MetricTile />
    default:
      return (
        <Card className="h-full border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Unknown widget
            </CardTitle>
          </CardHeader>
        </Card>
      )
  }
}

/** @deprecated use TileByWidget with widgets map */
export function TileById({ id }: { id: string }) {
  const legacy: Record<string, WidgetType> = {
    "tile-intro": "intro",
    "tile-kpi": "kpi",
    "tile-chart": "chart",
    "tile-bar": "bar",
    "tile-table": "table",
    "tile-metric": "metric",
  }
  return <TileByWidget id={id} type={legacy[id] ?? "kpi"} />
}

function IntroTile() {
  return (
    <Card className="h-full border-border/80 bg-muted/30">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-lg leading-tight">
            Dashboard demo
          </CardTitle>
          <CardDescription>
            CRUD dashboards, add or remove tiles, toggle{" "}
            <strong className="text-foreground">Edit layout</strong> to drag and
            resize. Tile ids match{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">
              layout[].i
            </code>
            .
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

function KpiTile() {
  const k = kpiDemo.revenue
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardDescription>{k.label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{k.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <span
          className={
            k.positive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }
        >
          {k.delta}
        </span>
        <span className="text-sm text-muted-foreground"> vs last month</span>
      </CardContent>
    </Card>
  )
}

function AreaChartTile() {
  const gid = React.useId().replace(/:/g, "")
  const fillId = `fill-${gid}`
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="shrink-0 pb-2">
        <CardTitle className="text-base">Traffic</CardTitle>
        <CardDescription>Pre-written series (demo)</CardDescription>
      </CardHeader>
      <CardContent className="h-0 flex-1 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartSeries}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tick={{ fill: "var(--muted-foreground)" }}
              width={32}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--popover-foreground)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              fill={`url(#${fillId})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function BarChartTile() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="shrink-0 pb-2">
        <CardTitle className="text-base">Sales by region</CardTitle>
        <CardDescription>Static demo data</CardDescription>
      </CardHeader>
      <CardContent className="h-0 flex-1 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barSeries}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="region"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tick={{ fill: "var(--muted-foreground)" }}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--popover-foreground)",
              }}
            />
            <Bar
              dataKey="sales"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function TableTile() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="shrink-0 pb-2">
        <CardTitle className="text-base">Products</CardTitle>
        <CardDescription>Sample rows</CardDescription>
      </CardHeader>
      <CardContent className="scrollbar-tile h-0 flex-1 overflow-auto px-2">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="h-10 px-2 text-left font-medium text-muted-foreground">
                Product
              </th>
              <th className="h-10 px-2 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-10 px-2 text-right font-medium text-muted-foreground">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.id} className="border-b border-border/60">
                <td className="p-2 align-middle">{row.product}</td>
                <td className="p-2 align-middle">
                  <Badge
                    variant={row.status === "Live" ? "default" : "secondary"}
                  >
                    {row.status}
                  </Badge>
                </td>
                <td className="p-2 text-right align-middle tabular-nums">
                  {row.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

function MetricTile() {
  const k = kpiDemo.metric
  return (
    <Card className="h-full border-amber-500/30 bg-amber-500/5">
      <CardHeader className="pb-2">
        <CardDescription>{k.label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{k.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <span
          className={
            k.positive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }
        >
          {k.delta}
        </span>
        <p className="mt-2 text-xs text-muted-foreground">
          Pinned static tile in default layout.
        </p>
      </CardContent>
    </Card>
  )
}

export { TileByWidget as DashboardTile }
