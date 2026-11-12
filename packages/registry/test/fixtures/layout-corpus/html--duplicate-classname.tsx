import "./styles.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="a" lang="en" className={b}>
      <body>{children}</body>
    </html>
  )
}
