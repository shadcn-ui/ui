import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type PlacementSide =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "inline-start"
  | "inline-end"
export type PlacementAlign = "start" | "center" | "end"

export function getPlacement(side: PlacementSide, align: PlacementAlign) {
  if (side === "inline-start") {
    return "start"
  }

  if (side === "inline-end") {
    return "end"
  }

  if (align === "center") {
    return side
  }

  if (side === "left" || side === "right") {
    const crossPlacement = align === "start" ? "top" : "bottom"
    return `${side} ${crossPlacement}` as const
  }

  return `${side} ${align}` as const
}
