import type { ClassValue } from "clsx"

import { cn } from "@/lib/utils"

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

  // HAS RESPONSIVE NAV, AND VIEWPORT IS MOBILE, ADD BOTTOM MARGINS
  "has-data-wf-responsive-nav:mb-[calc(var(--bottom-nav-height)+var(--bottom-nav-bottom-offset)+var(--bottom-nav-top-offset)+env(safe-area-inset-bottom))] mt-[env(safe-area-inset-top)]",
  // HAS RESPONSIVE NAV, AND VIEWPORT IS DESKTOP, ADD TOP MARGINS
  "min-wf-nav:has-data-wf-responsive-nav:mt-[calc(var(--top-nav-height)+var(--top-nav-top-offset)+var(--top-nav-bottom-offset)+env(safe-area-inset-top))] min-wf-nav:has-data-wf-responsive-nav:mb-[env(safe-area-inset-bottom)]",

  // HAS TOP AND BOTTOM NAV, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-top-nav:has-data-wf-bottom-nav:min-h-[calc(100vh-var(--top-nav-height)-var(--bottom-nav-height)-var(--top-nav-top-offset)-var(--bottom-nav-bottom-offset)-var(--top-nav-bottom-offset)-var(--bottom-nav-top-offset)-env(safe-area-inset-top)-env(safe-area-inset-bottom))]",
  // HAS ONLY TOP NAV, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-top-nav:min-h-[calc(100vh-var(--top-nav-height)-var(--top-nav-top-offset)-var(--top-nav-bottom-offset)-env(safe-area-inset-top))]",
  // HAS ONLY BOTTOM NAV, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-bottom-nav:min-h-[calc(100vh-var(--bottom-nav-height)-var(--bottom-nav-bottom-offset)-var(--bottom-nav-top-offset)-env(safe-area-inset-bottom))]",
  // HAS RESPONSIVE NAV, AND VIEWPORT IS MOBILE, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-responsive-nav:min-h-[calc(100vh-var(--bottom-nav-height)-var(--bottom-nav-bottom-offset)-var(--bottom-nav-top-offset)-env(safe-area-inset-bottom)-env(safe-area-inset-top))]",
  // HAS RESPONSIVE NAV, AND VIEWPORT IS DESKTOP, SET WIREFRAME CONTENT MIN HEIGHT
  "min-wf-nav:has-data-wf-responsive-nav:min-h-[calc(100vh-var(--top-nav-height)-var(--top-nav-top-offset)-var(--top-nav-bottom-offset)-env(safe-area-inset-top)-env(safe-area-inset-bottom))]",

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

const responsiveCornersConfig = {
  navbar: {
    left: [
      // HAS RESPONSIVE NAV AND LEFT SIDEBAR AND VIEWPORT IS MOBILE, ADD BOTTOM MARGIN TO LEFT SIDEBAR
      "has-data-wf-responsive-nav:has-data-wf-left-sidebar:**:data-wf-left-sidebar:mb-(--bottom-nav-height)",
      // HAS RESPONSIVE NAV AND LEFT SIDEBAR AND VIEWPORT IS DESKTOP, ADD TOP MARGIN TO LEFT SIDEBAR
      "min-wf-nav:has-data-wf-responsive-nav:has-data-wf-left-sidebar:**:data-wf-left-sidebar:mt-(--top-nav-height) min-wf-nav:has-data-wf-responsive-nav:has-data-wf-left-sidebar:**:data-wf-left-sidebar:mb-0",
    ],
    right: [
      // HAS RESPONSIVE NAV AND RIGHT SIDEBAR AND VIEWPORT IS MOBILE, ADD BOTTOM MARGIN TO RIGHT SIDEBAR
      "has-data-wf-responsive-nav:has-data-wf-right-sidebar:**:data-wf-right-sidebar:mb-(--bottom-nav-height)",
      // HAS RESPONSIVE NAV AND RIGHT SIDEBAR AND VIEWPORT IS DESKTOP, ADD TOP MARGIN TO RIGHT SIDEBAR
      "min-wf-nav:has-data-wf-responsive-nav:has-data-wf-right-sidebar:**:data-wf-right-sidebar:mt-(--top-nav-height) min-wf-nav:has-data-wf-responsive-nav:has-data-wf-right-sidebar:**:data-wf-right-sidebar:mb-0",
    ],
  },
  sidebar: {
    left: [
      // HAS RESPONSIVE NAV AND LEFT SIDEBAR=EXPANDED, ADD LEFT MARGIN WIREFRAME RESPONSIVE NAV
      "has-data-wf-responsive-nav:has-data-[wf-left-sidebar=expanded]:**:data-wf-responsive-nav:ml-[calc(var(--left-sidebar-width-expanded)+var(--left-sidebar-left-offset)+var(--left-sidebar-right-offset))]",
      // HAS RESPONSIVE NAV AND LEFT SIDEBAR=COLLAPSED, ADD LEFT MARGIN WIREFRAME RESPONSIVE NAV
      "has-data-wf-responsive-nav:has-data-[wf-left-sidebar=collapsed]:**:data-wf-responsive-nav:ml-[calc(var(--left-sidebar-width-collapsed)+var(--left-sidebar-left-offset)+var(--left-sidebar-right-offset))]",
    ],
    right: [
      // HAS RESPONSIVE NAV AND RIGHT SIDEBAR=EXPANDED, ADD RIGHT MARGIN WIREFRAME RESPONSIVE NAV
      "has-data-wf-responsive-nav:has-data-[wf-right-sidebar=expanded]:**:data-wf-responsive-nav:mr-[calc(var(--right-sidebar-width-expanded)+var(--right-sidebar-right-offset)+var(--right-sidebar-left-offset))]",
      // HAS RESPONSIVE NAV AND RIGHT SIDEBAR=COLLAPSED, ADD RIGHT MARGIN WIREFRAME RESPONSIVE NAV
      "has-data-wf-responsive-nav:has-data-[wf-right-sidebar=collapsed]:**:data-wf-responsive-nav:mr-[calc(var(--right-sidebar-width-collapsed)+var(--right-sidebar-right-offset)+var(--right-sidebar-left-offset))]",
    ],
  },
} as const

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

