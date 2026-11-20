import { Inter } from "next/font/google"

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'})

export default function L({ children }) {
  return <html lang="en" className={interHeading.variable}><body>{children}</body></html>
}
