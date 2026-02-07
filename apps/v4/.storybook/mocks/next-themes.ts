import * as React from "react"

export const useTheme = () => ({
  theme: "light",
  setTheme: () => {},
  resolvedTheme: "light",
  themes: ["light", "dark"],
  systemTheme: "light",
  forcedTheme: undefined,
})

export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode
}) => children
