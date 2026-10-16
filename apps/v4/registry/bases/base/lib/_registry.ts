import { type Registry } from "shadcn/schema"

export const lib: Registry["items"] = [
  {
    name: "compose-class-name",
    type: "registry:lib",
    dependencies: ["cn"],
    files: [
      {
        path: "lib/compose-class-name.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "utils",
    type: "registry:lib",
    dependencies: ["cn"],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
      },
    ],
  },
]
