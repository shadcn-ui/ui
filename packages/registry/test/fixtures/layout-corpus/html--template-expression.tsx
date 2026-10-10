import "./styles.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${theme === "dark" ? "dark" : ""} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
