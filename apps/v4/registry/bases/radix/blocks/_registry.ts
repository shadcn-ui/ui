import { type Registry } from "shadcn/schema"

export const blocks: Registry["items"] = [
  {
    name: "cover",
    title: "Cover",
    type: "registry:block",
    registryDependencies: ["example"],
    files: [
      {
        path: "blocks/cover.tsx",
        type: "registry:block",
      },
    ],
  },
]
