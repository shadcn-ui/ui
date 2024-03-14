import { Registry } from "@/registry/schema"

export const blocks: Registry = [
  {
    name: "dashboard-products-empty",
    description: "An ecommerce dashboard showing an empty state.",
    type: "components:block",
    registryDependencies: ["badge", "button", "card", "dropdown-menu", "input"],
    files: ["block/dashboard-products-empty.tsx"],
  },
  {
    name: "card-share-this-document",
    description: "A card to share the current document.",
    type: "components:block",
    registryDependencies: [
      "avatar",
      "button",
      "card",
      "input",
      "label",
      "select",
      "separator",
    ],
    files: ["block/card-share-this-document.tsx"],
  },
  {
    name: "card-create-account",
    description: "A card to create an account.",
    type: "components:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: ["block/card-create-account.tsx"],
  },
]
