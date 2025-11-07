export const COMPONENT_LIBRARIES = [
  {
    name: "radix",
    title: "Radix UI",
    description:
      "Optimized for fast development, easy maintenance, and accessibility.",
  },
] as const

export type ComponentLibrary = (typeof COMPONENT_LIBRARIES)[number]
