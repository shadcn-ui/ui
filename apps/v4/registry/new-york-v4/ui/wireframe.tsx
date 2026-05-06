"use client"

import { createContext, useContext, useSyncExternalStore } from "react"
import type { ClassValue } from "clsx"

import { cn } from "@/lib/utils"

const defaults = {
  mobileBreakpoint: 768,
  safeAreas: true,
  cssVariables: {
    "--sticky-nav-height": 12,
    "--sticky-nav-top-offset": 0,

    "--top-nav-height": 14,
    "--top-nav-left-offset": 0,
    "--top-nav-right-offset": 0,
    "--top-nav-top-offset": 0,
    "--top-nav-bottom-offset": 0,

    "--bottom-nav-height": 14,
    "--bottom-nav-left-offset": 0,
    "--bottom-nav-right-offset": 0,
    "--bottom-nav-top-offset": 0,
    "--bottom-nav-bottom-offset": 0,

    "--left-sidebar-width-collapsed": 16,
    "--left-sidebar-width-expanded": 52,
    "--left-sidebar-left-offset": 0,
    "--left-sidebar-right-offset": 0,
    "--left-sidebar-top-offset": 0,
    "--left-sidebar-bottom-offset": 0,

    "--right-sidebar-width-collapsed": 16,
    "--right-sidebar-width-expanded": 52,
    "--right-sidebar-left-offset": 0,
    "--right-sidebar-right-offset": 0,
    "--right-sidebar-top-offset": 0,
    "--right-sidebar-bottom-offset": 0,
  },
  corners: {
    topLeft: "sidebar",
    topRight: "sidebar",
    bottomLeft: "sidebar",
    bottomRight: "sidebar",
  },
} as const satisfies WireframeConfig

type WireframeContextValue = {
  windowWidth: number
  isMobile: boolean
}

const WireframeContext = createContext<WireframeContextValue | undefined>(
  undefined
)

export function useWireframe() {
  const context = useContext(WireframeContext)
  if (!context) {
    throw new Error("useWireframe must be used within a Wireframe")
  }
  return context
}

function useWindowWidth() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("resize", onStoreChange)
      return () => window.removeEventListener("resize", onStoreChange)
    },
    () => window.innerWidth,
    () => null
  )
}

type WireframeCornerOptions = "navbar" | "sidebar"

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type WireframeConfig = {
  mobileBreakpoint: number
  safeAreas: boolean
  cssVariables: Record<WireframeCSSVariables, string | number>
  corners: {
    topLeft: WireframeCornerOptions
    topRight: WireframeCornerOptions
    bottomLeft: WireframeCornerOptions
    bottomRight: WireframeCornerOptions
  }
}

