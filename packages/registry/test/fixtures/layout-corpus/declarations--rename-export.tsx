import { Roboto } from "next/font/google"

export const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })

export default function L({ children }) {
  return <html lang="en" className={cn(roboto.variable, "x")}><body>{children}</body></html>
}
