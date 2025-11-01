export const COMPONENT_LIBRARIES = [
  { name: "radix", title: "Radix UI" },
  { name: "base", title: "Base UI" },
] as const

export type ComponentLibrary = (typeof COMPONENT_LIBRARIES)[number]
