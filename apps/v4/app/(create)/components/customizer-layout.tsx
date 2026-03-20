"use client"

import * as React from "react"

import {
  getCustomizerDesktopPickerSide,
  type CustomizerDesktopPickerSide,
  type CustomizerPosition,
} from "@/app/(create)/lib/customizer"

type CustomizerLayoutContextValue = {
  position: CustomizerPosition
  desktopPickerSide: CustomizerDesktopPickerSide
}

const CustomizerLayoutContext =
  React.createContext<CustomizerLayoutContextValue | null>(null)

export function CustomizerLayoutProvider({
  position,
  children,
}: React.PropsWithChildren<{
  position: CustomizerPosition
}>) {
  const value = React.useMemo(
    () => ({
      position,
      desktopPickerSide: getCustomizerDesktopPickerSide(position),
    }),
    [position]
  )

  return (
    <CustomizerLayoutContext.Provider value={value}>
      {children}
    </CustomizerLayoutContext.Provider>
  )
}

export function useCustomizerLayout() {
  const context = React.useContext(CustomizerLayoutContext)

  if (!context) {
    throw new Error(
      "useCustomizerLayout must be used within a CustomizerLayoutProvider"
    )
  }

  return context
}
