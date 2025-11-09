import { registryItemSchema } from "shadcn/schema"
import { z } from "zod"

export const BASES: z.infer<typeof registryItemSchema>[] = [
  {
    name: "radix",
    type: "registry:style",
    title: "Radix UI",
    description:
      "Optimized for fast development, easy maintenance, and accessibility.",
    dependencies: ["radix-ui"],
  },
]

export type Base = (typeof BASES)[number]
