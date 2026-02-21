import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const DEFAULT_APP_URL = "http://localhost:4000"
const DEFAULT_V0_URL = "https://v0.dev"

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

export const APP_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_APP_URL
)

export const V0_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_V0_URL ?? DEFAULT_V0_URL
)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${APP_URL}${path}`
}
