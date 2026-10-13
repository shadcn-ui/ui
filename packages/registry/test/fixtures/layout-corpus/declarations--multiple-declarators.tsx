import { Roboto, Lora } from "next/font/google"

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" }), lora = Lora({ subsets: ["latin"], variable: "--font-serif" })

export default function L({ children }) {
  return <html lang="en" className={cn(roboto.variable, lora.variable)}><body>{children}</body></html>
}
