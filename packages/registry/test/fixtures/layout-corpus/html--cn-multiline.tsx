import "./styles.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        "font-mono",
        "antialiased",
        isDark && "dark"
      )}
    >
      <body>{children}</body>
    </html>
  )
}
