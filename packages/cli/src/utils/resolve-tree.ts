import { Component } from "@/src/utils/get-components"

export async function resolveTree(components: Component[], names: string[]) {
  const componentsTree: Component[] = []

  for (const name of names) {
    const component = components.find((component) => component.name === name)

    if (!component) {
      continue
    }

    componentsTree.push(component)

    if (component.componentDependencies) {
      const dependencies = await resolveTree(
        components,
        component.componentDependencies
      )

      componentsTree.push(...dependencies)
    }
  }

  return componentsTree.filter(
    (component, index, self) =>
      self.findIndex((c) => c.name === component.name) === index
  )
}
