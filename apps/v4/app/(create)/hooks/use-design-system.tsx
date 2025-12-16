"use client"

import {
  createIframeSyncStore,
  useIframeSyncAll,
  useIframeSyncValue,
} from "@/app/(create)/hooks/use-iframe-sync"
import {
  loadDesignSystemSearchParams,
  useDesignSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

const MESSAGE_TYPE = "design-system-params"

const getInitialValues = (): DesignSystemSearchParams => {
  const initialValues = loadDesignSystemSearchParams(
    typeof window === "undefined" ? "" : location.search
  )
  // Override defaults for iframe use case
  initialValues.item = "cover-example"
  return initialValues
}

const designSystemStore = createIframeSyncStore(
  MESSAGE_TYPE,
  getInitialValues()
)

export function useDesignSystemSync() {
  const [urlParams] = useDesignSystemSearchParams()

  const keys = Object.keys(urlParams) as (keyof DesignSystemSearchParams)[]

  return useIframeSyncAll(designSystemStore, keys, urlParams)
}

export function useDesignSystemParam<K extends keyof DesignSystemSearchParams>(
  key: K
) {
  const [urlParams] = useDesignSystemSearchParams()

  return useIframeSyncValue(designSystemStore, key, urlParams[key])
}
