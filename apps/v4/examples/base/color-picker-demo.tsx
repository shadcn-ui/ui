"use client"

import { useState } from "react"

import { ColorPicker } from "@/styles/base-nova/ui/color-picker"

export function ColorPickerDemo() {
  const [color, setColor] = useState("#ef4444")

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-6">
      <ColorPicker value={color} onChange={setColor} showShade />
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-8 rounded-full border border-border shadow-sm transition-colors"
          style={{ backgroundColor: color }}
        />
        <span className="font-mono text-sm text-muted-foreground">{color}</span>
      </div>
    </div>
  )
}
