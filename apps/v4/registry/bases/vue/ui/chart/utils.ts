import type { ChartConfig } from "."
import { isClient } from "@vueuse/core"
import { useId } from "reka-ui"
import { h, render } from "vue"

// Simple cache using a Map to store serialized object keys
const cache = new Map<string, string>()

// Convert object to a consistent string key
function serializeKey(key: Record<string, any>): string {
  return JSON.stringify(key, Object.keys(key).sort())
}

interface Constructor<P = any> {
  __isFragment?: never
  __isTeleport?: never
  __isSuspense?: never
  new (...args: any[]): {
    $props: P
  }
}

export function componentToString<P>(config: ChartConfig, component: Constructor<P>, props?: P) {
  if (!isClient)
    return

  // This function will be called once during mount lifecycle
  const id = useId()

  // https://unovis.dev/docs/auxiliary/Crosshair#component-props
  return (_data: any, x: number | Date) => {
    const data = "data" in _data ? _data.data : _data
    const serializedKey = `${id}-${serializeKey(data)}`
    const cachedContent = cache.get(serializedKey)
    if (cachedContent)
      return cachedContent

    const vnode = h<unknown>(component, { ...props, payload: data, config, x })
    const div = document.createElement("div")
    render(vnode, div)
    cache.set(serializedKey, div.innerHTML)
    return div.innerHTML
  }
}
