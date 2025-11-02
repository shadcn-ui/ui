export const COMPONENT_LIBRARIES = [
  {
    name: "radix",
    title: "Radix UI",
    description:
      "Optimized for fast development, easy maintenance, and accessibility.",
  },
  {
    name: "base",
    title: "Base UI",
    description:
      "Components for building accessible web apps and design systems.",
  },
] as const

export type ComponentLibrary = (typeof COMPONENT_LIBRARIES)[number]
