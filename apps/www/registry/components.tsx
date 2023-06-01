import * as React from "react"
import { Style } from "@/registry/styles"

type Components = {
  [key: string]: {
    components: Record<
      Style,
      React.LazyExoticComponent<React.ComponentType<any>>
    >
  }
}

export const Components: Components = {
  "input-with-button": {
    components: {
      default: React.lazy(
        () => import("@/registry/default/component/input-with-button")
      ),
      "new-york": React.lazy(
        () => import("@/registry/new-york/component/input-with-button")
      ),
    },
  },
} as const
