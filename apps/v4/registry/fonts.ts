import {
  Figtree,
  Geist,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
  Noto_Sans,
  Nunito_Sans,
} from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
})

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
})

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const FONTS = [
  {
    name: "Inter",
    value: "inter",
    font: inter,
  },
  {
    name: "Noto Sans",
    value: "noto-sans",
    font: notoSans,
  },
  {
    name: "Nunito Sans",
    value: "nunito-sans",
    font: nunitoSans,
  },
  {
    name: "Figtree",
    value: "figtree",
    font: figtree,
  },
  {
    name: "JetBrains Mono",
    value: "jetbrains-mono",
    font: jetbrainsMono,
  },
  {
    name: "Geist Sans",
    value: "geist-sans",
    font: geistSans,
  },
  {
    name: "Geist Mono",
    value: "geist-mono",
    font: geistMono,
  },
] as const

export type Font = (typeof FONTS)[number]
