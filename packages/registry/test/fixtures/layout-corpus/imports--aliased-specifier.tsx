import { Inter as InterFont } from "next/font/google"

const inter = InterFont({ subsets: ["latin"], variable: "--font-sans" })

export default function L({ children }) {
  return <html lang="en" className={inter.variable}><body>{children}</body></html>
}
