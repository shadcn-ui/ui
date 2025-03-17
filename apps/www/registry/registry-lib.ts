import { type Registry } from "shadcn/registry"

export const lib: Registry["items"] = [
  {
    name: "utils",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "composition",
    type: "registry:lib",
    files: [
      {
        path: "lib/composition.ts",
        type: "registry:lib",
      },
    ],
  },
]
