import localFont from "next/font/local"

import { cn } from "@/lib/utils"

const fontSans = localFont({
  src: "../public/fonts/geist/geist-v4-latin-regular.woff2",
  variable: "--font-sans",
  display: "swap",
})

const fontMono = localFont({
  src: "../public/fonts/geist-mono/geist-mono-v4-latin-regular.woff2",
  variable: "--font-mono",
  display: "swap",
})

const fontInter = localFont({
  src: "../public/fonts/inter/inter-v20-latin-regular.woff2",
  variable: "--font-inter",
  display: "swap",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInter.variable
)
