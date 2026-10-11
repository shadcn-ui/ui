import "./styles.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={htmlClass}>
      <body>{children}</body>
    </html>
  )
}
