import { Geist, Geist_Mono, IBM_Plex_Mono, Inter } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const fontIBM = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-mono",
  weight: ["400", "500", "600", "700"],
})

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontIBM.variable,
  fontInter.variable
)
