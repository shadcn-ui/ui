import {
  Lora as FontLora,
  Geist_Mono as FontMono,
  Noto_Sans as FontNotoSans,
  Noto_Sans_Arabic as FontNotoSansArabic,
  Noto_Sans_Hebrew as FontNotoSansHebrew,
  Noto_Serif as FontNotoSerif,
  Geist as FontSans,
  Inter,
  Playfair_Display,
} from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
})

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const fontNotoSans = FontNotoSans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
})

const fontNotoSerif = FontNotoSerif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
})

const fontNotoSansArabic = FontNotoSansArabic({
  subsets: ["latin"],
  variable: "--font-ar",
})

const fontNotoSansHebrew = FontNotoSansHebrew({
  subsets: ["latin"],
  variable: "--font-he",
})

const fontLora = FontLora({
  subsets: ["latin"],
  variable: "--font-lora",
})

const fontPlayfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInter.variable,
  fontNotoSans.variable,
  fontNotoSerif.variable,
  fontNotoSansArabic.variable,
  fontNotoSansHebrew.variable,
  fontPlayfairDisplay.variable,
  fontLora.variable
)
