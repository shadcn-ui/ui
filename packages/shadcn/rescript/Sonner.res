@@directive("'use client'")

open BaseUi.Types


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

type toasterStyle = {
  @as("--normal-bg") normalBg: string,
  @as("--normal-text") normalText: string,
  @as("--normal-border") normalBorder: string,
  @as("--border-radius") borderRadius: string,
}

external toStyle: toasterStyle => ReactDOM.Style.t = "%identity"

module SonnerPrimitive = {
  @module("sonner")
  external make: React.component<toasterProps> = "Toaster"
}

@react.componentWithProps
let make = (props: props<string, bool>) => {
  let theme = NextThemes.useTheme().theme->Option.getOr("system")
  let className = `toaster group ${props.className->Option.getOr("")}`
  let icons: toasterIcons = {
    success: <Icons.CircleCheck className="size-4" />,
    info: <Icons.Info className="size-4" />,
    warning: <Icons.TriangleAlert className="size-4" />,
    error: <Icons.OctagonX className="size-4" />,
    loading: <Icons.Loader2 className="size-4 animate-spin" />,
  }
  let style =
    toStyle({
      normalBg: "var(--popover)",
      normalText: "var(--popover-foreground)",
      normalBorder: "var(--border)",
      borderRadius: "var(--radius)",
    })
  let toastOptions = {classNames: {toast: "cn-toast"}}
  <SonnerPrimitive theme className style icons toastOptions />
}
