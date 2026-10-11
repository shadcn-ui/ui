import "./styles.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("antialiased", "scroll-smooth")}>
      <body>{children}</body>
    </html>
  )
}
