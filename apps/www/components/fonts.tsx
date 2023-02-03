"use client"

import {
  JetBrains_Mono as FontMono,
  Inter as FontSans,
} from "@next/font/google"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: 'swap',
})

export function Fonts() {
  return (
    <>
      <style jsx global>{`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
					--font-mono: ${fontMono.style.fontFamily};
				}
			}`}</style>
    </>
  )
}
