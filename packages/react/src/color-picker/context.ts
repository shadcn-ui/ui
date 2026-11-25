import * as React from "react"

import type {
  ColorPickerAreaContextValue,
  ColorPickerContextValue,
  ColorPickerSliderContextValue,
} from "./types"

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(
  null
)
const ColorPickerAreaContext =
  React.createContext<ColorPickerAreaContextValue | null>(null)
const ColorPickerSliderContext =
  React.createContext<ColorPickerSliderContextValue | null>(null)

function useColorPickerContext(component: string) {
  const context = React.useContext(ColorPickerContext)

  if (!context) {
    throw new Error(
      `${component} must be used within a ColorPicker.Root component.`
    )
  }

  return context
}

function useColorPickerAreaContext(component: string) {
  const context = React.useContext(ColorPickerAreaContext)

  if (!context) {
    throw new Error(
      `${component} must be used within a ColorPicker.Area component.`
    )
  }

  return context
}

function useColorPickerSliderContext(component: string) {
  const context = React.useContext(ColorPickerSliderContext)

  if (!context) {
    throw new Error(
      `${component} must be used within a ColorPicker.Slider component.`
    )
  }

  return context
}

export {
  ColorPickerAreaContext,
  ColorPickerContext,
  ColorPickerSliderContext,
  useColorPickerAreaContext,
  useColorPickerContext,
  useColorPickerSliderContext,
}
