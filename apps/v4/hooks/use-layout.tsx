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

const LayoutContext = React.createContext<LayoutProviderState | undefined>(
  undefined
)

const saveToLS = (storageKey: string, value: string) => {
  try {
    localStorage.setItem(storageKey, value)
  } catch {
    // storage unavailable (SSR / private mode)
  }
}

const useLayout = () => {
  const context = React.useContext(LayoutContext)
  if (!context) {
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
  // ✅ start with default only (SSR-safe)
  const [layout, setLayoutState] = React.useState<Layout>(defaultLayout)

  // ✅ read localStorage ONLY after mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved === "fixed" || saved === "full") {
        setLayoutState(saved)
      }
    } catch {
      // ignore
    }
  }, [storageKey])

  // ✅ memoized to keep hook deps stable
  const attrs = React.useMemo(
    () => (!value ? ["layout-fixed", "layout-full"] : Object.values(value)),
    [value]
  )

  const applyLayout = React.useCallback(
    (layout: Layout) => {
      const name = value ? value[layout] : `layout-${layout}`
      const d = document.documentElement

      const handleAttribute = (attr: string) => {
        if (attr === "class") {
          d.classList.remove(...attrs)
          d.classList.add(name)
        } else if (attr.startsWith("data-")) {
          d.setAttribute(attr, name)
        }
      }

      // ✅ no ternary side-effects (eslint-safe)
      if (Array.isArray(attribute)) {
        attribute.forEach(handleAttribute)
      } else {
        handleAttribute(attribute)
      }
    },
    [attrs, attribute, value]
  )

  const setLayout = React.useCallback(
    (value: Layout | ((prev: Layout) => Layout)) => {
      setLayoutState((prev) => {
        const next = typeof value === "function" ? value(prev) : value
        saveToLS(storageKey, next)
        return next
      })
    },
    [storageKey]
  )

  // Apply layout whenever it changes
  React.useEffect(() => {
    applyLayout(forcedLayout ?? layout)
  }, [layout, forcedLayout, applyLayout])

  const providerValue = React.useMemo(
    () => ({
      layout,
      setLayout,
      forcedLayout,
    }),
    [layout, setLayout, forcedLayout]
  )

  return (
    <LayoutContext.Provider value={providerValue}>
      {children}
    </LayoutContext.Provider>
  )
}

const LayoutProvider = (props: LayoutProviderProps) => {
  const context = React.useContext(LayoutContext)

  // Prevent nested providers
  if (context) return <>{props.children}</>

  return <Layout {...props} />
}

export { useLayout, LayoutProvider }
