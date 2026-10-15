import "./styles.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" {...htmlProps}>
      <body>{children}</body>
    </html>
  )
}
