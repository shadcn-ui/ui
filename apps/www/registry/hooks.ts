import { Registry } from "@/registry/schema"

export const hooks: Registry = [
  {
    name: "use-media-query",
    type: "registry:hook",
    dependencies: ["@react-hook/window-size@1.0.3"],
    files: [
      {
        path: "hooks/use-media-query.ts",
        type: "registry:hook",
      },
    ],
  },
]
