import { Registry } from "@/registry/schema"

export const charts: Registry = [
  {
    name: "line-chart-demo",
    type: "components:chart",
    registryDependencies: [],
    files: ["chart/line-chart-demo.tsx"],
  },
  {
    name: "area-chart-demo",
    type: "components:chart",
    registryDependencies: [],
    files: ["chart/area-chart-demo.tsx"],
  },
  {
    name: "bar-chart-demo",
    type: "components:chart",
    registryDependencies: [],
    files: ["chart/bar-chart-demo.tsx"],
  },
  {
    name: "tooltip-chart-demo",
    type: "components:chart",
    registryDependencies: [],
    files: ["chart/tooltip-chart-demo.tsx"],
  },
]
