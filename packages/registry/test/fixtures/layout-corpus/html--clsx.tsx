import "./styles.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={clsx("dark", isRtl && "rtl")}>
      <body>{children}</body>
    </html>
  )
}