const defaultConfig: ClassValue[] = [
  // NO BOTTOM NAV, ADD BOTTOM SAFE AREA INSET
  "not-has-data-wf-bottom-nav:mb-[env(safe-area-inset-bottom)]",
  // NO BOTTOM NAV, ADD BOTTOM SAFE AREA INSET
  "not-has-data-wf-top-nav:mt-[env(safe-area-inset-top)]",
  // NO RIGHT SIDEBAR, ADD RIGHT SAFE AREA INSET
  "not-has-data-wf-right-sidebar:mr-[env(safe-area-inset-right)]",
  // NO LEFT SIDEBAR, ADD LEFT SAFE AREA INSET
  "not-has-data-wf-left-sidebar:ml-[env(safe-area-inset-left)]",

  // HAS TOP NAV, ADD TOP MARGIN WIREFRAME ROOT
  "has-data-wf-top-nav:mt-[calc(var(--top-nav-height)+var(--top-nav-top-offset)+var(--top-nav-bottom-offset)+env(safe-area-inset-top))]",

  // HAS BOTTOM NAV, ADD BOTTOM MARGIN WIREFRAME CONTENT
  "has-data-wf-bottom-nav:mb-[calc(var(--bottom-nav-height)+var(--bottom-nav-bottom-offset)+var(--bottom-nav-top-offset)+env(safe-area-inset-bottom))]",

  // HAS LEFT SIDEBAR=EXPANDED, ADD LEFT MARGIN WIREFRAME CONTENT
  "has-data-[wf-left-sidebar=expanded]:ml-[calc(var(--left-sidebar-width-expanded)+var(--left-sidebar-left-offset)+var(--left-sidebar-right-offset)+env(safe-area-inset-left))]",
  // HAS RIGHT SIDEBAR=EXPANDED, ADD RIGHT MARGIN WIREFRAME CONTENT
  "has-data-[wf-right-sidebar=expanded]:mr-[calc(var(--right-sidebar-width-expanded)+var(--right-sidebar-right-offset)+var(--right-sidebar-left-offset)+env(safe-area-inset-right))]",
  // HAS LEFT SIDEBAR=COLLAPSED, ADD LEFT MARGIN WIREFRAME CONTENT
  "has-data-[wf-left-sidebar=collapsed]:ml-[calc(var(--left-sidebar-width-collapsed)+var(--left-sidebar-left-offset)+var(--left-sidebar-right-offset)+env(safe-area-inset-left))]",
  // HAS RIGHT SIDEBAR=COLLAPSED, ADD RIGHT MARGIN WIREFRAME CONTENT
  "has-data-[wf-right-sidebar=collapsed]:mr-[calc(var(--right-sidebar-width-collapsed)+var(--right-sidebar-right-offset)+var(--right-sidebar-left-offset)+env(safe-area-inset-right))]",

  // HAS TOP AND BOTTOM NAV, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-top-nav:has-data-wf-bottom-nav:min-h-[calc(100dvh-var(--top-nav-height)-var(--bottom-nav-height)-var(--top-nav-top-offset)-var(--bottom-nav-bottom-offset)-var(--top-nav-bottom-offset)-var(--bottom-nav-top-offset)-env(safe-area-inset-top)-env(safe-area-inset-bottom))]",
  // HAS ONLY TOP NAV, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-top-nav:min-h-[calc(100dvh-var(--top-nav-height)-var(--top-nav-top-offset)-var(--top-nav-bottom-offset)-env(safe-area-inset-top))]",
  // HAS ONLY BOTTOM NAV, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-bottom-nav:min-h-[calc(100dvh-var(--bottom-nav-height)-var(--bottom-nav-bottom-offset)-var(--bottom-nav-top-offset)-env(safe-area-inset-bottom))]",

  // MAKE THE WIREFRAME ROOT RELATIVE TO ALLOW CHILDREN TO BE ABSOLUTE POSITIONED IF NEEDED
  "relative",
]

const wireframeCssVariables = [
  // STICKY NAV
  "--sticky-nav-height",
  "--sticky-nav-top-offset",

  // TOP NAV
  "--top-nav-height",
  "--top-nav-left-offset",
  "--top-nav-right-offset",
  "--top-nav-top-offset",
  "--top-nav-bottom-offset",

  // BOTTOM NAV
  "--bottom-nav-height",
  "--bottom-nav-left-offset",
  "--bottom-nav-right-offset",
  "--bottom-nav-top-offset",
  "--bottom-nav-bottom-offset",

  // LEFT SIDEBAR
  "--left-sidebar-width-collapsed",
  "--left-sidebar-width-expanded",
  "--left-sidebar-left-offset",
  "--left-sidebar-right-offset",
  "--left-sidebar-top-offset",
  "--left-sidebar-bottom-offset",

  // RIGHT SIDEBAR
  "--right-sidebar-width-collapsed",
  "--right-sidebar-width-expanded",
  "--right-sidebar-left-offset",
  "--right-sidebar-right-offset",
  "--right-sidebar-top-offset",
  "--right-sidebar-bottom-offset",
] as const

export type WireframeCSSVariables = (typeof wireframeCssVariables)[number]

