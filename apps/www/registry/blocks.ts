import { Registry } from "@/registry/schema"

export const blocks: Registry = [
  {
    name: "dashboard-products-empty",
    description: "An ecommerce dashboard showing an empty state.",
    type: "components:block",
    registryDependencies: ["badge", "button", "card", "dropdown-menu", "input"],
    files: ["block/dashboard-products-empty.tsx"],
    category: "Application",
    subcategory: "Dashboard",
  },
]
