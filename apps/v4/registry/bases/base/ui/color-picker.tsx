"use client"

import * as React from "react"
import { ColorPicker as ColorPickerPrimitive } from "@shadcn/react/color-picker"
import { cn } from "cn"

import { buttonVariants, type Button } from "@/registry/bases/base/ui/button"
import { Input } from "@/registry/bases/base/ui/input"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function ColorPicker({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.Root>) {
  return (
    <ColorPickerPrimitive.Root
      data-slot="color-picker"
      className={cn("cn-color-picker flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function ColorPickerArea({
  className,
  ...props
}: Omit<React.ComponentProps<typeof ColorPickerPrimitive.Area>, "children">) {
  return (
    <ColorPickerPrimitive.Area
      data-slot="color-picker-area"
      className={cn(
        "cn-color-picker-area relative w-full touch-none select-none data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ColorPickerPrimitive.AreaThumb
        data-slot="color-picker-area-thumb"
        className="cn-color-picker-area-thumb block shrink-0 select-none"
      />
    </ColorPickerPrimitive.Area>
  )
}

function ColorPickerSlider({
  className,
  ...props
}: Omit<React.ComponentProps<typeof ColorPickerPrimitive.Slider>, "children">) {
  return (
    <ColorPickerPrimitive.Slider
      className={cn(
        "cn-color-picker-slider relative w-full touch-none select-none data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ColorPickerPrimitive.SliderThumb
        data-slot="color-picker-slider-thumb"
        className="cn-color-picker-slider-thumb block shrink-0 select-none"
      />
    </ColorPickerPrimitive.Slider>
  )
}

function ColorPickerHue({
  className,
  ...props
}: Omit<React.ComponentProps<typeof ColorPickerSlider>, "channel">) {
  return (
    <ColorPickerSlider
      channel="hue"
      data-slot="color-picker-hue"
      className={cn("cn-color-picker-hue", className)}
      {...props}
    />
  )
}

function ColorPickerAlpha({
  className,
  ...props
}: Omit<React.ComponentProps<typeof ColorPickerSlider>, "channel">) {
  return (
    <ColorPickerSlider
      channel="alpha"
      data-slot="color-picker-alpha"
      className={cn("cn-color-picker-alpha", className)}
      {...props}
    />
  )
}

function ColorPickerSwatch({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.Swatch>) {
  return (
    <ColorPickerPrimitive.Swatch
      data-slot="color-picker-swatch"
      className={cn("cn-color-picker-swatch shrink-0", className)}
      {...props}
    />
  )
}

function ColorPickerInput({
  className,
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.Input>) {
  return (
    <ColorPickerPrimitive.Input
      data-slot="color-picker-input"
      render={<Input />}
      className={cn("cn-color-picker-input", className)}
      {...props}
    />
  )
}

function ColorPickerEyeDropper({
  children,
  className,
  size = "icon",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.EyeDropper> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <ColorPickerPrimitive.EyeDropper
      data-slot="color-picker-eye-dropper"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "cn-color-picker-eye-dropper",
        className
      )}
      {...props}
    >
      {children ?? (
        <IconPlaceholder
          lucide="PipetteIcon"
          tabler="IconColorPicker"
          hugeicons="ColorPickerIcon"
          phosphor="EyedropperIcon"
          remixicon="RiSipLine"
        />
      )}
    </ColorPickerPrimitive.EyeDropper>
  )
}

function ColorPickerCopy({
  children,
  className,
  size = "icon",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof ColorPickerPrimitive.Copy> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <ColorPickerPrimitive.Copy
      data-slot="color-picker-copy"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "cn-color-picker-copy",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <IconPlaceholder
            className="group-data-copied/button:hidden"
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy01Icon"
            phosphor="CopyIcon"
            remixicon="RiFileCopyLine"
          />
          <IconPlaceholder
            className="hidden group-data-copied/button:block"
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </>
      )}
    </ColorPickerPrimitive.Copy>
  )
}

export {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerCopy,
  ColorPickerEyeDropper,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatch,
}
