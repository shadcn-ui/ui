"use client"

import { useEffect, useSyncExternalStore } from "react"
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

// Store for params in iframe context.
const paramStore = new Map<string, any>()
const paramListeners = new Map<string, Set<() => void>>()

// Initialize store with URL params on client.
if (typeof window !== "undefined") {
  const searchParams = new URLSearchParams(window.location.search)
  const iconLibrary = searchParams.get("iconLibrary") || "lucide"
  const theme = searchParams.get("theme") || "neutral"
  const style = searchParams.get("style") || "default"
  const font = searchParams.get("font") || "inter"
  const item = searchParams.get("item") || "cover-example"

  paramStore.set("iconLibrary", iconLibrary)
  paramStore.set("theme", theme)
  paramStore.set("style", style)
  paramStore.set("font", font)
  paramStore.set("item", item)
}

// Listen for postMessage updates in iframe context.
if (typeof window !== "undefined" && isInIframe()) {
  window.addEventListener("message", (event: MessageEvent) => {
    if (event.data.type === MESSAGE_TYPE && event.data.params) {
      // Update store and notify listeners for each changed param.
      Object.keys(event.data.params).forEach((key) => {
        const newValue = event.data.params[key]
        const oldValue = paramStore.get(key)

        if (newValue !== oldValue) {
          paramStore.set(key, newValue)

          // Notify all listeners subscribed to this param.
          const listeners = paramListeners.get(key)
          if (listeners) {
            listeners.forEach((listener) => listener())
          }
        }
      })
    }
  })
}

/**
 * Hook to sync design system search params.
 * In parent: returns params from URL.
 * In iframe: returns all params from store.
 */
export function useDesignSystemSync() {
  const [urlParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  // In iframe, subscribe to all params.
  const subscribe = (callback: () => void) => {
    if (!isInIframe()) return () => {}

    // Subscribe to all param keys.
    const keys = Object.keys(designSystemSearchParams)
    keys.forEach((key) => {
      if (!paramListeners.has(key)) {
        paramListeners.set(key, new Set())
      }
      paramListeners.get(key)!.add(callback)
    })

    return () => {
      keys.forEach((key) => {
        const listeners = paramListeners.get(key)
        if (listeners) {
          listeners.delete(callback)
          if (listeners.size === 0) {
            paramListeners.delete(key)
          }
        }
      })
    }
  }

  const getSnapshot = () => {
    if (!isInIframe()) {
      return urlParams
    }

    return {
      iconLibrary: paramStore.get("iconLibrary"),
      theme: paramStore.get("theme"),
      style: paramStore.get("style"),
      font: paramStore.get("font"),
      item: paramStore.get("item"),
    } as DesignSystemSearchParams
  }

  const getServerSnapshot = () => urlParams

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/**
 * Hook to get a specific design system param.
 * Only re-renders when the subscribed param changes.
 */
export function useDesignSystemParam<K extends keyof DesignSystemSearchParams>(
  key: K
) {
  const [urlParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  // In iframe, subscribe only to this specific param.
  const subscribe = (callback: () => void) => {
    if (!isInIframe()) return () => {}

    if (!paramListeners.has(key)) {
      paramListeners.set(key, new Set())
    }
    const listeners = paramListeners.get(key)!
    listeners.add(callback)

    return () => {
      listeners.delete(callback)
      if (listeners.size === 0) {
        paramListeners.delete(key)
      }
    }
  }

  const getSnapshot = () => {
    if (!isInIframe()) {
      return urlParams[key]
    }
    return paramStore.get(key) as DesignSystemSearchParams[K]
  }

  const getServerSnapshot = () => {
    return designSystemSearchParams[key]
      .defaultValue as DesignSystemSearchParams[K]
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
