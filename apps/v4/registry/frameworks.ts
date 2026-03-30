export const FRAMEWORKS = [
  { name: "react", title: "React", bases: ["radix", "base"] },
  { name: "vue", title: "Vue", bases: [] as string[] },
  { name: "svelte", title: "Svelte", bases: [] as string[] },
] as const

export type Framework = (typeof FRAMEWORKS)[number]

const REACT_BASES = new Set(["radix", "base"])

export function getFrameworkForBase(base: string): Framework {
  if (REACT_BASES.has(base)) {
    return FRAMEWORKS[0]
  }
  const fw = FRAMEWORKS.find((f) => f.name === base)
  return fw ?? FRAMEWORKS[0]
}

export function isReactBase(base: string): boolean {
  return REACT_BASES.has(base)
}

export function getDefaultBaseForFramework(framework: string): string {
  switch (framework) {
    case "react":
      return "radix"
    case "vue":
      return "vue"
    case "svelte":
      return "svelte"
    default:
      return "radix"
  }
}
