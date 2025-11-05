"use client"

import { useEffect, useState } from "react"
import { useQueryStates } from "nuqs"

import {
  designSystemSearchParams,
  type DesignSystemSearchParams,
} from "@/app/(design)/lib/search-params"

const MESSAGE_TYPE = "design-system-params"

// Check if we're in an iframe.
const isInIframe = () => {
  if (typeof window === "undefined") return false
  return window.self !== window.top
}

/**
 * Hook to sync design system search params.
 * In parent: returns params from URL.
 * In iframe: listens for postMessage updates from parent, falls back to URL params.
 */
export function useDesignSystemSync() {
  const [urlParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })
  const [messageParams, setMessageParams] =
    useState<DesignSystemSearchParams>(urlParams)

  useEffect(() => {
    if (!isInIframe()) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === MESSAGE_TYPE && event.data.params) {
        setMessageParams(event.data.params)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // In iframe, use message params. In parent, use URL params.
  return isInIframe() ? messageParams : urlParams
}

/**
 * Hook to get a specific design system param.
 */
export function useDesignSystemParam<K extends keyof DesignSystemSearchParams>(
  key: K
) {
  const params = useDesignSystemSync()
  return params[key]
}
