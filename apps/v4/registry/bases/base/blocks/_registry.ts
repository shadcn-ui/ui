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
  {
    name: "github",
    title: "GitHub",
    type: "registry:block",
    files: [
      {
        path: "blocks/github.tsx",
        type: "registry:block",
      },
    ],
  },
  {
    name: "chatgpt",
    title: "ChatGPT",
    type: "registry:block",
    files: [
      {
        path: "blocks/chatgpt.tsx",
        type: "registry:block",
      },
    ],
  },
]
