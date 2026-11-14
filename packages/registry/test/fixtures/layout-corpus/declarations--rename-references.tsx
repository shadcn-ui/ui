import { Roboto } from "next/font/google"

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })

function other(roboto: string) {
  return roboto.length
}

export const f = { roboto, other: { roboto: 1 } }
export { roboto as default2 }

export default function L({ children }) {
  const x = roboto
  return <html lang="en" className={roboto.variable}><body data-font={roboto.className}>{children}</body></html>
}
