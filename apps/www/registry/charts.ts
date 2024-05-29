import { Registry } from "@/registry/schema"

export const charts: Registry = [
  {
    name: "line-chart-demo",
    type: "components:chart",
    registryDependencies: [],
    files: ["chart/line-chart-demo.tsx"],
  },
  {
    name: "line-chart-multiple",
    type: "components:chart",
    registryDependencies: [],
    files: ["chart/line-chart-multiple.tsx"],
  },
  {
    name: "line-chart-shape",
    type: "components:chart",
    registryDependencies: [],
    files: ["chart/line-chart-shape.tsx"],
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
    name: "bar-chart-multiple",
    type: "components:chart",
    registryDependencies: [],
    files: ["chart/bar-chart-multiple.tsx"],
  },
  {
    name: "bar-chart-horizontal",
    type: "components:chart",
    registryDependencies: [],
    files: ["chart/bar-chart-horizontal.tsx"],
  },
  {
    name: "tooltip-chart-demo",
    type: "components:chart",
    registryDependencies: [],
    files: ["chart/tooltip-chart-demo.tsx"],
  },
]
