import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * ترکیب و ادغام کلاس‌های Tailwind بدون تداخل.
 * This is the same `cn` helper used across shadcn-vue projects, with full
 * support for RTL logical utilities such as `ms-*`, `me-*` and `start-*`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
