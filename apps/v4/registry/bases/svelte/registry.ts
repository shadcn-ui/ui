import { registryItemSchema, type Registry } from "shadcn/schema"
import { z } from "zod"

import { examples } from "./examples/_registry"
import { lib } from "./lib/_registry"
import { ui } from "./ui/_registry"

const SVELTE_STYLE = {
  type: "registry:style",
  dependencies: ["class-variance-authority", "svelte", "bits-ui"],
  devDependencies: ["tw-animate-css", "shadcn"],
  registryDependencies: ["utils"],
  css: {
    '@import "tw-animate-css"': {},
    '@import "shadcn/tailwind.css"': {},
    "@layer base": {
      "*": {
        "@apply border-border outline-ring/50": {},
      },
      body: {
        "@apply bg-background text-foreground": {},
      },
    },
  },
  cssVars: {},
  files: [],
}

export const registry = {
  name: "force-ui/svelte",
  homepage: "https://force-ui.com",
  items: z.array(registryItemSchema).parse([
    {
      name: "index",
      ...SVELTE_STYLE,
    },
    {
      name: "style",
      ...SVELTE_STYLE,
    },
    ...ui,
    ...examples,
    ...lib,
  ]),
} satisfies Registry
