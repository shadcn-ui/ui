import "./styles.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={isDark ? "dark" : "light"}>
      <body>{children}</body>
    </html>
  )
}