const cornersConfig = {
  navbar: {
    topLeft: [
      // HAS TOP NAV AND LEFT SIDEBAR, ADD TOP MARGIN TO LEFT SIDEBAR
      "has-data-wf-top-nav:has-data-wf-left-sidebar:**:data-wf-left-sidebar:mt-(--top-nav-height)",
    ],
    topRight: [
      // HAS TOP NAV AND RIGHT SIDEBAR, ADD TOP MARGIN TO RIGHT SIDEBAR
      "has-data-wf-top-nav:has-data-wf-right-sidebar:**:data-wf-right-sidebar:mt-(--top-nav-height)",
    ],
    bottomLeft: [
      // HAS BOTTOM NAV AND LEFT SIDEBAR, ADD BOTTOM MARGIN TO LEFT SIDEBAR
      "has-data-wf-bottom-nav:has-data-wf-left-sidebar:**:data-wf-left-sidebar:mb-(--bottom-nav-height)",
    ],
    bottomRight: [
      // HAS BOTTOM NAV AND RIGHT SIDEBAR, ADD BOTTOM MARGIN TO RIGHT SIDEBAR
      "has-data-wf-bottom-nav:has-data-wf-right-sidebar:**:data-wf-right-sidebar:mb-(--bottom-nav-height)",
    ],
  },
  sidebar: {
    topLeft: [
      // HAS TOP NAV AND LEFT SIDEBAR=EXPANDED, ADD LEFT MARGIN TO TOP NAV
      "has-data-wf-top-nav:has-data-[wf-left-sidebar=expanded]:**:data-wf-top-nav:ml-[calc(var(--left-sidebar-width-expanded)+var(--left-sidebar-left-offset)+var(--left-sidebar-right-offset))]",
      // HAS TOP NAV AND LEFT SIDEBAR=COLLAPSED, ADD LEFT MARGIN TO TOP NAV
      "has-data-wf-top-nav:has-data-[wf-left-sidebar=collapsed]:**:data-wf-top-nav:ml-[calc(var(--left-sidebar-width-collapsed)+var(--left-sidebar-left-offset)+var(--left-sidebar-right-offset))]",
    ],
    topRight: [
      // HAS TOP NAV AND RIGHT SIDEBAR=EXPANDED, ADD RIGHT MARGIN TO TOP NAV
      "has-data-wf-top-nav:has-data-[wf-right-sidebar=expanded]:**:data-wf-top-nav:mr-[calc(var(--right-sidebar-width-expanded)+var(--right-sidebar-right-offset)+var(--right-sidebar-left-offset))]",
      // HAS TOP NAV AND RIGHT SIDEBAR=COLLAPSED, ADD RIGHT MARGIN TO TOP NAV
      "has-data-wf-top-nav:has-data-[wf-right-sidebar=collapsed]:**:data-wf-top-nav:mr-[calc(var(--right-sidebar-width-collapsed)+var(--right-sidebar-right-offset)+var(--right-sidebar-left-offset))]",
    ],
    bottomLeft: [
      // HAS BOTTOM NAV AND LEFT SIDEBAR=EXPANDED, ADD LEFT MARGIN TO BOTTOM NAV
      "has-data-wf-bottom-nav:has-data-[wf-left-sidebar=expanded]:**:data-wf-bottom-nav:ml-[calc(var(--left-sidebar-width-expanded)+var(--left-sidebar-left-offset)+var(--left-sidebar-right-offset))]",
      // HAS BOTTOM NAV AND LEFT SIDEBAR=COLLAPSED, ADD LEFT MARGIN TO BOTTOM NAV
      "has-data-wf-bottom-nav:has-data-[wf-left-sidebar=collapsed]:**:data-wf-bottom-nav:ml-[calc(var(--left-sidebar-width-collapsed)+var(--left-sidebar-left-offset)+var(--left-sidebar-right-offset))]",
    ],
    bottomRight: [
      // HAS BOTTOM NAV AND RIGHT SIDEBAR=EXPANDED, ADD RIGHT MARGIN TO BOTTOM NAV
      "has-data-wf-bottom-nav:has-data-[wf-right-sidebar=expanded]:**:data-wf-bottom-nav:mr-[calc(var(--right-sidebar-width-expanded)+var(--right-sidebar-right-offset)+var(--right-sidebar-left-offset))]",
      // HAS BOTTOM NAV AND RIGHT SIDEBAR=COLLAPSED, ADD RIGHT MARGIN TO BOTTOM NAV
      "has-data-wf-bottom-nav:has-data-[wf-right-sidebar=collapsed]:**:data-wf-bottom-nav:mr-[calc(var(--right-sidebar-width-collapsed)+var(--right-sidebar-right-offset)+var(--right-sidebar-left-offset))]",
    ],
  },
} as const

function tailwindSpacing(value: number) {
  return `calc(var(--spacing) * ${value})`
}

function parseCssVariable(value: string | number) {
  if (typeof value === "number") {
    return tailwindSpacing(value)
  }

  return value
}

function SafeAreaInsetTop({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background pointer-events-none fixed inset-x-0 top-0 z-99999 h-[env(safe-area-inset-top)]",
        className
      )}
      {...props}
    />
  )
}

function SafeAreaInsetBottom({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background pointer-events-none fixed inset-x-0 bottom-0 z-99999 h-[env(safe-area-inset-bottom)]",
        className
      )}
      {...props}
    />
  )
}

function SafeAreaInsetLeft({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background pointer-events-none fixed inset-y-0 left-0 z-99999 w-[env(safe-area-inset-left)]",
        className
      )}
      {...props}
    />
  )
}

