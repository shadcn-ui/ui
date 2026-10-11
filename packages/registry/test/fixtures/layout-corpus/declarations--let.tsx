import { Roboto } from "next/font/google"

let roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })

export default function L({ children }) {
  return <html lang="en" className={roboto.variable}><body>{children}</body></html>
}
