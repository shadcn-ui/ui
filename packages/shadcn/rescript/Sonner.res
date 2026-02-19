@@directive("'use client'")

module NextThemes = {
  type themeState = {theme?: string}

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
  theme?: string,
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
let make = (~theme=?, ~className=?, ~style=?, ~icons=?, ~toastOptions=?) => {
  let theme = switch theme {
  | Some(value) => value
  | None => NextThemes.useTheme().theme->Option.getOr("system")
  }
  let className = className->Option.getOr("toaster group")
  let defaultIcons: toasterIcons = {
    success: <Icons.CircleCheck className="size-4" />,
    info: <Icons.Info className="size-4" />,
    warning: <Icons.TriangleAlert className="size-4" />,
    error: <Icons.OctagonX className="size-4" />,
    loading: <Icons.Loader2 className="size-4 animate-spin" />,
  }
  let defaultStyle = ReactDOM.Style.unsafeAddStyle(
    {},
    {
      "--normal-bg": "var(--popover)",
      "--normal-text": "var(--popover-foreground)",
      "--normal-border": "var(--border)",
      "--border-radius": "var(--radius)",
    },
  )
  let icons = icons->Option.getOr(defaultIcons)
  let style = style->Option.getOr(defaultStyle)
  let toastOptions = toastOptions->Option.getOr({classNames: {toast: "cn-toast"}})
  <SonnerPrimitive theme className style icons toastOptions />
}
