@@directive("'use client'")

module NextThemes = {
  type theme =
    | @as("system") System
    | @as("light") Light
    | @as("dark") Dark
  type themeState = {theme: option<theme>}

  @module("next-themes")
  external useTheme: unit => themeState = "useTheme"
}

type toasterIcons = {
  success: React.element,
  info: React.element,
  warning: React.element,
  error: React.element,
  loading: React.element,
}

type toastClassNames = {toast: string}
type toastOptions = {classNames: toastClassNames}

type toasterProps = {
  theme?: NextThemes.theme,
  className?: string,
  style?: ReactDOM.Style.t,
  icons?: toasterIcons,
  toastOptions?: toastOptions,
}

module SonnerPrimitive = {
  @module("sonner")
  external make: React.component<toasterProps> = "Toaster"
}

@react.component
let make = (
  ~theme=?,
  ~className="toaster group",
  ~style=ReactDOM.Style.unsafeAddStyle(
    {},
    {
      "--normal-bg": "var(--popover)",
      "--normal-text": "var(--popover-foreground)",
      "--normal-border": "var(--border)",
      "--border-radius": "var(--radius)",
    },
  ),
  ~icons={
    success: <Icons.CircleCheck className="size-4" />,
    info: <Icons.Info className="size-4" />,
    warning: <Icons.TriangleAlert className="size-4" />,
    error: <Icons.OctagonX className="size-4" />,
    loading: <Icons.Loader2 className="size-4 animate-spin" />,
  },
  ~toastOptions={classNames: {toast: "cn-toast"}},
) => {
  let {theme: defaultTheme} = NextThemes.useTheme()
  let theme = theme->Option.getOr(defaultTheme)->Option.getOr(System)

  <SonnerPrimitive theme className style icons toastOptions />
}
