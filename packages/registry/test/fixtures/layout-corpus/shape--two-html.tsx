import "./globals.css"

export default function L({ children, a }) {
  if (a) return <html lang="en"><body>{children}</body></html>
  return (
    <html lang="fr" className="x">
      <body>{children}</body>
    </html>
  )
}
