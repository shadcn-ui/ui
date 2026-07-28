import * as React from "react"

import { cn } from "@/lib/utils"

// Each blob is a union of overlapping shapes with the same fill, so they merge
// into one seamless silhouette (same trick as the hero quatrefoil clip-path).
const SHAPES = {
  // 8-petal scalloped flower
  flower: (
    <>
      {(
        [
          [75, 50],
          [67.7, 67.7],
          [50, 75],
          [32.3, 67.7],
          [25, 50],
          [32.3, 32.3],
          [50, 25],
          [67.7, 32.3],
        ] as const
      ).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="15" />
      ))}
      <circle cx="50" cy="50" r="24" />
    </>
  ),
  // 4-lobe quatrefoil
  quatrefoil: (
    <>
      <circle cx="34" cy="34" r="24" />
      <circle cx="66" cy="34" r="24" />
      <circle cx="34" cy="66" r="24" />
      <circle cx="66" cy="66" r="24" />
    </>
  ),
  // 3-lobe tulip / crown
  tulip: (
    <>
      <circle cx="30" cy="40" r="20" />
      <circle cx="50" cy="30" r="22" />
      <circle cx="70" cy="40" r="20" />
      <circle cx="50" cy="60" r="28" />
    </>
  ),
  // stacked squircle
  stack: (
    <>
      <rect x="22" y="14" width="56" height="22" rx="11" />
      <rect x="10" y="36" width="80" height="26" rx="13" />
      <rect x="24" y="60" width="52" height="24" rx="12" />
    </>
  ),
}

export type FeatureShape = keyof typeof SHAPES

// Shared "talking stick" across all feature icons: only the holder may spin, so
// no two blobs ever spin at the same time. Any icon that wants to spin while
// it's taken simply backs off and tries again after a fresh random gap.
let spinLock = false

function FeatureIcon({
  shape,
  className,
  children,
}: {
  shape: FeatureShape
  className?: string
  children: React.ReactNode
}) {
  const [spinning, setSpinning] = React.useState(false)

  // Each icon keeps its own timer, spinning its background blob once at random
  // intervals. A shared lock (spinLock) guarantees only one blob spins at a
  // time — if the lock is taken, this icon backs off a fresh random gap and
  // retries, so the spins stay scattered but never overlap.
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let idle: number
    let spin: number
    let holdsLock = false
    const randomGap = () => 4000 + Math.random() * 8000 // 4–12s
    const attempt = () => {
      if (spinLock) {
        idle = window.setTimeout(attempt, randomGap()) // busy — try again later
        return
      }
      spinLock = true
      holdsLock = true
      setSpinning(true)
      spin = window.setTimeout(() => {
        setSpinning(false)
        spinLock = false
        holdsLock = false
        idle = window.setTimeout(attempt, randomGap())
      }, 1200) // matches the feature-spin duration below
    }
    idle = window.setTimeout(attempt, randomGap())
    return () => {
      window.clearTimeout(idle)
      window.clearTimeout(spin)
      if (holdsLock) spinLock = false // release if we're torn down mid-spin
    }
  }, [])

  return (
    <div
      className={cn(
        "relative flex size-20 items-center justify-center",
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className={cn(
          "absolute inset-0 size-full fill-primary",
          spinning && "[animation:feature-spin_1.2s_ease-in-out]"
        )}
        aria-hidden="true"
      >
        {SHAPES[shape]}
      </svg>
      <span className="relative text-foreground [&_svg]:size-8">
        {children}
      </span>
    </div>
  )
}

export { FeatureIcon }
