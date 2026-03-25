import { type registryItemSchema } from "shadcn/schema"
import { type z } from "zod"

export const BASES: z.infer<typeof registryItemSchema>[] = [
  {
    name: "radix",
    type: "registry:style",
    title: "Radix UI",
    description:
      "Optimized for fast development, easy maintenance, and accessibility.",
    dependencies: ["radix-ui"],
    meta: {
      logo: "<svg role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><title>Radix UI</title><path fill='currentColor' d='M11.52 24a7.68 7.68 0 0 1-7.68-7.68 7.68 7.68 0 0 1 7.68-7.68V24Zm0-24v7.68H3.84V0h7.68Zm4.8 7.68a3.84 3.84 0 1 1 0-7.68 3.84 3.84 0 0 1 0 7.68Z'/></svg>",
    },
  },
  {
    name: "base",
    type: "registry:style",
    title: "Base UI",
    description:
      "Components for building accessible web apps and design systems.",
    dependencies: ["@base-ui/react"],
    meta: {
      logo: "<svg width='17' height='24' viewBox='0 0 17 24'><path fill='currentColor' d='M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z'></path><path fill='currentColor'   d='M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z'></path></svg>",
    },
  },
]

export type Base = (typeof BASES)[number]
