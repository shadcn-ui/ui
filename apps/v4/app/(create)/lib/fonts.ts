import localFont from "next/font/local"

const inter = localFont({
  src: "../../../public/fonts/inter/inter-v20-latin-regular.woff2",
  variable: "--font-inter",
  display: "swap",
})

const notoSans = localFont({
  src: "../../../public/fonts/noto-sans/noto-sans-v42-latin-regular.woff2",
  variable: "--font-noto-sans",
  display: "swap",
})

const nunitoSans = localFont({
  src: "../../../public/fonts/nunito-sans/nunito-sans-v19-latin-regular.woff2",
  variable: "--font-nunito-sans",
  display: "swap",
})

const figtree = localFont({
  src: "../../../public/fonts/figtree/figtree-v9-latin-regular.woff2",
  variable: "--font-figtree",
  display: "swap",
})

const jetbrainsMono = localFont({
  src: "../../../public/fonts/jetbrains-mono/jetbrains-mono-v24-latin-regular.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
})

// const geistSans = localFont({
//   src: "../../../public/fonts/geist/geist-v4-latin-regular.woff2",
//   variable: "--font-geist-sans",
//   display: "swap",
// })

// const geistMono = localFont({
//   src: "../../../public/fonts/geist-mono/geist-mono-v4-latin-regular.woff2",
//   variable: "--font-geist-mono",
//   display: "swap",
// })

const roboto = localFont({
  src: "../../../public/fonts/roboto/roboto-v50-latin-regular.woff2",
  variable: "--font-roboto",
  display: "swap",
})

const raleway = localFont({
  src: "../../../public/fonts/raleway/raleway-v37-latin-regular.woff2",
  variable: "--font-raleway",
  display: "swap",
})

const dmSans = localFont({
  src: "../../../public/fonts/dm-sans/dm-sans-v17-latin-regular.woff2",
  variable: "--font-dm-sans",
  display: "swap",
})

const publicSans = localFont({
  src: "../../../public/fonts/public-sans/public-sans-v21-latin-regular.woff2",
  variable: "--font-public-sans",
  display: "swap",
})

const outfit = localFont({
  src: "../../../public/fonts/outfit/outfit-v15-latin-regular.woff2",
  variable: "--font-outfit",
  display: "swap",
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
