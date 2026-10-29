import {
  Roboto, // body
} from "next/font/google"

const roboto = Roboto({ subsets: ["latin"], variable: "--font-display" })

export default function L({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
