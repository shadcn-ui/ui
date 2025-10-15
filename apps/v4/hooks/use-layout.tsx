"use client"

import * as React from "react"

type Layout = "fixed" | "full"

interface LayoutProviderProps {
  children: React.ReactNode
  defaultLayout?: Layout
  forcedLayout?: Layout
  storageKey?: string
  attribute?: string | string[]
  value?: Record<string, string>
}

interface LayoutProviderState {
  layout: Layout
  setLayout: (layout: Layout | ((prev: Layout) => Layout)) => void
  forcedLayout?: Layout
}

const isServer = typeof window === "undefined"
const LayoutContext = React.createContext<LayoutProviderState | undefined>(
  undefined
)

const saveToLS = (storageKey: string, value: string) => {
  try {
    localStorage.setItem(storageKey, value)
  } catch {
    // Unsupported
  }
}

const useLayout = () => {
  const context = React.useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}

const Layout = ({
  forcedLayout,
  storageKey = "layout",
  defaultLayout = "full",
  attribute = "class",
  value,
  children,
}: LayoutProviderProps) => {
  const [layout, setLayoutState] = React.useState<Layout>(() => {
    if (isServer) return defaultLayout
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved === "fixed" || saved === "full") {
        return saved
      }
      return defaultLayout
    } catch {
      return defaultLayout
    }
  })

  const attrs = !value ? ["layout-fixed", "layout-full"] : Object.values(value)

  const applyLayout = React.useCallback(
    (layout: Layout) => {
      if (!layout) return

      const name = value ? value[layout] : `layout-${layout}`
      const d = document.documentElement

      const handleAttribute = (attr: string) => {
        if (attr === "class") {
          d.classList.remove(...attrs)
          if (name) d.classList.add(name)
        } else if (attr.startsWith("data-")) {
          if (name) {
            d.setAttribute(attr, name)
          } else {
            d.removeAttribute(attr)
          }
        }
      }

      if (Array.isArray(attribute)) attribute.forEach(handleAttribute)
      else handleAttribute(attribute)
    },
    [attrs, attribute, value]
  )

  const setLayout = React.useCallback(
    (value: Layout | ((prev: Layout) => Layout)) => {
      if (typeof value === "function") {
        setLayoutState((prevLayout) => {
          const newLayout = value(prevLayout)
          saveToLS(storageKey, newLayout)
          return newLayout
        })
      } else {
        setLayoutState(value)
        saveToLS(storageKey, value)
      }
    },
    [storageKey]
  )

  // localStorage event handling
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return

      if (!e.newValue) {
        setLayout(defaultLayout)
      } else if (e.newValue === "fixed" || e.newValue === "full") {
        setLayoutState(e.newValue)
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [setLayout, storageKey, defaultLayout])

  // Apply layout on mount and when it changes
  React.useEffect(() => {
    const currentLayout = forcedLayout ?? layout
    applyLayout(currentLayout)
  }, [forcedLayout, layout, applyLayout])

  // Prevent layout changes during hydration
  const [isHydrated, setIsHydrated] = React.useState(false)
  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  const providerValue = React.useMemo(
    () => ({
      layout: isHydrated ? layout : defaultLayout,
      setLayout,
      forcedLayout,
    }),
    [layout, setLayout, forcedLayout, isHydrated, defaultLayout]
  )

  return (
    <LayoutContext.Provider value={providerValue}>
      {children}
    </LayoutContext.Provider>
  )
}

const LayoutProvider = (props: LayoutProviderProps) => {
  const context = React.useContext(LayoutContext)

  // Ignore nested context providers, just passthrough children
  if (context) return <>{props.children}</>
  return <Layout {...props} />
}

export { useLayout, LayoutProvider }
