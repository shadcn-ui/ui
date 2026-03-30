import { type Registry } from "shadcn/schema"

export const ui: Registry["items"] = [
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/button.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/button",
      },
    },
  },
]
