import type { ClassValue } from "clsx"

import { cn } from "@/lib/utils"

const defaultConfig: ClassValue[] = [
  // HAS TOP NAV, ADD TOP MARGIN WIREFRAME ROOT
  "has-data-wf-top-nav:mt-[calc(var(--top-nav-height)+var(--top-nav-top-offset)+var(--top-nav-bottom-offset))]",

  // HAS BOTTOM NAV, ADD BOTTOM MARGIN WIREFRAME CONTENT
  "has-data-wf-bottom-nav:mb-[calc(var(--bottom-nav-height)+var(--bottom-nav-bottom-offset)+var(--bottom-nav-top-offset))]",

  // HAS LEFT SIDEBAR=EXPANDED, ADD LEFT MARGIN WIREFRAME CONTENT
  "has-data-[wf-left-sidebar=expanded]:ml-[calc(var(--left-sidebar-width-expanded)+var(--left-sidebar-left-offset)+var(--left-sidebar-right-offset))]",
  // HAS RIGHT SIDEBAR=EXPANDED, ADD RIGHT MARGIN WIREFRAME CONTENT
  "has-data-[wf-right-sidebar=expanded]:mr-[calc(var(--right-sidebar-width-expanded)+var(--right-sidebar-right-offset)+var(--right-sidebar-left-offset))]",
  // HAS LEFT SIDEBAR=COLLAPSED, ADD LEFT MARGIN WIREFRAME CONTENT
  "has-data-[wf-left-sidebar=collapsed]:ml-[calc(var(--left-sidebar-width-collapsed)+var(--left-sidebar-left-offset)+var(--left-sidebar-right-offset))]",
  // HAS RIGHT SIDEBAR=COLLAPSED, ADD RIGHT MARGIN WIREFRAME CONTENT
  "has-data-[wf-right-sidebar=collapsed]:mr-[calc(var(--right-sidebar-width-collapsed)+var(--right-sidebar-right-offset)+var(--right-sidebar-left-offset))]",

  // HAS RESPONSIVE NAV, AND VIEWPORT IS MOBILE, ADD BOTTOM MARGINS
  "has-data-wf-responsive-nav:mb-[calc(var(--bottom-nav-height)+var(--bottom-nav-bottom-offset)+var(--bottom-nav-top-offset))]",
  // HAS RESPONSIVE NAV, AND VIEWPORT IS DESKTOP, ADD TOP MARGINS
  "min-wf-nav:has-data-wf-responsive-nav:mt-[calc(var(--top-nav-height)+var(--top-nav-top-offset)+var(--top-nav-bottom-offset))] min-wf-nav:has-data-wf-responsive-nav:mb-0",

  // HAS TOP AND BOTTOM NAV, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-top-nav:has-data-wf-bottom-nav:min-h-[calc(100vh-var(--top-nav-height)-var(--bottom-nav-height)-var(--top-nav-top-offset)-var(--bottom-nav-bottom-offset)-var(--top-nav-bottom-offset)-var(--bottom-nav-top-offset))]",
  // HAS ONLY TOP NAV, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-top-nav:min-h-[calc(100vh-var(--top-nav-height)-var(--top-nav-top-offset)-var(--top-nav-bottom-offset))]",
  // HAS ONLY BOTTOM NAV, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-bottom-nav:min-h-[calc(100vh-var(--bottom-nav-height)-var(--bottom-nav-bottom-offset)-var(--bottom-nav-top-offset))]",
  // HAS RESPONSIVE NAV, AND VIEWPORT IS MOBILE, SET WIREFRAME CONTENT MIN HEIGHT
  "has-data-wf-responsive-nav:min-h-[calc(100vh-var(--bottom-nav-height)-var(--bottom-nav-bottom-offset)-var(--bottom-nav-top-offset))]",
  // HAS RESPONSIVE NAV, AND VIEWPORT IS DESKTOP, SET WIREFRAME CONTENT MIN HEIGHT
  "min-wf-nav:has-data-wf-responsive-nav:min-h-[calc(100vh-var(--top-nav-height)-var(--top-nav-top-offset)-var(--top-nav-bottom-offset))]",

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

function Wireframe({
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config?: {
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
        "sticky top-(--sticky-nav-top-offset) z-50 h-(--sticky-nav-height) w-full",
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
          "min-wf-nav:top-(--top-nav-top-offset) min-wf-nav:right-(--top-nav-right-offset) min-wf-nav:bottom-auto min-wf-nav:left-(--top-nav-left-offset) min-wf-nav:h-(--top-nav-height) fixed right-(--bottom-nav-right-offset) bottom-(--bottom-nav-bottom-offset) left-(--bottom-nav-left-offset) z-50 h-(--bottom-nav-height)",
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
          ? "top-(--top-nav-top-offset) right-(--top-nav-right-offset) left-(--top-nav-left-offset) h-(--top-nav-height)"
          : "right-(--bottom-nav-right-offset) bottom-(--bottom-nav-bottom-offset) left-(--bottom-nav-left-offset) h-(--bottom-nav-height)",
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
              "top-(--left-sidebar-top-offset) bottom-(--left-sidebar-bottom-offset) left-(--left-sidebar-left-offset)",
              collapsed
                ? "w-(--left-sidebar-width-collapsed)"
                : "w-(--left-sidebar-width-expanded)",
            ]
          : [
              "top-(--right-sidebar-top-offset) right-(--right-sidebar-right-offset) bottom-(--right-sidebar-bottom-offset)",
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
  WireframeNav,
  WireframeSidebar,
  WireframeStickyNav,
  type WireframeSidebarPosition,
}