type WireframeCornerOptions = "navbar" | "sidebar"

function tailwindSpacing(value: number) {
  return `calc(var(--spacing) * ${value})`
}

function parseCssVariable(
  value?: string | number,
  defaultValue: string = "0px"
) {
  if (typeof value === "number") {
    return tailwindSpacing(value)
  }

  return value ?? defaultValue
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
  config?: {
    safeAreas?: boolean
    cssVariables?: Partial<Record<WireframeCSSVariables, string | number>>
    corners?: {
      topLeft?: WireframeCornerOptions
      topRight?: WireframeCornerOptions
      bottomLeft?: WireframeCornerOptions
      bottomRight?: WireframeCornerOptions
      responsive?: {
        left?: WireframeCornerOptions
        right?: WireframeCornerOptions
      }
    }
  }
}) {
  return (
    <div
      className={cn(
        defaultConfig,
        cornersConfig[config?.corners?.topLeft ?? "sidebar"].topLeft,
        cornersConfig[config?.corners?.topRight ?? "sidebar"].topRight,
        cornersConfig[config?.corners?.bottomLeft ?? "sidebar"].bottomLeft,
        cornersConfig[config?.corners?.bottomRight ?? "sidebar"].bottomRight,
        responsiveCornersConfig[config?.corners?.responsive?.left ?? "sidebar"]
          .left,
        responsiveCornersConfig[config?.corners?.responsive?.right ?? "sidebar"]
          .right,
        className
      )}
      style={
        {
          // STICKY NAV
          "--sticky-nav-height": parseCssVariable(
            config?.cssVariables?.["--sticky-nav-height"],
            tailwindSpacing(12)
          ),
          "--sticky-nav-top-offset": parseCssVariable(
            config?.cssVariables?.["--sticky-nav-top-offset"]
          ),

          // TOP NAV
          "--top-nav-height": parseCssVariable(
            config?.cssVariables?.["--top-nav-height"],
            tailwindSpacing(16)
          ),
          "--top-nav-left-offset": parseCssVariable(
            config?.cssVariables?.["--top-nav-left-offset"]
          ),
          "--top-nav-right-offset": parseCssVariable(
            config?.cssVariables?.["--top-nav-right-offset"]
          ),
          "--top-nav-top-offset": parseCssVariable(
            config?.cssVariables?.["--top-nav-top-offset"]
          ),
          "--top-nav-bottom-offset": parseCssVariable(
            config?.cssVariables?.["--top-nav-bottom-offset"]
          ),

          // BOTTOM NAV
          "--bottom-nav-height": parseCssVariable(
            config?.cssVariables?.["--bottom-nav-height"],
            tailwindSpacing(8)
          ),
          "--bottom-nav-left-offset": parseCssVariable(
            config?.cssVariables?.["--bottom-nav-left-offset"]
          ),
          "--bottom-nav-right-offset": parseCssVariable(
            config?.cssVariables?.["--bottom-nav-right-offset"]
          ),
          "--bottom-nav-top-offset": parseCssVariable(
            config?.cssVariables?.["--bottom-nav-top-offset"]
          ),
          "--bottom-nav-bottom-offset": parseCssVariable(
            config?.cssVariables?.["--bottom-nav-bottom-offset"]
          ),

          // LEFT SIDEBAR
          "--left-sidebar-width-collapsed": parseCssVariable(
            config?.cssVariables?.["--left-sidebar-width-collapsed"],
            tailwindSpacing(16)
          ),
          "--left-sidebar-width-expanded": parseCssVariable(
            config?.cssVariables?.["--left-sidebar-width-expanded"],
            tailwindSpacing(52)
          ),
          "--left-sidebar-left-offset": parseCssVariable(
            config?.cssVariables?.["--left-sidebar-left-offset"]
          ),
          "--left-sidebar-right-offset": parseCssVariable(
            config?.cssVariables?.["--left-sidebar-right-offset"]
          ),
          "--left-sidebar-top-offset": parseCssVariable(
            config?.cssVariables?.["--left-sidebar-top-offset"]
          ),
          "--left-sidebar-bottom-offset": parseCssVariable(
            config?.cssVariables?.["--left-sidebar-bottom-offset"]
          ),

          // RIGHT SIDEBAR
          "--right-sidebar-width-expanded": parseCssVariable(
            config?.cssVariables?.["--right-sidebar-width-expanded"],
            tailwindSpacing(52)
          ),
          "--right-sidebar-width-collapsed": parseCssVariable(
            config?.cssVariables?.["--right-sidebar-width-collapsed"],
            tailwindSpacing(16)
          ),
          "--right-sidebar-left-offset": parseCssVariable(
            config?.cssVariables?.["--right-sidebar-left-offset"]
          ),
          "--right-sidebar-right-offset": parseCssVariable(
            config?.cssVariables?.["--right-sidebar-right-offset"]
          ),
          "--right-sidebar-top-offset": parseCssVariable(
            config?.cssVariables?.["--right-sidebar-top-offset"]
          ),
          "--right-sidebar-bottom-offset": parseCssVariable(
            config?.cssVariables?.["--right-sidebar-bottom-offset"]
          ),
        } satisfies Record<WireframeCSSVariables, string> as React.CSSProperties
      }
      {...props}
    >
      {config?.safeAreas && (
        <>
          <SafeAreaInsetTop />
          <SafeAreaInsetBottom />
          <SafeAreaInsetLeft />
          <SafeAreaInsetRight />
        </>
      )}

      {children}
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
  ...props
}: React.ComponentProps<"div"> & {
  position?: "top" | "bottom" | "responsive"
}) {
  if (position === "responsive") {
    return (
      <div
        className={cn(
          "fixed z-50",
          // FOR MOBILE VIEWPORTS
          "right-[calc(var(--bottom-nav-right-offset)+env(safe-area-inset-right))]",
          "bottom-[calc(var(--bottom-nav-bottom-offset)+env(safe-area-inset-bottom))]",
          "left-[calc(var(--bottom-nav-left-offset)+env(safe-area-inset-left))]",
          "h-(--bottom-nav-height)",
          // FOR DESKTOP VIEWPORTS
          "min-wf-nav:top-[calc(var(--top-nav-top-offset)+env(safe-area-inset-top))]",
          "min-wf-nav:right-[calc(var(--top-nav-right-offset)+env(safe-area-inset-right))]",
          "min-wf-nav:left-[calc(var(--top-nav-left-offset)+env(safe-area-inset-left))]",
          "min-wf-nav:h-(--top-nav-height)",
          "min-wf-nav:bottom-auto",
          className
        )}
        data-wf-responsive-nav
        {...props}
      >
        {children}
      </div>
    )
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

function WireframeSidebar({
  className,
  children,
  collapsed = false,
  position = "left",
  ...props
}: React.ComponentProps<"div"> & {
  collapsed?: boolean
  position?: WireframeSidebarPosition
}) {
  return (
    <div
      className={cn(
        "fixed z-50 overflow-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
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
  Wireframe,
  SafeAreaInsetTop,
  SafeAreaInsetBottom,
  SafeAreaInsetLeft,
  SafeAreaInsetRight,
  WireframeNav,
  WireframeSidebar,
  WireframeStickyNav,
  type WireframeSidebarPosition,
}
