import {
  ColorPickerArea as Area,
  ColorPickerAreaThumb as AreaThumb,
  ColorPickerCopy as Copy,
  ColorPickerEyeDropper as EyeDropper,
  ColorPickerInput as Input,
  ColorPickerRoot as Root,
  ColorPickerSlider as Slider,
  ColorPickerSliderThumb as SliderThumb,
  ColorPickerSwatch as Swatch,
} from "./components"

export const ColorPicker = {
  Root,
  Area,
  AreaThumb,
  Slider,
  SliderThumb,
  Input,
  Swatch,
  EyeDropper,
  Copy,
}

export type { ColorPickerFormat } from "./color"
export type { ColorPickerChannel, ColorPickerDirection } from "./types"
