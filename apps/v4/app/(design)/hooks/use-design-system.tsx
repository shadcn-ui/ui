"use client"

import { useQueryStates } from "nuqs"

import {
  createIframeSyncStore,
  useIframeSyncAll,
  useIframeSyncValue,
} from "@/app/(design)/hooks/use-iframe-sync"
import {
  designSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(design)/lib/search-params"

const MESSAGE_TYPE = "design-system-params"

const getInitialValues = (): DesignSystemSearchParams => {
  if (typeof window === "undefined") {
    return {
      iconLibrary: "lucide",
      theme: "neutral",
      style: "vega",
      font: "inter",
      item: "cover-example",
      baseColor: "neutral",
      menuAccent: "subtle",
      menuColor: "default",
      spacing: "default",
      radius: "default",
      size: 100,
      custom: false,
    }
  }

  const searchParams = new URLSearchParams(window.location.search)
  return {
    iconLibrary: (searchParams.get("iconLibrary") ||
      "lucide") as DesignSystemSearchParams["iconLibrary"],
    theme: (searchParams.get("theme") ||
      "neutral") as DesignSystemSearchParams["theme"],
    style: (searchParams.get("style") ||
      "vega") as DesignSystemSearchParams["style"],
    font: (searchParams.get("font") ||
      "inter") as DesignSystemSearchParams["font"],
    item: searchParams.get("item") || "cover-example",
    baseColor: (searchParams.get("baseColor") ||
      "neutral") as DesignSystemSearchParams["baseColor"],
    menuAccent: (searchParams.get("menuAccent") ||
      "subtle") as DesignSystemSearchParams["menuAccent"],
    menuColor: (searchParams.get("menuColor") ||
      "default") as DesignSystemSearchParams["menuColor"],
    spacing: (searchParams.get("spacing") ||
      "default") as DesignSystemSearchParams["spacing"],
    radius: (searchParams.get("radius") ||
      "default") as DesignSystemSearchParams["radius"],
    size: parseInt(searchParams.get("size") || "100"),
    custom: (searchParams.get("custom") || "false") === "true",
  }
}

const designSystemStore = createIframeSyncStore(
  MESSAGE_TYPE,
  getInitialValues()
)

export function useDesignSystemSync() {
  const [urlParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  const keys = Object.keys(
    designSystemSearchParams
  ) as (keyof DesignSystemSearchParams)[]

  return useIframeSyncAll(designSystemStore, keys, urlParams)
}

export function useDesignSystemParam<K extends keyof DesignSystemSearchParams>(
  key: K
) {
  const [urlParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  return useIframeSyncValue(designSystemStore, key, urlParams[key])
}
