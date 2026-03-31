import type { Registry } from "shadcn/schema"

export const lib: Registry["items"] = [
  {
    name: "_registry",
    type: "registry:composable",
    files: [
      {
        path: "composables/_registry.ts",
        type: "registry:composable",
      },
    ],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "utils",
    type: "registry:composable",
    files: [
      {
        path: "composables/utils.ts",
        type: "registry:composable",
      },
    ],
    registryDependencies: [],
    dependencies: [],
  },
]
