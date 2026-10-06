import { Roboto } from "next/font/google"

const roboto = /* body */ Roboto({
  subsets: ["latin"],
  variable: "--font-sans", // root
})

export default function L({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
