import { type Registry } from "shadcn/schema"

export const lib: Registry["items"] = [
  {
    name: "cn",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/cn.ts",
        type: "registry:lib",
      },
    ],
  },
]
