import "./styles.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={/* fonts */ cn("antialiased")}>
      <body>{children}</body>
    </html>
  )
}
