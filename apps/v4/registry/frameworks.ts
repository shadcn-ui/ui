export const FRAMEWORKS = [
  {
    name: "react",
    title: "React",
    bases: ["radix", "base"],
    registry: "@force-ui",
  },
  {
    name: "vue",
    title: "Vue",
    bases: ["vue"],
    registry: "@force-ui-vue",
  },
  {
    name: "svelte",
    title: "Svelte",
    bases: ["svelte"],
    registry: "@force-ui-svelte",
  },
  {
    name: "ember",
    title: "Ember",
    bases: ["ember"],
    registry: "@force-ui-ember",
  },
] as const

export type Framework = (typeof FRAMEWORKS)[number]

const REACT_BASES = new Set(["radix", "base"])

export function getFrameworkForBase(base: string): Framework {
  if (REACT_BASES.has(base)) {
    return FRAMEWORKS[0]
  }
  const fw = FRAMEWORKS.find((f) => f.bases.includes(base))
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
    case "ember":
      return "ember"
    default:
      return "radix"
  }
}

export function getRegistryForFramework(framework: string): string {
  const fw = FRAMEWORKS.find((f) => f.name === framework)
  return fw?.registry ?? "@force-ui"
}

export function getFrameworkByName(name: string): Framework {
  return FRAMEWORKS.find((f) => f.name === name) ?? FRAMEWORKS[0]
}
