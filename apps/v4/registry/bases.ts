export const BASES = [
  {
    name: "radix",
    title: "Radix UI",
    description:
      "Optimized for fast development, easy maintenance, and accessibility.",
  },
] as const

export type Base = (typeof BASES)[number]
