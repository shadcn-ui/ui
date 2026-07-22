import { type BaseName } from "@/registry/config"

export function getDocsPathForItem(base: BaseName, item: string) {
  if (item.endsWith("-example")) {
    const component = item.slice(0, -"-example".length)
    return `/docs/components/${base}/${component}`
  }

  return "/docs/components"
}
