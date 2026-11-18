import { Inter } from "next/font/google"
import "./globals.css"

let theme: string
const inter = Inter()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
