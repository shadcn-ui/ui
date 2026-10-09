import * as React from "react"

import { cn } from "@/lib/utils"

// Resolves any CSS color (hex, rgb, oklch, color-mix) to sRGB by painting one pixel.
// Translucent colors are composited over the backdrop, as the browser would.
function toRgb(color: string, backdrop = "#fff") {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) {
    return null
  }
  context.fillStyle = backdrop
  context.fillRect(0, 0, 1, 1)
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

function toHex(rgb: number[]) {
  return `#${rgb.map((value) => value.toString(16).padStart(2, "0")).join("")}`
}

function luminance([r, g, b]: number[]) {
  const [R, G, B] = [r, g, b].map((value) => {
    const channel = value / 255
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function contrast(a: number[], b: number[]) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

export function ColorPair({
  name,
  background,
  foreground,
  className,
}: {
  name: string
  background: string
  foreground: string
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [info, setInfo] = React.useState<{ ratio: number; bg: string } | null>(
    null
  )

  React.useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }
    // Re-measure when the theme class on <html> changes.
    const measure = () => {
      const style = getComputedStyle(element)
      const page = getComputedStyle(document.body).backgroundColor
      const bg = toRgb(style.backgroundColor, page)
      if (!bg) {
        return
      }
      const fg = toRgb(style.color, toHex(bg))
      if (fg) {
        setInfo({ ratio: contrast(bg, fg), bg: toHex(bg) })
      }
    }
    measure()
    const observer = new MutationObserver(measure)
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const level = !info
    ? ""
    : info.ratio >= 7
      ? "AAA"
      : info.ratio >= 4.5
        ? "AA"
        : info.ratio >= 3
          ? "AA Large"
          : "Fail"

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border",
        className
      )}
    >
      <div
        ref={ref}
        style={{
          backgroundColor: `var(--${background})`,
          color: `var(--${foreground})`,
        }}
        className="flex h-24 items-end justify-between p-4"
      >
        <span className="text-2xl font-medium">Aa</span>
        {info && (
          <span className="rounded-full border border-current/20 px-2 py-0.5 font-mono text-xs">
            {info.ratio.toFixed(2)} {level}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 bg-background p-3">
        <span className="text-sm font-medium">{name}</span>
        <span className="font-mono text-xs text-muted-foreground">
          --{background} / --{foreground}
        </span>
        {info && (
          <span className="font-mono text-xs text-muted-foreground">
            {info.bg}
          </span>
        )}
      </div>
    </div>
  )
}