function SafeAreaInsetRight({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background pointer-events-none fixed inset-y-0 right-0 z-99999 w-[env(safe-area-inset-right)]",
        className
      )}
      {...props}
    />
  )
}

function Wireframe({
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config?: DeepPartial<WireframeConfig>
}) {
  const windowWidth = useWindowWidth()

  if (!windowWidth) {
    return null
  }

  const isMobile =
    windowWidth < (config?.mobileBreakpoint ?? defaults.mobileBreakpoint)
  const safeAreasEnabled = config?.safeAreas ?? defaults.safeAreas
  const cssVars = { ...defaults.cssVariables, ...config?.cssVariables }
  const corners = {
    ...defaults.corners,
    ...config?.corners,
  }

  return (
    <div
      className={cn(
        defaultConfig,
        cornersConfig[corners.topLeft].topLeft,
        cornersConfig[corners.topRight].topRight,
        cornersConfig[corners.bottomLeft].bottomLeft,
        cornersConfig[corners.bottomRight].bottomRight,
        className
      )}
      style={
        {
          // STICKY NAV
          "--sticky-nav-height": parseCssVariable(
            cssVars["--sticky-nav-height"]
          ),
          "--sticky-nav-top-offset": parseCssVariable(
            cssVars["--sticky-nav-top-offset"]
          ),

          // TOP NAV
          "--top-nav-height": parseCssVariable(cssVars["--top-nav-height"]),
          "--top-nav-left-offset": parseCssVariable(
            cssVars["--top-nav-left-offset"]
          ),
          "--top-nav-right-offset": parseCssVariable(
            cssVars["--top-nav-right-offset"]
          ),
          "--top-nav-top-offset": parseCssVariable(
            cssVars["--top-nav-top-offset"]
          ),
          "--top-nav-bottom-offset": parseCssVariable(
            cssVars["--top-nav-bottom-offset"]
          ),

          // BOTTOM NAV
          "--bottom-nav-height": parseCssVariable(
            cssVars["--bottom-nav-height"]
          ),
          "--bottom-nav-left-offset": parseCssVariable(
            cssVars["--bottom-nav-left-offset"]
          ),
          "--bottom-nav-right-offset": parseCssVariable(
            cssVars["--bottom-nav-right-offset"]
          ),
          "--bottom-nav-top-offset": parseCssVariable(
            cssVars["--bottom-nav-top-offset"]
          ),
          "--bottom-nav-bottom-offset": parseCssVariable(
            cssVars["--bottom-nav-bottom-offset"]
          ),

          // LEFT SIDEBAR
          "--left-sidebar-width-collapsed": parseCssVariable(
            cssVars["--left-sidebar-width-collapsed"]
          ),
          "--left-sidebar-width-expanded": parseCssVariable(
            cssVars["--left-sidebar-width-expanded"]
          ),
          "--left-sidebar-left-offset": parseCssVariable(
            cssVars["--left-sidebar-left-offset"]
          ),
          "--left-sidebar-right-offset": parseCssVariable(
            cssVars["--left-sidebar-right-offset"]
          ),
          "--left-sidebar-top-offset": parseCssVariable(
            cssVars["--left-sidebar-top-offset"]
          ),
          "--left-sidebar-bottom-offset": parseCssVariable(
            cssVars["--left-sidebar-bottom-offset"]
          ),

          // RIGHT SIDEBAR
          "--right-sidebar-width-expanded": parseCssVariable(
            cssVars["--right-sidebar-width-expanded"]
          ),
          "--right-sidebar-width-collapsed": parseCssVariable(
            cssVars["--right-sidebar-width-collapsed"]
          ),
          "--right-sidebar-left-offset": parseCssVariable(
            cssVars["--right-sidebar-left-offset"]
          ),
          "--right-sidebar-right-offset": parseCssVariable(
            cssVars["--right-sidebar-right-offset"]
          ),
          "--right-sidebar-top-offset": parseCssVariable(
            cssVars["--right-sidebar-top-offset"]
          ),
          "--right-sidebar-bottom-offset": parseCssVariable(
            cssVars["--right-sidebar-bottom-offset"]
          ),
        } satisfies Record<WireframeCSSVariables, string> as React.CSSProperties
      }
      {...props}
    >
      <WireframeContext.Provider value={{ windowWidth, isMobile }}>
        {safeAreasEnabled === true && (
          <>
            <SafeAreaInsetTop />
            <SafeAreaInsetBottom />
            <SafeAreaInsetLeft />
            <SafeAreaInsetRight />
          </>
        )}

        {children}
      </WireframeContext.Provider>
    </div>
  )
}

