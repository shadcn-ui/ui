/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"

export const isInIframe = () => {
  if (typeof window === "undefined") {
    return false
  }
  return window.self !== window.top
}

export function createIframeSyncStore<T extends Record<string, any>>(
  messageType: string,
  defaultValues: T
) {
  const store = new Map<keyof T, any>()
  const listeners = new Map<keyof T, Set<() => void>>()

  if (typeof window !== "undefined") {
    Object.entries(defaultValues).forEach(([key, value]) => {
      store.set(key as keyof T, value)
    })
  }

  if (typeof window !== "undefined" && isInIframe()) {
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.data.type === messageType && event.data.params) {
        Object.keys(event.data.params).forEach((key) => {
          const newValue = event.data.params[key]
          const oldValue = store.get(key as keyof T)

          if (newValue !== oldValue) {
            store.set(key as keyof T, newValue)

            const keyListeners = listeners.get(key as keyof T)
            if (keyListeners) {
              keyListeners.forEach((listener) => listener())
            }
          }
        })
      }
    })
  }

  return {
    store,
    listeners,
    subscribe(key: keyof T, callback: () => void) {
      if (!isInIframe()) return () => {}

      if (!listeners.has(key)) {
        listeners.set(key, new Set())
      }
      const keyListeners = listeners.get(key)!
      keyListeners.add(callback)

      return () => {
        keyListeners.delete(callback)
        if (keyListeners.size === 0) {
          listeners.delete(key)
        }
      }
    },
    subscribeAll(keys: (keyof T)[], callback: () => void) {
      if (!isInIframe()) return () => {}

      keys.forEach((key) => {
        if (!listeners.has(key)) {
          listeners.set(key, new Set())
        }
        listeners.get(key)!.add(callback)
      })

      return () => {
        keys.forEach((key) => {
          const keyListeners = listeners.get(key)
          if (keyListeners) {
            keyListeners.delete(callback)
            if (keyListeners.size === 0) {
              listeners.delete(key)
            }
          }
        })
      }
    },
    get(key: keyof T) {
      return store.get(key) as T[keyof T]
    },
    getAll() {
      const result = {} as T
      store.forEach((value, key) => {
        result[key as keyof T] = value
      })
      return result
    },
  }
}

export function useIframeSyncValue<T>(
  store: ReturnType<typeof createIframeSyncStore<any>>,
  key: string,
  urlValue: T
) {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      return store.subscribe(key, callback)
    },
    [store, key]
  )

  const getSnapshot = React.useCallback(() => {
    if (!isInIframe()) {
      return urlValue
    }
    return store.get(key) as T
  }, [store, key, urlValue])

  const getServerSnapshot = React.useCallback(() => {
    return urlValue
  }, [urlValue])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useIframeSyncAll<T extends Record<string, any>>(
  store: ReturnType<typeof createIframeSyncStore<T>>,
  keys: (keyof T)[],
  urlValues: T
) {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      return store.subscribeAll(keys, callback)
    },
    [store, keys]
  )

  const getSnapshot = React.useCallback(() => {
    if (!isInIframe()) {
      return urlValues
    }
    return store.getAll()
  }, [store, urlValues])

  const getServerSnapshot = React.useCallback(() => {
    return urlValues
  }, [urlValues])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useParentMessageListener<T>(
  messageType: string,
  onMessage: (data: T) => void
) {
  React.useEffect(() => {
    if (isInIframe()) {
      return
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === messageType) {
        onMessage(event.data)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [messageType, onMessage])
}

export function sendToIframe(
  iframe: HTMLIFrameElement | null,
  messageType: string,
  data: any
) {
  if (!iframe || !iframe.contentWindow) {
    return
  }

  iframe.contentWindow.postMessage(
    {
      type: messageType,
      ...data,
    },
    "*"
  )
}

export function sendToParent(messageType: string, data: any) {
  if (!isInIframe()) {
    return
  }

  window.parent.postMessage(
    {
      type: messageType,
      ...data,
    },
    "*"
  )
}
