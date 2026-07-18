import { type Registry } from "shadcn/schema"

export const components: Registry["items"] = [
  {
    name: "example",
    title: "Example",
    type: "registry:component",
    files: [
      {
        path: "components/example.tsx",
        type: "registry:component",
      },
    ],
  },
]
