import {
  DM_Sans,
  Figtree,
  Geist,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
  Noto_Sans,
  Nunito_Sans,
  Outfit,
  Public_Sans,
  Raleway,
  Roboto,
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

// const geistSans = Geist({
//   subsets: ["latin"],
//   variable: "--font-geist-sans",
// })

// const geistMono = Geist_Mono({
//   subsets: ["latin"],
//   variable: "--font-geist-mono",
// })

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const FONTS = [
  // {
  //   name: "Geist Sans",
  //   value: "geist",
  //   font: geistSans,
  //   type: "sans",
  // },
  {
    name: "Inter",
    value: "inter",
    font: inter,
    type: "sans",
  },
  {
    name: "Noto Sans",
    value: "noto-sans",
    font: notoSans,
    type: "sans",
  },
  {
    name: "Nunito Sans",
    value: "nunito-sans",
    font: nunitoSans,
    type: "sans",
  },
  {
    name: "Figtree",
    value: "figtree",
    font: figtree,
    type: "sans",
  },
  {
    name: "Roboto",
    value: "roboto",
    font: roboto,
    type: "sans",
  },
  {
    name: "Raleway",
    value: "raleway",
    font: raleway,
    type: "sans",
  },
  {
    name: "DM Sans",
    value: "dm-sans",
    font: dmSans,
    type: "sans",
  },
  {
    name: "Public Sans",
    value: "public-sans",
    font: publicSans,
    type: "sans",
  },
  {
    name: "Outfit",
    value: "outfit",
    font: outfit,
    type: "sans",
  },
  {
    name: "JetBrains Mono",
    value: "jetbrains-mono",
    font: jetbrainsMono,
    type: "mono",
  },
  // {
  //   name: "Geist Mono",
  //   value: "geist-mono",
  //   font: geistMono,
  //   type: "mono",
  // },
] as const

export type Font = (typeof FONTS)[number]
