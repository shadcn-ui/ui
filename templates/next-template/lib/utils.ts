import { ClassNameValue, twJoin } from "tailwind-merge"

export function cn(...inputs: ClassNameValue[]) {
  return twJoin(...inputs)
}