function WireframeStickyNav({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "sticky top-[calc(var(--sticky-nav-top-offset)+env(safe-area-inset-top))] z-50 h-(--sticky-nav-height) w-full",
        className
      )}
      data-wf-sticky-nav
      {...props}
    >
      {children}
    </div>
  )
}

function WireframeNav({
  className,
  children,
  position = "top",
  hideOn,
  ...props
}: React.ComponentProps<"div"> & {
  position?: "top" | "bottom"
  hideOn?: "mobile" | "desktop"
}) {
  const { isMobile } = useWireframe()
  if (hideOn === "mobile" && isMobile) {
    return null
  }
  if (hideOn === "desktop" && !isMobile) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed z-50",
        position === "top"
          ? [
              "top-[calc(var(--top-nav-top-offset)+env(safe-area-inset-top))]",
              "right-[calc(var(--top-nav-right-offset)+env(safe-area-inset-right))]",
              "left-[calc(var(--top-nav-left-offset)+env(safe-area-inset-left))]",
              "h-(--top-nav-height)",
            ]
          : [
              "right-[calc(var(--bottom-nav-right-offset)+env(safe-area-inset-right))]",
              "bottom-[calc(var(--bottom-nav-bottom-offset)+env(safe-area-inset-bottom))]",
              "left-[calc(var(--bottom-nav-left-offset)+env(safe-area-inset-left))]",
              "h-(--bottom-nav-height)",
            ],
        className
      )}
      {...{
        ...props,
        [`data-wf-${position}-nav`]: "",
      }}
    >
      {children}
    </div>
  )
}

type WireframeSidebarPosition = "left" | "right"

function WireframeSidebarHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex-none", className)}
      data-slot="sidebar-header"
      {...props}
    >
      {children}
    </div>
  )
}

function WireframeSidebarContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      data-slot="sidebar-content"
      {...props}
    >
      {children}
    </div>
  )
}

function WireframeSidebarGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col", className)}
      data-slot="sidebar-group"
      {...props}
    >
      {children}
    </div>
  )
}

function WireframeSidebarFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex-none", className)}
      data-slot="sidebar-footer"
      {...props}
    >
      {children}
    </div>
  )
}

function WireframeSidebar({
  className,
  children,
  collapsed = false,
  position = "left",
  hideOn,
  ...props
}: React.ComponentProps<"div"> & {
  collapsed?: boolean
  position?: WireframeSidebarPosition
  hideOn?: "mobile" | "desktop"
}) {
  const { isMobile } = useWireframe()
  if (hideOn === "mobile" && isMobile) {
    return null
  }
  if (hideOn === "desktop" && !isMobile) {
    return null
  }
  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden",
        position === "left"
          ? [
              [
                "top-[calc(var(--left-sidebar-top-offset)+env(safe-area-inset-top))]",
                "bottom-[calc(var(--left-sidebar-bottom-offset)+env(safe-area-inset-bottom))]",
                "left-[calc(var(--left-sidebar-left-offset)+env(safe-area-inset-left))]",
              ],
              collapsed
                ? "w-(--left-sidebar-width-collapsed)"
                : "w-(--left-sidebar-width-expanded)",
            ]
          : [
              [
                "top-[calc(var(--right-sidebar-top-offset)+env(safe-area-inset-top))]",
                "right-[calc(var(--right-sidebar-right-offset)+env(safe-area-inset-right))]",
                "bottom-[calc(var(--right-sidebar-bottom-offset)+env(safe-area-inset-bottom))]",
              ],
              collapsed
                ? "w-(--right-sidebar-width-collapsed)"
                : "w-(--right-sidebar-width-expanded)",
            ],
        className
      )}
      {...{
        ...props,
        [`data-wf-${position}-sidebar`]: `${collapsed ? "collapsed" : "expanded"}`,
      }}
    >
      {children}
    </div>
  )
}

export {
  SafeAreaInsetBottom,
  SafeAreaInsetLeft,
  SafeAreaInsetRight,
  SafeAreaInsetTop,
  useWindowWidth,
  Wireframe,
  WireframeNav,
  WireframeSidebar,
  WireframeSidebarContent,
  WireframeSidebarFooter,
  WireframeSidebarGroup,
  WireframeSidebarHeader,
  type WireframeSidebarPosition,
  WireframeStickyNav,
}
