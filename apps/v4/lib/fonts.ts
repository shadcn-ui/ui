import {
  Noto_Sans as FontSans,
  Noto_Sans_Mono as FontMono,
  Noto_Sans_Arabic as FontNotoSansArabic,
  Noto_Sans_Hebrew as FontNotoSansHebrew,
  Inter,
} from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const fontNotoSansArabic = FontNotoSansArabic({
  subsets: ["latin"],
  variable: "--font-ar",
})

const fontNotoSansHebrew = FontNotoSansHebrew({
  subsets: ["latin"],
  variable: "--font-he",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInter.variable,
  fontNotoSansArabic.variable,
  fontNotoSansHebrew.variable
)
