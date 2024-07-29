"use client"

import { TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs"

const links = [
  {
    name: "Examples",
    tab: "examples",
  },
  {
    name: "Area Chart",
    tab: "area-chart",
  },
  {
    name: "Bar Chart",
    tab: "bar-chart",
  },
  {
    name: "Line Chart",
    tab: "line-chart",
  },
  {
    name: "Pie Chart",
    tab: "pie-chart",
  },
  {
    name: "Radar Chart",
    tab: "radar-chart",
  },
  {
    name: "Radial Chart",
    tab: "radial-chart",
  },
  {
    name: "Tooltip",
    tab: "tooltip",
  },
]

export function ChartsNav() {
  return (
    <TabsList>
      {links.map((link) => (
        <TabsTrigger key={link.tab} value={link.tab}>
          {link.name}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
