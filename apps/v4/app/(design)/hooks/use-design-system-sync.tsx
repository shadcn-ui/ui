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

/**
 * Hook to sync design system search params between parent and iframe.
 * Use this in the parent window to broadcast params to iframes.
 */
export function useDesignSystemSync() {
  const [params] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  // Broadcast params to iframes when they change.
  useEffect(() => {
    if (isInIframe()) return

    const iframes = document.querySelectorAll("iframe")
    iframes.forEach((iframe) => {
      iframe.contentWindow?.postMessage(
        {
          type: MESSAGE_TYPE,
          params,
        },
        "*"
      )
    })
  }, [params])

  return params
}

/**
 * Hook to receive design system params in an iframe.
 * Use this in the iframe to listen for params from parent.
 */
export function useDesignSystemReceiver() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  useEffect(() => {
    if (!isInIframe()) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === MESSAGE_TYPE && event.data.params) {
        setParams(event.data.params)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [setParams])

  return params
}

// Store for param values received via postMessage.
const paramStore = new Map<string, any>()
const paramListeners = new Map<string, Set<() => void>>()
let storeReady = false
const readyListeners = new Set<() => void>()

// Initialize store with query params on client.
const initializeParamStore = () => {
  if (typeof window === "undefined") return

  // Check for params from inline script first (set before hydration).
  const globalParams = (window as any).__DESIGN_SYSTEM_PARAMS__

  if (globalParams) {
    paramStore.set("iconLibrary", globalParams.iconLibrary || "lucide")
    paramStore.set("theme", globalParams.theme || "blue")
    paramStore.set("item", globalParams.item || "cover-example")
    storeReady = true
    return
  }

  // Fall back to URL search params.
  const searchParams = new URLSearchParams(window.location.search)
  const iconLibrary = searchParams.get("iconLibrary") || "lucide"
  const theme = searchParams.get("theme") || "blue"
  const item = searchParams.get("item") || "cover-example"

  paramStore.set("iconLibrary", iconLibrary)
  paramStore.set("theme", theme)
  paramStore.set("item", item)

  // In non-iframe context, we're ready immediately.
  if (!isInIframe()) {
    storeReady = true
  }
}

// Initialize immediately.
initializeParamStore()

// Listen for postMessage updates in iframe context.
if (typeof window !== "undefined" && isInIframe()) {
  window.addEventListener("message", (event: MessageEvent) => {
    if (event.data.type === MESSAGE_TYPE && event.data.params) {
      // On first message, initialize from global params if available.
      if (!storeReady) {
        const globalParams = (window as any).__DESIGN_SYSTEM_PARAMS__
        if (globalParams) {
          paramStore.set("iconLibrary", globalParams.iconLibrary || "lucide")
          paramStore.set("theme", globalParams.theme || "blue")
          paramStore.set("item", globalParams.item || "cover-example")
        }
        storeReady = true
        readyListeners.forEach((listener) => listener())
      }

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
 * Hook to check if param store is ready (received first postMessage in iframe).
 */
export function useDesignSystemReady() {
  const subscribe = (callback: () => void) => {
    readyListeners.add(callback)
    return () => {
      readyListeners.delete(callback)
    }
  }

  const getSnapshot = () => storeReady

  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/**
 * Hook to receive a specific param from design system in an iframe.
 * Use this to subscribe to only one param and avoid unnecessary re-renders.
 */
export function useDesignSystemParam<K extends keyof DesignSystemSearchParams>(
  key: K
): DesignSystemSearchParams[K] {
  const subscribe = (callback: () => void) => {
    // Get or create listener set for this param.
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
    // Lazy initialization: if param not in store, try to read from URL.
    if (!paramStore.has(key) && typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      const value = searchParams.get(key as string)
      if (value) {
        paramStore.set(key, value)
      }
    }
    return paramStore.get(key) as DesignSystemSearchParams[K]
  }

  const getServerSnapshot = () => {
    // Return default value on server.
    return designSystemSearchParams[key]
      .defaultValue as DesignSystemSearchParams[K]
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
