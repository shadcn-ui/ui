import { type Registry } from "shadcn/schema"
import { z } from "zod"

import { blocks } from "@/registry/registry-blocks"
import { charts } from "@/registry/registry-charts"
import { examples } from "@/registry/registry-examples"
import { hooks } from "@/registry/registry-hooks"
import { internal } from "@/registry/registry-internal"
import { lib } from "@/registry/registry-lib"
import { themes } from "@/registry/registry-themes"
import { ui } from "@/registry/registry-ui"

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: [
    {
      name: "index",
      type: "registry:style",
      dependencies: [
        "tailwindcss-animate",
        "class-variance-authority",
        "lucide-react",
      ],
      registryDependencies: ["utils"],
      tailwind: {
        config: {
          plugins: ['require("tailwindcss-animate")'],
        },
      },
      cssVars: {},
      files: [],
    },
    {
      name: "style",
      type: "registry:style",
      dependencies: [
        "tailwindcss-animate",
        "class-variance-authority",
        "lucide-react",
      ],
      registryDependencies: ["utils"],
      tailwind: {
        config: {
          plugins: ['require("tailwindcss-animate")'],
        },
      },
      cssVars: {},
      files: [],
    },
    ...ui,
    ...blocks,
    ...charts,
    ...lib,
    ...hooks,
    ...themes,

    // Internal use only.
    ...internal,
    ...examples,
  ],
} satisfies Registry
