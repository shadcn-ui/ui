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
    name: "chart-area-02",
    type: "components:block",
    registryDependencies: ["card", "chart"],
    files: ["block/chart-area-02.tsx"],
    category: "Charts",
    subcategory: "Area",
  },
]
