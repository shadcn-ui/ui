import { cx, CxOptions } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}
