import { Registry } from "@/registry/schema"

export const charts: Registry = [
  {
    name: "chart-area-01",
    type: "components:block",
    registryDependencies: ["card", "chart"],
    files: ["block/chart-area-01.tsx"],
    category: "Charts",
    subcategory: "Area",
  },
  {
    name: "chart-bar-01",
    type: "components:block",
    registryDependencies: ["card", "chart"],
    files: ["block/chart-bar-01.tsx"],
    category: "Charts",
    subcategory: "Bar",
  },
]
