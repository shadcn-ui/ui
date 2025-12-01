import { type Registry } from "shadcn/schema"

export const blocks: Registry["items"] = [
  {
    name: "vercel",
    title: "Vercel",
    type: "registry:block",
    files: [
      {
        path: "blocks/vercel.tsx",
        type: "registry:block",
      },
    ],
  },
]
