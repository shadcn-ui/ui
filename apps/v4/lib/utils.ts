import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

// Copied from aria base so that @/lib/utils works within this repo.
export type PlacementSide =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "inline-start"
  | "inline-end"
export type PlacementAlign = "start" | "center" | "end"

const horizontalPlacement = {
  left: "left",
  right: "right",
  "inline-start": "start",
  "inline-end": "end",
} as const

const verticalAlignment = {
  start: "top",
  center: "center",
  end: "bottom",
} as const

export function getPlacement(side: PlacementSide, align: PlacementAlign) {
  switch (side) {
    case "top":
    case "bottom":
      return align === "center" ? side : (`${side} ${align}` as const)
    default:
      return align === "center"
        ? horizontalPlacement[side]
        : (`${horizontalPlacement[side]} ${verticalAlignment[align]}` as const)
  }
}
