import { Registry } from "@/registry/schema"

export const blocks: Registry = [
  {
    name: "dashboard-01",
    type: "components:block",
    registryDependencies: ["button", "dropdown-menu", "input", "sheet"],
    files: ["block/dashboard-01.tsx"],
    category: "Application",
    subcategory: "Dashboard",
  },
  {
    name: "dashboard-02",
    type: "components:block",
    registryDependencies: ["badge", "button", "card", "dropdown-menu", "input"],
    files: ["block/dashboard-02.tsx"],
    category: "Application",
    subcategory: "Dashboard",
  },
]
