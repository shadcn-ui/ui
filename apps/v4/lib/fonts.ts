// Temporarily disabled Google fonts due to compilation error
// import {
//   Inter,
// } from "next/font/google"

import { cn } from "@/lib/utils"

// Use CSS fallback fonts instead of Google fonts
const fontSans = {
  variable: "--font-sans",
}

const fontMono = {
  variable: "--font-mono",
}

const fontInter = {
  variable: "--font-inter",
}

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInter.variable
)
