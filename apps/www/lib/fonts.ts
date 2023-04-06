import {
  JetBrains_Mono as FontMono,
  DM_Sans as FontSans,
} from "next/font/google"
import localFont from "next/font/local"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontHeading = localFont({
  src: "../assets/fonts/CalSans-Semibold.woff2",
  variable: "--font-heading",
})
